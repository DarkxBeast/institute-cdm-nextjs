'use server'

import { createClient } from '@/utils/supabase/server'

// --- Types ---

export interface StudentReportSummary {
    reportType: string;
    journeyItemId: string;
    sequenceOrder: number;
    journeyItemName: string;
    count: number;
    instanceNumber: number;
}

export interface StudentReport {
    id: string;
    reportType: string;
    reportData: Record<string, any>;
    createdAt: string;
    journeyItemId: string | null;
    session: {
        id: string;
        scheduledDate: string | null;
        status: string;
        mentorName: string;
        journeyItemTitle: string;
    } | null;
}

// --- Service ---

/**
 * Get distinct report types for a student, grouped by journey item.
 * Returns per-journey-item summaries with numbered instances.
 *
 * Query path:
 *   cdm_student_reports
 *     → attendee (cdm_session_attendees) — filter by student_id
 *     → journey_item (cdm_learning_journey_items) — get sequence_order, particulars
 */
export async function getStudentReportTypes(
    studentId: string
): Promise<{ data: StudentReportSummary[]; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: reports, error } = await supabase
            .from('cdm_student_reports')
            .select(`
                report_type,
                journey_item_id,
                attendee:cdm_session_attendees!cdm_reports_attendee_fkey!inner (
                    student_id
                ),
                journey_item:cdm_learning_journey_items!cdm_reports_lji_fkey (
                    id,
                    particulars,
                    sequence_order
                )
            `)
            .eq('attendee.student_id', studentId)

        if (error) {
            console.warn('Error fetching student report types:', error)
            return { data: [], error: error.message }
        }

        if (!reports || reports.length === 0) {
            return { data: [], error: null }
        }

        // Group by (report_type, journey_item_id) and count
        const groupMap = new Map<string, {
            reportType: string;
            journeyItemId: string;
            sequenceOrder: number;
            journeyItemName: string;
            count: number;
        }>()

        for (const r of reports as any[]) {
            const ji = r.journey_item
            const journeyItemId = r.journey_item_id ?? ji?.id ?? 'unknown'
            const key = `${r.report_type}::${journeyItemId}`

            if (!groupMap.has(key)) {
                groupMap.set(key, {
                    reportType: r.report_type,
                    journeyItemId,
                    sequenceOrder: ji?.sequence_order ?? 0,
                    journeyItemName: ji?.particulars ?? r.report_type,
                    count: 0,
                })
            }
            groupMap.get(key)!.count += 1
        }

        // Sort by sequence_order and assign instanceNumber within each report_type
        const groups = Array.from(groupMap.values())
        groups.sort((a, b) => a.sequenceOrder - b.sequenceOrder)

        // Count how many journey items exist per report_type
        const typeCountMap = new Map<string, number>()
        for (const g of groups) {
            typeCountMap.set(g.reportType, (typeCountMap.get(g.reportType) || 0) + 1)
        }

        // Assign instance numbers per report_type
        const typeInstanceCounter = new Map<string, number>()
        const summaries: StudentReportSummary[] = groups.map((g) => {
            const current = (typeInstanceCounter.get(g.reportType) || 0) + 1
            typeInstanceCounter.set(g.reportType, current)
            return {
                ...g,
                instanceNumber: current,
            }
        })

        return { data: summaries, error: null }
    } catch (err: any) {
        console.error('Error in getStudentReportTypes:', err?.message ?? err)
        return { data: [], error: err?.message ?? 'Unknown error' }
    }
}

/**
 * Get reports of a specific type for a student, filtered to a specific journey item.
 *
 * Query path:
 *   cdm_student_reports
 *     → attendee (cdm_session_attendees) — filter by student_id
 *     → session (cdm_journey_sessions) — get scheduled_date, status, mentor, journey item
 */
export async function getStudentReportsByType(
    studentId: string,
    reportType: string,
    journeyItemId?: string
): Promise<{ data: StudentReport[]; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        let query = supabase
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
                    id,
                    scheduled_date,
                    status,
                    mentors ( first_name, last_name ),
                    cdm_learning_journey_items ( particulars, sequence_order )
                )
            `)
            .eq('attendee.student_id', studentId)
            .eq('report_type', reportType)
            .order('created_at', { ascending: false })

        if (journeyItemId) {
            query = query.eq('journey_item_id', journeyItemId)
        }

        const { data: reports, error } = await query

        if (error) {
            console.warn('Error fetching student reports by type:', error)
            return { data: [], error: error.message }
        }

        if (!reports || reports.length === 0) {
            return { data: [], error: null }
        }

        const mapped: StudentReport[] = reports.map((r: any) => {
            const session = r.session
            const mentor = session?.mentors
            const journeyItem = session?.cdm_learning_journey_items

            return {
                id: r.id,
                reportType: r.report_type,
                reportData: r.report_data ?? {},
                createdAt: r.created_at ?? '',
                journeyItemId: r.journey_item_id ?? null,
                session: session
                    ? {
                        id: session.id,
                        scheduledDate: session.scheduled_date ?? null,
                        status: session.status ?? 'Unknown',
                        mentorName: [mentor?.first_name, mentor?.last_name]
                            .filter(Boolean)
                            .join(' ') || 'Unknown Mentor',
                        journeyItemTitle: journeyItem?.particulars ?? 'Unknown Session',
                    }
                    : null,
            }
        })

        return { data: mapped, error: null }
    } catch (err: any) {
        console.error('Error in getStudentReportsByType:', err?.message ?? err)
        return { data: [], error: err?.message ?? 'Unknown error' }
    }
}
