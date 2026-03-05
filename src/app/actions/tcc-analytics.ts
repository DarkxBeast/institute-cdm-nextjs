'use server'

import { createClient } from '@/utils/supabase/server'

// ── Types ──

export interface DiagnosticMetrics {
    count: number
    avgExperience: number
    avgClarity: number
    avgHelpfulness: number
    avgConfidence: number
}

export interface ResumeReviewMetrics {
    count: number
    avgExperience: number
    avgConfidence: number
    clarityYesPercent: number
    preparednessYesPercent: number
}

export interface SectoralWorkshopMetrics {
    count: number
    avgDelivery: number
    avgHelpfulness: number
    clarityYesPercent: number
    interestYesPercent: number
    byWorkshop: {
        name: string
        count: number
        avgDelivery: number
        avgHelpfulness: number
    }[]
}

export interface MasterclassMetrics {
    count: number
    avgContentQuality: number
    avgRelevance: number
}

export interface MentorPerformance {
    mentorId: string
    mentorName: string
    sessionCount: number
    avgRating: number
    feedbackCount: number
}

export interface TccAnalyticsData {
    totalFeedbacks: number
    totalSessions: number
    totalMentors: number
    overallAvgRating: number
    diagnosticInterview: DiagnosticMetrics
    resumeReview: ResumeReviewMetrics
    sectoralWorkshop: SectoralWorkshopMetrics
    masterclass: MasterclassMetrics
    mentorPerformance: MentorPerformance[]
}

// ── Helpers ──

function avg(nums: number[]): number {
    if (nums.length === 0) return 0
    return nums.reduce((a, b) => a + b, 0) / nums.length
}

function yesPercent(values: string[]): number {
    if (values.length === 0) return 0
    const yesCount = values.filter(v =>
        typeof v === 'string' && v.trim().toLowerCase() === 'yes'
    ).length
    return Math.round((yesCount / values.length) * 100)
}

/** Extract feedback fields, handling both flat and nested (older) format */
function normalizeFeedback(fd: any): any {
    if (fd?.feedback && typeof fd.feedback === 'object') {
        return { ...fd.feedback }
    }
    return { ...fd }
}

function classifyType(particulars: string): 'diagnostic' | 'resume' | 'sectoral' | 'masterclass' | 'unknown' {
    const p = (particulars ?? '').toLowerCase()
    if (p.startsWith('diagnostic')) return 'diagnostic'
    if (p.startsWith('resume review')) return 'resume'
    if (p.includes('sectoral') || p.includes('role workshop')) return 'sectoral'
    if (p.startsWith('masterclass')) return 'masterclass'
    return 'unknown'
}

// ── Main Action ──

