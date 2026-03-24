'use server'

import { createClient } from '@/utils/supabase/server'

// ── Types ──

export interface JourneyItemOption {
    id: string
    particulars: string
    feedbackCount: number
}

export interface StudentFeedbackRow {
    attendeeId: string
    studentName: string
    batchName: string
    sessionName: string
    attendanceStatus: string
    feedbackData: Record<string, any>
}

// ── getJourneyItemsForBatch ──

export async function getJourneyItemsForBatch(
    batchId?: string
): Promise<{ data: JourneyItemOption[] | null; error: string | null }> {
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
            return { data: [], error: null }
        }
        const instituteId = pocData.institute_id

        // Step 1: Get learning journey(s) — scoped to user's institute
        let journeyQuery = supabase
            .from('cdm_learning_journeys')
            .select('id')

        if (batchId) {
            // Verify the batch belongs to this institute
            const { data: batchData } = await supabase
                .from('cdm_batches')
                .select('id')
                .eq('id', batchId)
                .eq('institute_id', instituteId)
                .maybeSingle()

            if (!batchData) {
                return { data: [], error: null }
            }
            journeyQuery = journeyQuery.eq('batch_id', batchId).limit(1)
        } else {
            // "All Batches" — get batches for this institute only
            const { data: instituteBatches } = await supabase
                .from('cdm_batches')
                .select('id')
                .eq('institute_id', instituteId)

            if (!instituteBatches || instituteBatches.length === 0) {
                return { data: [], error: null }
            }
            const batchIds = instituteBatches.map(b => b.id)
            journeyQuery = journeyQuery.in('batch_id', batchIds)
        }

        const { data: journeys, error: journeyError } = await journeyQuery

        if (journeyError) throw new Error(journeyError.message)
        if (!journeys || journeys.length === 0) {
            return { data: [], error: null }
        }

        const journeyIds = journeys.map(j => j.id)

        // Step 2: Get all journey items for those journeys
        const { data: items, error: itemsError } = await supabase
            .from('cdm_learning_journey_items')
            .select('id, particulars')
            .in('learning_journey_id', journeyIds)
            .order('sequence_order', { ascending: true })

        if (itemsError) throw new Error(itemsError.message)
        if (!items || items.length === 0) {
            return { data: [], error: null }
        }

        // Step 3: For each item, count non-empty feedbacks
        const itemIds = items.map(i => i.id)

        const { data: attendees, error: attError } = await supabase
            .from('cdm_session_attendees')
            .select('journey_item_id')
            .in('journey_item_id', itemIds)
            .not('feedback_data', 'eq', '{}')

        if (attError) throw new Error(attError.message)

        // Count feedbacks per journey item
        const countMap = new Map<string, number>()
        for (const att of (attendees || [])) {
            const jiId = att.journey_item_id
            if (jiId) {
                countMap.set(jiId, (countMap.get(jiId) || 0) + 1)
            }
        }

        // Only return items that have at least one feedback
        const result: JourneyItemOption[] = items
            .filter(i => (countMap.get(i.id) || 0) > 0)
            .map(i => ({
                id: i.id,
                particulars: i.particulars || 'Untitled Session',
                feedbackCount: countMap.get(i.id) || 0,
            }))

        return { data: result, error: null }
    } catch (err: any) {
        console.error('Error in getJourneyItemsForBatch:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}

// ── getSessionFeedbacks ──

export async function getSessionFeedbacks(
    journeyItemId: string
): Promise<{ data: StudentFeedbackRow[] | null; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: attendees, error } = await supabase
            .from('cdm_session_attendees')
            .select(`
                id,
                student_name,
                session_name,
                attendance_status,
                feedback_data,
                cdm_students (
                    cdm_batches (
                        name
                    )
                )
            `)
            .eq('journey_item_id', journeyItemId)
            .not('feedback_data', 'eq', '{}')
            .order('student_name', { ascending: true })

        if (error) throw new Error(error.message)

        const rows: StudentFeedbackRow[] = (attendees || []).map((att: any) => {
            const dynamicBatchName = att.cdm_students?.cdm_batches?.name;
            return {
                attendeeId: att.id,
                studentName: att.student_name || 'Unknown Student',
                batchName: dynamicBatchName || att.batch_name || '—',
                sessionName: att.session_name || '—',
                attendanceStatus: att.attendance_status || 'Unknown',
                feedbackData: att.feedback_data || {},
            };
        })

        return { data: rows, error: null }
    } catch (err: any) {
        console.error('Error in getSessionFeedbacks:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
