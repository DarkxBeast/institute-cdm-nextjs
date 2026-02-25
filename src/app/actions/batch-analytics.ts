'use server'

import { createClient } from '@/utils/supabase/server'

// ── Types ──

export interface JourneyItemSummary {
    name: string
    status: string
    avgRating: number
    sessionsCompleted: number
    totalSessions: number
}

export interface BatchAnalyticsData {
    totalStudents: number
    studentsWithReports: number
    totalReports: number
    reportsByType: { type: string; count: number }[]
    avgRating: number
    ratingDistribution: { range: string; count: number }[]
    topPerformers: { name: string; avgRating: number; reportCount: number }[]
    // Engagement
    attendanceRate: number
    feedbackRate: number
    journeyProgress: { completed: number; total: number }
    sessionStats: { totalSessions: number; completedSessions: number }
    journeyItems: JourneyItemSummary[]
}

export interface InstituteBatchSummary {
    batchId: string
    batchName: string
    studentCount: number
    reportCount: number
    avgRating: number
    completionRate: number
    status: string
    // Engagement
    attendanceRate: number
    feedbackRate: number
}

export interface InstituteAnalyticsData {
    totalBatches: number
    totalStudents: number
    totalReports: number
    overallAvgRating: number
    batches: InstituteBatchSummary[]
    reportsByType: { type: string; count: number }[]
    // Engagement
    overallAttendanceRate: number
    overallFeedbackRate: number
}

// ── Helpers ──

function extractOverallRating(reportData: Record<string, any>): number | null {
    const meta = reportData?.meta
    if (meta && typeof meta === 'object' && typeof meta.overall_rating === 'number') {
        return meta.overall_rating
    }
    return null
}

function isPresent(status: string | null): boolean {
    return (status ?? '').trim().toLowerCase() === 'present'
}

function hasFeedback(feedbackData: any): boolean {
    if (!feedbackData) return false
    if (typeof feedbackData === 'object' && Object.keys(feedbackData).length === 0) return false
    return true
}

// ── Batch-Level Analytics ──

