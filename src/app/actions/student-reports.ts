'use server'

import { createClient } from '@/utils/supabase/server'

// --- Types ---

export interface StudentReportSummary {
    reportType: string;
    count: number;
}

export interface StudentReport {
    id: string;
    reportType: string;
    reportData: Record<string, any>;
    createdAt: string;
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
 * Get distinct report types for a student (with counts).
 * Only 1:1 sessions produce reports, so any report_type found here
 * corresponds to a 1:1 session type.
 */
export async function getStudentReportTypes(
    studentId: string
): Promise<{ data: StudentReportSummary[]; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Fetch all reports for this student's sessions and group by report_type
        const { data: reports, error } = await supabase
            .from('cdm_student_reports')
            .select(`
                report_type,
                cdm_journey_sessions!inner ( student_id )
            `)
            .eq('cdm_journey_sessions.student_id', studentId)

        if (error) {
            console.warn('Error fetching student report types:', error)
            return { data: [], error: error.message }
        }

        if (!reports || reports.length === 0) {
            return { data: [], error: null }
        }

        // Count occurrences of each report_type
        const typeCountMap: Record<string, number> = {}
        for (const r of reports) {
            const rt = r.report_type
            typeCountMap[rt] = (typeCountMap[rt] || 0) + 1
        }

        const summaries: StudentReportSummary[] = Object.entries(typeCountMap).map(
            ([reportType, count]) => ({ reportType, count })
        )

        return { data: summaries, error: null }
    } catch (err: any) {
        console.error('Error in getStudentReportTypes:', err?.message ?? err)
        return { data: [], error: err?.message ?? 'Unknown error' }
    }
}

/**
 * Get all reports of a specific type for a student, with session details.
 */
export async function getStudentReportsByType(
    studentId: string,
    reportType: string
): Promise<{ data: StudentReport[]; error: string | null }> {
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
                cdm_journey_sessions!inner (
                    id,
                    scheduled_date,
                    status,
                    student_id,
                    mentors ( first_name, last_name ),
                    cdm_learning_journey_items ( particulars )
                )
            `)
            .eq('cdm_journey_sessions.student_id', studentId)
            .eq('report_type', reportType)
            .order('created_at', { ascending: false })

        if (error) {
            console.warn('Error fetching student reports by type:', error)
            return { data: [], error: error.message }
        }

        if (!reports || reports.length === 0) {
            return { data: [], error: null }
        }

        const mapped: StudentReport[] = reports.map((r: any) => {
            const session = r.cdm_journey_sessions
            const mentor = session?.mentors
            const journeyItem = session?.cdm_learning_journey_items

            return {
                id: r.id,
                reportType: r.report_type,
                reportData: r.report_data ?? {},
                createdAt: r.created_at ?? '',
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
