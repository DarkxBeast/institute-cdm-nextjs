'use server'

import { createClient } from '@/utils/supabase/server'

// --- Types ---

export interface StudentOption {
    id: string
    studentName: string
}

export interface AnalyticsReport {
    id: string
    reportType: string
    reportData: Record<string, any>
    createdAt: string
    journeyItemId: string | null
    journeyItemName: string | null
    sequenceOrder: number
    mentorName: string | null
}

// --- Service ---

/**
 * Get students for a batch (lightweight, for dropdown).
 */
export async function getStudentsForBatch(
    batchId: string
): Promise<{ data: StudentOption[]; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: students, error } = await supabase
            .from('cdm_students')
            .select('id, full_name')
            .eq('batch_id', batchId)
            .order('full_name', { ascending: true })

        if (error) {
            console.warn('Error fetching students for batch:', error)
            return { data: [], error: error.message }
        }

        const mapped: StudentOption[] = (students ?? []).map((s: any) => ({
            id: s.id,
            studentName: s.full_name ?? 'Unknown',
        }))

        return { data: mapped, error: null }
    } catch (err: any) {
        console.error('Error in getStudentsForBatch:', err?.message ?? err)
        return { data: [], error: err?.message ?? 'Unknown error' }
    }
}

/**
 * Get ALL reports for a student across all report types.
 * Used to power the analytics view.
 */
export async function getStudentAllReports(
    studentId: string
): Promise<{ data: AnalyticsReport[]; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: reports, error } = await supabase
            .from('cdm_student_reports')
            .select(`
                id,
                report_type,
                report_data,
                created_at,
                journey_item_id,
                attendee:cdm_session_attendees!cdm_reports_attendee_fkey!inner (
                    student_id
                ),
                session:cdm_journey_sessions!cdm_student_reports_session_id_fkey (
                    mentors_new ( mentor_first_name, mentor_last_name ),
                    cdm_learning_journey_items ( particulars, sequence_order )
                )
            `)
            .eq('attendee.student_id', studentId)
            .order('created_at', { ascending: true })

        if (error) {
            console.warn('Error fetching all student reports:', error)
            return { data: [], error: error.message }
        }

        if (!reports || reports.length === 0) {
            return { data: [], error: null }
        }

        const mapped: AnalyticsReport[] = reports.map((r: any) => {
            const session = r.session
            const mentor = session?.mentors_new
            const ji = session?.cdm_learning_journey_items

            return {
                id: r.id,
                reportType: r.report_type,
                reportData: r.report_data ?? {},
                createdAt: r.created_at ?? '',
                journeyItemId: r.journey_item_id ?? null,
                journeyItemName: ji?.particulars ?? null,
                sequenceOrder: ji?.sequence_order ?? 0,
                mentorName: [mentor?.mentor_first_name, mentor?.mentor_last_name].filter(Boolean).join(' ') || null,
            }
        })

        return { data: mapped, error: null }
    } catch (err: any) {
        console.error('Error in getStudentAllReports:', err?.message ?? err)
        return { data: [], error: err?.message ?? 'Unknown error' }
    }
}

// ── Student Engagement ──

export interface StudentSessionDetail {
    sessionName: string
    journeyItemName: string
    attendanceStatus: string
    hasFeedback: boolean
    isReportGenerated: boolean
}

export interface StudentEngagement {
    attendanceRate: number
    feedbackRate: number
    totalSessions: number
    sessionsAttended: number
    sessionDetails: StudentSessionDetail[]
}

/**
 * Get engagement metrics for a specific student in a batch.
 * Attendance, feedback submission, and report generation per session.
 */
export async function getStudentEngagement(
    studentId: string
): Promise<{ data: StudentEngagement | null; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Get all session attendee records for this student, joined with session + journey item info
        const { data: attendees, error: attErr } = await supabase
            .from('cdm_session_attendees')
            .select(`
                attendance_status,
                feedback_data,
                is_report_generated,
                session_name,
                journey_item_id,
                session:cdm_journey_sessions!cdm_attendees_session_fkey (
                    journey_item_name,
                    scheduled_date
                ),
                journey_item:cdm_learning_journey_items!cdm_attendees_lji_fkey (
                    sequence_order
                )
            `)
            .eq('student_id', studentId)

        if (attErr) throw new Error(attErr.message)

        // Sort by journey item sequence_order so sessions appear in learning journey order
        const list = (attendees ?? []).sort((a: any, b: any) => {
            const seqA = a.journey_item?.sequence_order ?? 999
            const seqB = b.journey_item?.sequence_order ?? 999
            return seqA - seqB
        })

        let sessionsAttended = 0
        let feedbackCount = 0

        const sessionDetails: StudentSessionDetail[] = list.map((a: any) => {
            const present = (a.attendance_status ?? '').trim().toLowerCase() === 'present'
            const hasFb = a.feedback_data != null
                && typeof a.feedback_data === 'object'
                && Object.keys(a.feedback_data).length > 0

            if (present) {
                sessionsAttended++
                if (hasFb) feedbackCount++
            }

            return {
                sessionName: a.session_name ?? 'Session',
                journeyItemName: a.session?.journey_item_name ?? a.session_name ?? 'Unknown',
                attendanceStatus: present ? 'Present' : (a.attendance_status ?? 'Pending'),
                hasFeedback: hasFb,
                isReportGenerated: a.is_report_generated ?? false,
            }
        })

        const totalSessions = list.length
        const attendanceRate = totalSessions > 0 ? (sessionsAttended / totalSessions) * 100 : 0
        const feedbackRate = sessionsAttended > 0 ? (feedbackCount / sessionsAttended) * 100 : 0

        return {
            data: {
                attendanceRate,
                feedbackRate,
                totalSessions,
                sessionsAttended,
                sessionDetails,
            },
            error: null,
        }
    } catch (err: any) {
        console.error('Error in getStudentEngagement:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
