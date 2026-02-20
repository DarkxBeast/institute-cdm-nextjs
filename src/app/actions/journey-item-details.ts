'use server'

import { createClient } from '@/utils/supabase/server'

// ── Types ──

export interface JourneyItemMentor {
    id: string
    fullName: string
    expertise: string[]
    experienceYears: string | null
}

export interface PendingStudent {
    studentId: string
    studentName: string
    enrollmentId: string | null
    status: string // 'Scheduled - Nov 27', 'Not Scheduled', etc.
}

export interface JourneyItemDetails {
    id: string
    particulars: string
    startDate: string
    endDate: string
    deliveryMode: string
    format: string
    totalHours: number
    status: string
    moduleDescription: string | null
    mentors: JourneyItemMentor[]
    totalStudents: number
    completedStudents: number
    pendingStudents: number
    pendingStudentsList: PendingStudent[]
}

// ── Main Action ──

export async function getJourneyItemDetails(
    itemId: string
): Promise<{ data: JourneyItemDetails | null; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // 1. Fetch the journey item with product → module description
        const { data: item, error: itemError } = await supabase
            .from('cdm_learning_journey_items')
            .select(`
                id,
                particulars,
                start_date,
                end_date,
                delivery_mode,
                format,
                total_hours,
                status,
                student_count,
                cdm_products (
                    module_id,
                    cdm_modules (
                        description
                    )
                )
            `)
            .eq('id', itemId)
            .maybeSingle()

        if (itemError) {
            console.error('Error fetching journey item:', itemError)
            return { data: null, error: itemError.message }
        }

        if (!item) {
            return { data: null, error: 'Item not found' }
        }

        const rawItem = item as any
        const moduleDescription = rawItem.cdm_products?.cdm_modules?.description ?? null

        // 2. Fetch sessions with mentors
        const { data: sessions, error: sessError } = await supabase
            .from('cdm_journey_sessions')
            .select(`
                id,
                status,
                scheduled_date,
                mentor_id,
                mentors_new (
                    id,
                    mentor_first_name,
                    mentor_last_name,
                    mentor_domain_expertise,
                    experience_years
                )
            `)
            .eq('journey_item_id', itemId)

        if (sessError) {
            console.error('Error fetching sessions:', sessError)
            return { data: null, error: sessError.message }
        }

        // 3. Deduplicate mentors
        const mentorMap = new Map<string, JourneyItemMentor>()
        for (const sess of (sessions ?? []) as any[]) {
            const m = sess.mentors_new
            if (m?.id && !mentorMap.has(m.id)) {
                mentorMap.set(m.id, {
                    id: m.id,
                    fullName: [m.mentor_first_name, m.mentor_last_name].filter(Boolean).join(' ') || 'Unknown',
                    expertise: m.mentor_domain_expertise ?? [],
                    experienceYears: m.experience_years ?? null,
                })
            }
        }

        // 4. Fetch attendees with student details for completion status
        const sessionIds = (sessions ?? []).map((s: any) => s.id)
        let completedCount = 0
        let pendingStudentsList: PendingStudent[] = []
        let totalStudentCount = rawItem.student_count ?? 0

        if (sessionIds.length > 0) {
            const { data: attendees, error: attError } = await supabase
                .from('cdm_session_attendees')
                .select(`
                    id,
                    student_id,
                    student_name,
                    attendance_status,
                    cdm_journey_sessions!cdm_attendees_session_fkey (
                        status,
                        scheduled_date
                    ),
                    cdm_students!cdm_attendees_student_fkey (
                        enrollment_id,
                        full_name
                    )
                `)
                .in('session_id', sessionIds)

            if (!attError && attendees) {
                // Aggregate by student — a student is "completed" if any of their attendances is "Present"
                const studentMap = new Map<string, {
                    name: string
                    enrollmentId: string | null
                    isCompleted: boolean
                    sessionStatus: string
                    scheduledDate: string | null
                }>()

                for (const att of attendees as any[]) {
                    const sid = att.student_id
                    const attStatus = (att.attendance_status ?? '').trim()
                    const isPresent = attStatus.toLowerCase().startsWith('present')
                    const sessInfo = att.cdm_journey_sessions
                    const studentInfo = att.cdm_students
                    const sessionStatus = sessInfo?.status ?? ''
                    const scheduledDate = sessInfo?.scheduled_date ?? null

                    if (!studentMap.has(sid)) {
                        studentMap.set(sid, {
                            name: studentInfo?.full_name ?? att.student_name ?? 'Unknown',
                            enrollmentId: studentInfo?.enrollment_id ?? null,
                            isCompleted: isPresent,
                            sessionStatus,
                            scheduledDate,
                        })
                    } else {
                        const existing = studentMap.get(sid)!
                        if (isPresent) existing.isCompleted = true
                        // Keep the latest scheduled session info for pending display
                        if (!existing.isCompleted && scheduledDate) {
                            existing.sessionStatus = sessionStatus
                            existing.scheduledDate = scheduledDate
                        }
                    }
                }

                completedCount = Array.from(studentMap.values()).filter(s => s.isCompleted).length

                // Build pending students list
                pendingStudentsList = Array.from(studentMap.entries())
                    .filter(([, s]) => !s.isCompleted)
                    .map(([studentId, s]) => {
                        let status = 'Not Scheduled'
                        if (s.sessionStatus === 'Scheduled' && s.scheduledDate) {
                            const d = new Date(s.scheduledDate)
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            status = `Scheduled - ${monthNames[d.getMonth()]} ${d.getDate()}`
                        } else if (s.sessionStatus === 'Completed') {
                            // Session completed but student was absent
                            status = 'Absent'
                        }
                        return {
                            studentId,
                            studentName: s.name,
                            enrollmentId: s.enrollmentId,
                            status,
                        }
                    })
                    .sort((a, b) => a.studentName.localeCompare(b.studentName))

                // Use actual attendee count as source of truth (student_count in DB may be stale)
                totalStudentCount = studentMap.size
            }
        }

        const pendingCount = totalStudentCount - completedCount

        const result: JourneyItemDetails = {
            id: rawItem.id,
            particulars: rawItem.particulars ?? '',
            startDate: rawItem.start_date ?? '',
            endDate: rawItem.end_date ?? '',
            deliveryMode: rawItem.delivery_mode ?? 'Online',
            format: rawItem.format ?? 'Session',
            totalHours: rawItem.total_hours ?? 0,
            status: rawItem.status ?? 'Yet to Schedule',
            moduleDescription,
            mentors: Array.from(mentorMap.values()),
            totalStudents: totalStudentCount,
            completedStudents: completedCount,
            pendingStudents: pendingCount > 0 ? pendingCount : 0,
            pendingStudentsList,
        }

        return { data: result, error: null }
    } catch (err: any) {
        console.error('Error in getJourneyItemDetails:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