export async function getTccAnalytics(
    batchId?: string
): Promise<{ data: TccAnalyticsData | null; error: string | null }> {
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

        // Get all batches for this institute
        const { data: instituteBatches, error: batchesErr } = await supabase
            .from('cdm_batches')
            .select('id')
            .eq('institute_id', instituteId)

        if (batchesErr) throw new Error(batchesErr.message)
        if (!instituteBatches || instituteBatches.length === 0) {
            return {
                data: {
                    totalFeedbacks: 0, totalSessions: 0, totalMentors: 0, overallAvgRating: 0,
                    diagnosticInterview: { count: 0, avgExperience: 0, avgClarity: 0, avgHelpfulness: 0, avgConfidence: 0 },
                    resumeReview: { count: 0, avgExperience: 0, avgConfidence: 0, clarityYesPercent: 0, preparednessYesPercent: 0 },
                    sectoralWorkshop: { count: 0, avgDelivery: 0, avgHelpfulness: 0, clarityYesPercent: 0, interestYesPercent: 0, byWorkshop: [] },
                    masterclass: { count: 0, avgContentQuality: 0, avgRelevance: 0 },
                    mentorPerformance: [],
                },
                error: null,
            }
        }

        // Determine which batch IDs to scope by
        const targetBatchIds = batchId
            ? instituteBatches.filter(b => b.id === batchId).map(b => b.id)
            : instituteBatches.map(b => b.id)

        // If a specific batchId was requested but doesn't belong to this institute, return empty
        if (batchId && targetBatchIds.length === 0) {
            return {
                data: {
                    totalFeedbacks: 0, totalSessions: 0, totalMentors: 0, overallAvgRating: 0,
                    diagnosticInterview: { count: 0, avgExperience: 0, avgClarity: 0, avgHelpfulness: 0, avgConfidence: 0 },
                    resumeReview: { count: 0, avgExperience: 0, avgConfidence: 0, clarityYesPercent: 0, preparednessYesPercent: 0 },
                    sectoralWorkshop: { count: 0, avgDelivery: 0, avgHelpfulness: 0, clarityYesPercent: 0, interestYesPercent: 0, byWorkshop: [] },
                    masterclass: { count: 0, avgContentQuality: 0, avgRelevance: 0 },
                    mentorPerformance: [],
                },
                error: null,
            }
        }

        // Get learning journeys for the target batches
        const { data: journeys } = await supabase
            .from('cdm_learning_journeys')
            .select('id')
            .in('batch_id', targetBatchIds)

        if (!journeys || journeys.length === 0) {
            return {
                data: {
                    totalFeedbacks: 0, totalSessions: 0, totalMentors: 0, overallAvgRating: 0,
                    diagnosticInterview: { count: 0, avgExperience: 0, avgClarity: 0, avgHelpfulness: 0, avgConfidence: 0 },
                    resumeReview: { count: 0, avgExperience: 0, avgConfidence: 0, clarityYesPercent: 0, preparednessYesPercent: 0 },
                    sectoralWorkshop: { count: 0, avgDelivery: 0, avgHelpfulness: 0, clarityYesPercent: 0, interestYesPercent: 0, byWorkshop: [] },
                    masterclass: { count: 0, avgContentQuality: 0, avgRelevance: 0 },
                    mentorPerformance: [],
                },
                error: null,
            }
        }

        // Get journey item IDs scoped to this institute's batches
        const journeyIds = journeys.map(j => j.id)
        const { data: journeyItems } = await supabase
            .from('cdm_learning_journey_items')
            .select('id')
            .in('learning_journey_id', journeyIds)

        if (!journeyItems || journeyItems.length === 0) {
            return {
                data: {
                    totalFeedbacks: 0, totalSessions: 0, totalMentors: 0, overallAvgRating: 0,
                    diagnosticInterview: { count: 0, avgExperience: 0, avgClarity: 0, avgHelpfulness: 0, avgConfidence: 0 },
                    resumeReview: { count: 0, avgExperience: 0, avgConfidence: 0, clarityYesPercent: 0, preparednessYesPercent: 0 },
                    sectoralWorkshop: { count: 0, avgDelivery: 0, avgHelpfulness: 0, clarityYesPercent: 0, interestYesPercent: 0, byWorkshop: [] },
                    masterclass: { count: 0, avgContentQuality: 0, avgRelevance: 0 },
                    mentorPerformance: [],
                },
                error: null,
            }
        }

        const instituteItemIds = journeyItems.map(ji => ji.id)

        // Build query — fetch all feedbacks with session + mentor + journey item info
        // Scoped to this institute's journey items only
        const query = supabase
            .from('cdm_session_attendees')
            .select(`
                id,
                feedback_data,
                attendance_status,
                session_id,
                student_id,
                journey_item_id,
                cdm_journey_sessions!cdm_attendees_session_fkey (
                    id,
                    mentor_id,
                    mentors_new ( id, mentor_first_name, mentor_last_name )
                ),
                cdm_learning_journey_items!cdm_attendees_lji_fkey (
                    particulars
                )
            `)
            .not('feedback_data', 'eq', '{}')
            .in('journey_item_id', instituteItemIds)

        const { data: attendees, error } = await query

        if (error) {
            console.error('Error fetching TCC analytics:', error)
            return { data: null, error: error.message }
        }

        if (!attendees || attendees.length === 0) {
            return {
                data: {
                    totalFeedbacks: 0,
                    totalSessions: 0,
                    totalMentors: 0,
                    overallAvgRating: 0,
                    diagnosticInterview: { count: 0, avgExperience: 0, avgClarity: 0, avgHelpfulness: 0, avgConfidence: 0 },
                    resumeReview: { count: 0, avgExperience: 0, avgConfidence: 0, clarityYesPercent: 0, preparednessYesPercent: 0 },
                    sectoralWorkshop: { count: 0, avgDelivery: 0, avgHelpfulness: 0, clarityYesPercent: 0, interestYesPercent: 0, byWorkshop: [] },
                    masterclass: { count: 0, avgContentQuality: 0, avgRelevance: 0 },
                    mentorPerformance: [],
                },
                error: null,
            }
        }

        // ── Classify and aggregate ──
        const diag = { experience: [] as number[], clarity: [] as number[], helpfulness: [] as number[], confidence: [] as number[] }
        const resume = { experience: [] as number[], confidence: [] as number[], clarity: [] as string[], preparedness: [] as string[] }
        const sectoral = {
            delivery: [] as number[], helpfulness: [] as number[], clarity: [] as string[], interest: [] as string[],
            byWorkshop: new Map<string, { delivery: number[]; helpfulness: number[] }>(),
        }
        const master = { contentQuality: [] as number[], relevance: [] as number[] }
        const allRatings: number[] = []
        const sessionIds = new Set<string>()
        const mentorMap = new Map<string, { name: string; ratings: number[]; feedbackCount: number; sessions: Set<string> }>()

        let diagCount = 0, resumeCount = 0, sectoralCount = 0, masterCount = 0

        for (const att of attendees as any[]) {
            const fd = att.feedback_data
            if (!fd || (typeof fd === 'object' && Object.keys(fd).length === 0)) continue

            const particulars = att.cdm_learning_journey_items?.particulars ?? ''
            const type = classifyType(particulars)
            const fb = normalizeFeedback(fd)

            // Track session
            if (att.session_id) sessionIds.add(att.session_id)

            // Track mentor
            const session = att.cdm_journey_sessions
            const mentor = session?.mentors_new
            if (mentor?.id) {
                const mentorName = [mentor.mentor_first_name, mentor.mentor_last_name].filter(Boolean).join(' ') || 'Unknown'
                if (!mentorMap.has(mentor.id)) {
                    mentorMap.set(mentor.id, { name: mentorName, ratings: [], feedbackCount: 0, sessions: new Set() })
                }
                const entry = mentorMap.get(mentor.id)!
                entry.feedbackCount++
                if (att.session_id) entry.sessions.add(att.session_id)
            }

            switch (type) {
                case 'diagnostic': {
                    diagCount++
                    if (typeof fb.overall_experience === 'number') { diag.experience.push(fb.overall_experience); allRatings.push(fb.overall_experience) }
                    if (typeof fb.question_clarity === 'number') diag.clarity.push(fb.question_clarity)
                    if (typeof fb.helpfulness_rating === 'number') { diag.helpfulness.push(fb.helpfulness_rating); if (mentor?.id) mentorMap.get(mentor.id)!.ratings.push(fb.helpfulness_rating) }
                    else if (typeof fb.overall_experience === 'number' && mentor?.id) mentorMap.get(mentor.id)!.ratings.push(fb.overall_experience)
                    if (typeof fb.confidence_level === 'number') diag.confidence.push(fb.confidence_level)
                    break
                }
                case 'resume': {
                    resumeCount++
                    if (typeof fb.overall_experience === 'number') { resume.experience.push(fb.overall_experience); allRatings.push(fb.overall_experience) }
                    if (typeof fb.confidence_level === 'number') resume.confidence.push(fb.confidence_level)
                    if (typeof fb.feedback_clarity === 'string') resume.clarity.push(fb.feedback_clarity)
                    if (typeof fb.interview_preparedness === 'string') resume.preparedness.push(fb.interview_preparedness)
                    if (typeof fb.overall_experience === 'number' && mentor?.id) mentorMap.get(mentor.id)!.ratings.push(fb.overall_experience)
                    break
                }
                case 'sectoral': {
                    sectoralCount++
                    const dr = fb.delivery_rating ?? fb.workshop_quality
                    const hr = fb.helpfulness_rating ?? fb.engagement_level
                    if (typeof dr === 'number') { sectoral.delivery.push(dr); allRatings.push(dr) }
                    if (typeof hr === 'number') { sectoral.helpfulness.push(hr); if (mentor?.id) mentorMap.get(mentor.id)!.ratings.push(hr) }
                    if (typeof fb.clarity_rating === 'string') sectoral.clarity.push(fb.clarity_rating)
                    else if (typeof fb.clarity_of_communication === 'number') sectoral.clarity.push(fb.clarity_of_communication >= 4 ? 'yes' : 'no')
                    if (typeof fb.interest_rating === 'string') sectoral.interest.push(fb.interest_rating)
                    else if (typeof fb.session_relevance === 'number') sectoral.interest.push(fb.session_relevance >= 4 ? 'yes' : 'no')

                    // Per-workshop breakdown
                    const wsName = particulars.replace(/^Sectoral & Role Workshop\s*-?\s*/i, '').trim() || particulars
                    if (!sectoral.byWorkshop.has(wsName)) {
                        sectoral.byWorkshop.set(wsName, { delivery: [], helpfulness: [] })
                    }
                    const ws = sectoral.byWorkshop.get(wsName)!
                    if (typeof dr === 'number') ws.delivery.push(dr)
                    if (typeof hr === 'number') ws.helpfulness.push(hr)
                    break
                }
                case 'masterclass': {
                    masterCount++
                    const cqr = fb.content_quality_rating ?? fb.workshop_quality
                    const rr = fb.relevance_rating ?? fb.session_relevance
                    if (typeof cqr === 'number') { master.contentQuality.push(cqr); allRatings.push(cqr) }
                    if (typeof rr === 'number') { master.relevance.push(rr); allRatings.push(rr) }
                    if (typeof cqr === 'number' && mentor?.id) mentorMap.get(mentor.id)!.ratings.push(cqr)
                    break
                }
            }
        }

        // Build mentor performance list
        const mentorPerformance: MentorPerformance[] = Array.from(mentorMap.entries())
            .map(([id, m]) => ({
                mentorId: id,
                mentorName: m.name,
                sessionCount: m.sessions.size,
                avgRating: m.ratings.length > 0 ? Math.round(avg(m.ratings) * 10) / 10 : 0,
                feedbackCount: m.feedbackCount,
            }))
            .sort((a, b) => b.avgRating - a.avgRating)

        const result: TccAnalyticsData = {
            totalFeedbacks: diagCount + resumeCount + sectoralCount + masterCount,
            totalSessions: sessionIds.size,
            totalMentors: mentorMap.size,
            overallAvgRating: allRatings.length > 0 ? Math.round(avg(allRatings) * 10) / 10 : 0,
            diagnosticInterview: {
                count: diagCount,
                avgExperience: Math.round(avg(diag.experience) * 10) / 10,
                avgClarity: Math.round(avg(diag.clarity) * 10) / 10,
                avgHelpfulness: Math.round(avg(diag.helpfulness) * 10) / 10,
                avgConfidence: Math.round(avg(diag.confidence) * 10) / 10,
            },
            resumeReview: {
                count: resumeCount,
                avgExperience: Math.round(avg(resume.experience) * 10) / 10,
                avgConfidence: Math.round(avg(resume.confidence) * 10) / 10,
                clarityYesPercent: yesPercent(resume.clarity),
                preparednessYesPercent: yesPercent(resume.preparedness),
            },
            sectoralWorkshop: {
                count: sectoralCount,
                avgDelivery: Math.round(avg(sectoral.delivery) * 10) / 10,
                avgHelpfulness: Math.round(avg(sectoral.helpfulness) * 10) / 10,
                clarityYesPercent: yesPercent(sectoral.clarity),
                interestYesPercent: yesPercent(sectoral.interest),
                byWorkshop: Array.from(sectoral.byWorkshop.entries()).map(([name, ws]) => ({
                    name,
                    count: ws.delivery.length + ws.helpfulness.length,
                    avgDelivery: Math.round(avg(ws.delivery) * 10) / 10,
                    avgHelpfulness: Math.round(avg(ws.helpfulness) * 10) / 10,
                })),
            },
            masterclass: {
                count: masterCount,
                avgContentQuality: Math.round(avg(master.contentQuality) * 10) / 10,
                avgRelevance: Math.round(avg(master.relevance) * 10) / 10,
            },
            mentorPerformance,
        }

        return { data: result, error: null }
    } catch (err: any) {
        console.error('Error in getTccAnalytics:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