export async function getBatchAnalytics(
    batchId: string
): Promise<{ data: BatchAnalyticsData | null; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // 1. Get all students in this batch
        const { data: students, error: studentsErr } = await supabase
            .from('cdm_students')
            .select('id, full_name')
            .eq('batch_id', batchId)

        if (studentsErr) throw new Error(studentsErr.message)
        if (!students || students.length === 0) {
            return {
                data: {
                    totalStudents: 0, studentsWithReports: 0, totalReports: 0,
                    reportsByType: [], avgRating: 0, ratingDistribution: [],
                    topPerformers: [],
                    attendanceRate: 0, feedbackRate: 0,
                    journeyProgress: { completed: 0, total: 0 },
                    sessionStats: { totalSessions: 0, completedSessions: 0 },
                    journeyItems: [],
                },
                error: null,
            }
        }

        const studentIds = students.map((s) => s.id)
        const studentNameMap: Record<string, string> = {}
        for (const s of students) {
            studentNameMap[s.id] = s.full_name ?? 'Unknown'
        }

        // 2. Get all reports for these students via attendees
        const { data: reports, error: reportsErr } = await supabase
            .from('cdm_student_reports')
            .select(`
                id, report_type, report_data,
                attendee:cdm_session_attendees!cdm_reports_attendee_fkey!inner (
                    student_id
                )
            `)
            .in('attendee.student_id', studentIds)

        if (reportsErr) throw new Error(reportsErr.message)
        const reportsList = reports ?? []

        // 3. Compute report-based metrics
        const studentsWithReportsSet = new Set<string>()
        const studentRatings: Record<string, number[]> = {}
        const typeCountMap: Record<string, number> = {}

        for (const r of reportsList) {
            const studentId = (r.attendee as any)?.student_id
            if (studentId) {
                studentsWithReportsSet.add(studentId)
                const rating = extractOverallRating((r.report_data ?? {}) as Record<string, any>)
                if (rating !== null) {
                    if (!studentRatings[studentId]) studentRatings[studentId] = []
                    studentRatings[studentId].push(rating)
                }
            }
            const type = r.report_type ?? 'Unknown'
            typeCountMap[type] = (typeCountMap[type] || 0) + 1
        }

        const reportsByType = Object.entries(typeCountMap).map(([type, count]) => ({ type, count }))

        const allRatings: number[] = []
        for (const ratings of Object.values(studentRatings)) {
            allRatings.push(...ratings)
        }
        const avgRating = allRatings.length > 0
            ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
            : 0

        // Rating distribution
        const buckets: Record<string, number> = {
            '0–1': 0, '1–2': 0, '2–3': 0, '3–4': 0, '4–5': 0,
        }
        for (const [, ratings] of Object.entries(studentRatings)) {
            const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length
            if (avg <= 1) buckets['0–1']++
            else if (avg <= 2) buckets['1–2']++
            else if (avg <= 3) buckets['2–3']++
            else if (avg <= 4) buckets['3–4']++
            else buckets['4–5']++
        }
        const ratingDistribution = Object.entries(buckets).map(([range, count]) => ({ range, count }))

        // Top 5 performers
        const performerData = Object.entries(studentRatings)
            .map(([studentId, ratings]) => ({
                name: studentNameMap[studentId] ?? 'Unknown',
                avgRating: ratings.reduce((s, r) => s + r, 0) / ratings.length,
                reportCount: ratings.length,
            }))
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, 5)

        // 4. Engagement — attendance & feedback from session attendees
        const { data: attendees, error: attErr } = await supabase
            .from('cdm_session_attendees')
            .select('attendance_status, feedback_data')
            .in('student_id', studentIds)

        if (attErr) throw new Error(attErr.message)
        const attendeesList = attendees ?? []

        let totalAttendees = attendeesList.length
        let presentCount = 0
        let feedbackCount = 0
        for (const a of attendeesList) {
            if (isPresent(a.attendance_status)) {
                presentCount++
                if (hasFeedback(a.feedback_data)) feedbackCount++
            }
        }
        const attendanceRate = totalAttendees > 0 ? (presentCount / totalAttendees) * 100 : 0
        const feedbackRate = presentCount > 0 ? (feedbackCount / presentCount) * 100 : 0

        // 5. Journey items & sessions for this batch
        const { data: journeys } = await supabase
            .from('cdm_learning_journeys')
            .select('id')
            .eq('batch_id', batchId)

        let journeyItems: JourneyItemSummary[] = []
        let journeyCompleted = 0
        let journeyTotal = 0
        let totalSessions = 0
        let completedSessions = 0

        if (journeys && journeys.length > 0) {
            const journeyIds = journeys.map((j) => j.id)

            const { data: items } = await supabase
                .from('cdm_learning_journey_items')
                .select('id, particulars, status, average_rating, num_sessions')
                .in('learning_journey_id', journeyIds)
                .order('sequence_order', { ascending: true })

            if (items && items.length > 0) {
                journeyTotal = items.length
                journeyCompleted = items.filter((i) => i.status === 'Completed').length

                const itemIds = items.map((i) => i.id)
                const { data: sessions } = await supabase
                    .from('cdm_journey_sessions')
                    .select('id, journey_item_id, status')
                    .in('journey_item_id', itemIds)

                const sessionsByItem: Record<string, { total: number; completed: number }> = {}
                if (sessions) {
                    for (const sess of sessions) {
                        const iid = sess.journey_item_id ?? ''
                        if (!sessionsByItem[iid]) sessionsByItem[iid] = { total: 0, completed: 0 }
                        sessionsByItem[iid].total++
                        totalSessions++
                        if (sess.status === 'Completed') {
                            sessionsByItem[iid].completed++
                            completedSessions++
                        }
                    }
                }

                journeyItems = items.map((item) => ({
                    name: item.particulars ?? 'Untitled',
                    status: item.status ?? 'Unknown',
                    avgRating: Number(item.average_rating ?? 0),
                    sessionsCompleted: sessionsByItem[item.id]?.completed ?? 0,
                    totalSessions: sessionsByItem[item.id]?.total ?? (item.num_sessions ?? 0),
                }))
            }
        }

        return {
            data: {
                totalStudents: students.length,
                studentsWithReports: studentsWithReportsSet.size,
                totalReports: reportsList.length,
                reportsByType, avgRating, ratingDistribution,
                topPerformers: performerData,
                attendanceRate, feedbackRate,
                journeyProgress: { completed: journeyCompleted, total: journeyTotal },
                sessionStats: { totalSessions, completedSessions },
                journeyItems,
            },
            error: null,
        }
    } catch (err: any) {
        console.error('Error in getBatchAnalytics:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}

// ── Institute-Level Analytics ──

export async function getInstituteAnalytics(): Promise<{
    data: InstituteAnalyticsData | null
    error: string | null
}> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Get user's institute
        const { data: pocData } = await supabase
            .from('cdm_institute_pocs')
            .select('institute_id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!pocData?.institute_id) {
            return { data: null, error: 'No institute associated with your account' }
        }
        const instituteId = pocData.institute_id

        // Get all batches
        const { data: batches, error: batchesErr } = await supabase
            .from('cdm_batches')
            .select('id, name, status')
            .eq('institute_id', instituteId)
            .order('created_at', { ascending: false })

        if (batchesErr) throw new Error(batchesErr.message)
        if (!batches || batches.length === 0) {
            return {
                data: {
                    totalBatches: 0, totalStudents: 0, totalReports: 0,
                    overallAvgRating: 0, batches: [], reportsByType: [],
                    overallAttendanceRate: 0, overallFeedbackRate: 0,
                },
                error: null,
            }
        }

        const batchIds = batches.map((b) => b.id)

        // Get all students
        const { data: allStudents, error: studentsErr } = await supabase
            .from('cdm_students')
            .select('id, batch_id')
            .in('batch_id', batchIds)

        if (studentsErr) throw new Error(studentsErr.message)
        const studentsList = allStudents ?? []

        // batchId → student IDs
        const batchStudents: Record<string, string[]> = {}
        for (const s of studentsList) {
            const bId = s.batch_id
            if (!bId) continue
            if (!batchStudents[bId]) batchStudents[bId] = []
            batchStudents[bId].push(s.id)
        }

        const allStudentIds = studentsList.map((s) => s.id)

        // Get all reports via attendees
        let reportsList: any[] = []
        if (allStudentIds.length > 0) {
            try {
                const { data: reports, error: reportsErr } = await supabase
                    .from('cdm_student_reports')
                    .select(`
                        id, report_type, report_data,
                        attendee:cdm_session_attendees!cdm_reports_attendee_fkey!inner (
                            student_id
                        )
                    `)
                    .in('attendee.student_id', allStudentIds)

                if (reportsErr) {
                    console.warn('Reports query returned an error (may be empty):', reportsErr.message)
                } else {
                    reportsList = reports ?? []
                }
            } catch (e) {
                console.warn('Reports query failed:', e)
            }
        }

        // student → batch mapping
        const studentToBatch: Record<string, string> = {}
        for (const s of studentsList) {
            if (s.batch_id) studentToBatch[s.id] = s.batch_id
        }

        // Aggregate reports per batch
        const batchReportCounts: Record<string, number> = {}
        const batchStudentsWithReports: Record<string, Set<string>> = {}
        const batchRatingSums: Record<string, number[]> = {}
        const overallTypeCount: Record<string, number> = {}

        for (const r of reportsList) {
            const studentId = (r.attendee as any)?.student_id
            if (!studentId) continue
            const bId = studentToBatch[studentId]
            if (!bId) continue

            batchReportCounts[bId] = (batchReportCounts[bId] || 0) + 1

            if (!batchStudentsWithReports[bId]) batchStudentsWithReports[bId] = new Set()
            batchStudentsWithReports[bId].add(studentId)

            const rating = extractOverallRating((r.report_data ?? {}) as Record<string, any>)
            if (rating !== null) {
                if (!batchRatingSums[bId]) batchRatingSums[bId] = []
                batchRatingSums[bId].push(rating)
            }

            const type = r.report_type ?? 'Unknown'
            overallTypeCount[type] = (overallTypeCount[type] || 0) + 1
        }

        // Engagement — all attendees across the institute
        let allAttendees: any[] = []
        if (allStudentIds.length > 0) {
            try {
                const { data: att, error: attErr } = await supabase
                    .from('cdm_session_attendees')
                    .select('student_id, attendance_status, feedback_data')
                    .in('student_id', allStudentIds)

                if (attErr) {
                    console.warn('Attendees query returned an error (may be empty):', attErr.message)
                } else {
                    allAttendees = att ?? []
                }
            } catch (e) {
                console.warn('Attendees query failed:', e)
            }
        }

        // Per-batch attendance/feedback
        const batchAttendance: Record<string, { total: number; present: number; feedback: number }> = {}
        let totalPresent = 0
        let totalFeedback = 0
        let totalAttRows = allAttendees.length

        for (const a of allAttendees) {
            const bId = studentToBatch[a.student_id]
            if (!bId) continue
            if (!batchAttendance[bId]) batchAttendance[bId] = { total: 0, present: 0, feedback: 0 }
            batchAttendance[bId].total++
            if (isPresent(a.attendance_status)) {
                batchAttendance[bId].present++
                totalPresent++
                if (hasFeedback(a.feedback_data)) {
                    batchAttendance[bId].feedback++
                    totalFeedback++
                }
            }
        }

        const overallAttendanceRate = totalAttRows > 0 ? (totalPresent / totalAttRows) * 100 : 0
        const overallFeedbackRate = totalPresent > 0 ? (totalFeedback / totalPresent) * 100 : 0

        // Build batch summaries
        const batchSummaries: InstituteBatchSummary[] = batches.map((b) => {
            const studentCount = batchStudents[b.id]?.length ?? 0
            const reportCount = batchReportCounts[b.id] ?? 0
            const ratings = batchRatingSums[b.id] ?? []
            const bAvgRating = ratings.length > 0
                ? ratings.reduce((s, r) => s + r, 0) / ratings.length
                : 0
            const withReports = batchStudentsWithReports[b.id]?.size ?? 0
            const completionRate = studentCount > 0 ? (withReports / studentCount) * 100 : 0

            const ba = batchAttendance[b.id]
            const bAttRate = ba && ba.total > 0 ? (ba.present / ba.total) * 100 : 0
            const bFbRate = ba && ba.present > 0 ? (ba.feedback / ba.present) * 100 : 0

            return {
                batchId: b.id,
                batchName: b.name,
                studentCount, reportCount,
                avgRating: bAvgRating, completionRate,
                status: b.status ?? 'Unknown',
                attendanceRate: bAttRate,
                feedbackRate: bFbRate,
            }
        })

        // Overall metrics
        const allRatings: number[] = []
        for (const ratings of Object.values(batchRatingSums)) {
            allRatings.push(...ratings)
        }
        const reportsByType = Object.entries(overallTypeCount).map(([type, count]) => ({ type, count }))

        return {
            data: {
                totalBatches: batches.length,
                totalStudents: studentsList.length,
                totalReports: reportsList.length,
                overallAvgRating: allRatings.length > 0
                    ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
                    : 0,
                batches: batchSummaries,
                reportsByType,
                overallAttendanceRate,
                overallFeedbackRate,
            },
            error: null,
        }
    } catch (err: any) {
        console.error('Error in getInstituteAnalytics:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
