'use server'

import { createClient } from '@/utils/supabase/server'

// --- Types ---

export interface MentorInfo {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    specialization: string[];
    status: string;
    linkedinUrl?: string;

}

export interface LearningJourneyHeader {
    instituteName: string;
    batchName: string;
    status: string;
}

export interface LearningJourneySummary {
    totalModules: number;
    durationWeeks: number;
    startDate: string;
    endDate: string;
}

export interface LearningJourneyProgress {
    percentage: number;
    completed: number;
    inProgress: number;
    upcoming: number;
    yetToSchedule: number;
}

export interface LearningJourneyUpNext {
    title: string;
    date: string;
    duration: string;
}

export interface LearningJourneyItem {
    id: string;
    particulars: string;
    startDate: string;
    endDate: string;
    status: string;
    deliveryMode: string;
    format: string;
    totalHours: number;
    averageRating: number | null;
    sequenceOrder: number;
    category: string;
    mentors: MentorInfo[];
}

export interface LearningJourneyCategory {
    name: string;
    total: number;
    completed: number;
    items: {
        id: string;
        particulars: string;
        startDate: string;
        endDate: string;
        status: string;
        totalHours: number;
        averageRating: number | null;
        sequenceOrder: number;
        category: string;
        mentors: MentorInfo[];
    }[];
}

export interface LearningJourneyViewData {
    header: LearningJourneyHeader;
    summary: LearningJourneySummary;
    progress: LearningJourneyProgress;
    upNext: LearningJourneyUpNext | null;
    categories: LearningJourneyCategory[];
    mentors: MentorInfo[];
    sequenceList: {
        id: string;
        particulars: string;
        startDate: string;
        endDate: string;
        status: string;
        deliveryMode: string;
        format: string;
        totalHours: number;
        averageRating: number | null;
        sequenceOrder: number;
        category: string;
        mentors: MentorInfo[];
    }[];
}

// --- Service ---

export async function getLearningJourneyForBatch(batchId: string): Promise<{ data: LearningJourneyViewData | null; error: string | null }> {
    const supabase = await createClient()

    try {
        // 1. Check if user has access to this batch
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // 2. Fetch the raw data with nested relationships
        const { data: journey, error } = await supabase
            .from('cdm_learning_journeys')
            .select(`
                id,
                status,
                cdm_batches ( name ),
                cdm_institutes ( name ),
                cdm_learning_journey_items (
                    id,
                    particulars,
                    start_date,
                    end_date,
                    status,
                    delivery_mode,
                    format,
                    total_hours,
                    average_rating,
                    sequence_order,
                    cdm_products (
                        cdm_modules (
                            category
                        )
                    ),
                    cdm_journey_sessions (
                        mentors_new (
                            id, mentor_first_name, mentor_last_name
                        )
                    )
                )
            `)
            .eq('batch_id', batchId)
            .maybeSingle()

        if (error) {
            // Handle schema relationship error gracefully (e.g. missing foreign keys in local dev)
            if (error.code === 'PGRST200') {
                console.warn('Supabase schema error (PGRST200), returning empty journey:', error.message)
                return { data: null, error: null }
            }
            console.warn('Supabase error fetching learning journey:', error)
            return { data: null, error: error.message }
        }

        if (!journey) {
            return { data: null, error: null }
        }

        const rawJourney = journey as any as {
            cdm_batches: { name: string } | null
            cdm_institutes: { name: string } | null
            status: string
            cdm_learning_journey_items: LearningJourneyItem[]
        }

        // 3. Transform into view data
        // 3. Transform into view data
        const rawItems = rawJourney.cdm_learning_journey_items || []

        // Map raw items to our internal interface and calculate derived fields
        const items = rawItems.map((item: any) => ({
            id: item.id,
            particulars: item.particulars ?? '',
            startDate: item.start_date ?? '',
            endDate: item.end_date ?? '',
            status: item.status ?? 'Yet to Schedule',
            deliveryMode: item.delivery_mode ?? 'Online',
            format: item.format ?? 'Session',
            totalHours: item.total_hours ?? 0,
            averageRating: item.average_rating ?? null,
            sequenceOrder: item.sequence_order ?? 0,
            category: item.cdm_products?.cdm_modules?.category ?? 'General',
            mentors: (() => {
                // HARDCODED MENTOR for "Sectoral & Role Workshop - Roles in Global Capability Centers (GCCs)"
                if (item.particulars === 'Sectoral & Role Workshop - Roles in Global Capability Centers (GCCs)') {
                    return [{
                        id: 'pratik-ranjan-hardcoded',
                        fullName: 'Pratik Ranjan',
                        email: null,
                        phone: null,
                        specialization: ['Sectoral & Role Workshop'],
                        status: 'active',
                        linkedinUrl: 'https://www.linkedin.com/in/pratik-ranjan?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
                    }];
                } else if (item.particulars === 'Sectoral & Role Workshop - E-Commerce & Quick Commerce') {
                    return [{
                        id: 'kaustav-das-hardcoded',
                        fullName: 'Kaustav Das',
                        email: null,
                        phone: null,
                        specialization: ['Sectoral & Role Workshop'],
                        status: 'active',
                        linkedinUrl: 'https://www.linkedin.com/in/kaustavdas91?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
                    }];
                } else if (item.particulars === 'Sectoral & Role Workshop - BFSI (Banking, Financial Services & Insurance)') {
                    return [{
                        id: 'anish-gupta-hardcoded',
                        fullName: 'Anish Gupta',
                        email: null,
                        phone: null,
                        specialization: ['Sectoral & Role Workshop'],
                        status: 'active',
                        linkedinUrl: 'https://www.linkedin.com/in/anishcgupta?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
                    }];
                }

                const mentorMap = new Map<string, MentorInfo>();
                for (const s of (item.cdm_journey_sessions ?? [])) {
                    const m = s.mentors_new;
                    if (m && m.id && !mentorMap.has(m.id)) {
                        mentorMap.set(m.id, {
                            id: m.id,
                            fullName: [m.mentor_first_name, m.mentor_last_name].filter(Boolean).join(' ') || 'Unknown',
                            email: null,
                            phone: null,
                            specialization: [],
                            status: 'active',
                        });
                    }
                }
                return Array.from(mentorMap.values());
            })(),
        }))
            .sort((a, b) => a.sequenceOrder - b.sequenceOrder)

        // 4. Calculate summary stats
        const totalModules = items.length
        const completedModules = items.filter((i) => i.status === 'Completed').length
        const inProgressModules = items.filter((i) => i.status === 'Ongoing').length
        const upcomingModules = items.filter((i) => i.status === 'Upcoming').length
        const yetToScheduleModules = items.filter((i) => i.status === 'Yet to Schedule').length
        const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

        // 5. Calculate program dates & duration from valid dates
        const validStartDates = items
            .map((i) => new Date(i.startDate).getTime())
            .filter((d) => !isNaN(d))
        const validEndDates = items
            .map((i) => new Date(i.endDate).getTime())
            .filter((d) => !isNaN(d))

        const programStartDate = validStartDates.length > 0 ? new Date(Math.min(...validStartDates)) : null
        const programEndDate = validEndDates.length > 0 ? new Date(Math.max(...validEndDates)) : null

        let durationWeeks = 0
        if (programStartDate && programEndDate) {
            const diffTime = Math.abs(programEndDate.getTime() - programStartDate.getTime())
            durationWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
        }

        // 6. Find "Up Next" (first item with 'Upcoming' status only)
        const upNextItem = items.find((i) => i.status === 'Upcoming') || null

        // 7. Group items by category for accordion
        const categoryMap: Record<string, LearningJourneyCategory> = {}
        for (const item of items) {
            const cat = item.category
            if (!categoryMap[cat]) {
                const catTotal = items.filter(i => i.category === cat).length
                categoryMap[cat] = {
                    name: cat,
                    total: catTotal,
                    completed: 0,
                    items: []
                }
            }
            categoryMap[cat].items.push(item)
            if (item.status === 'Completed') categoryMap[cat].completed += 1
        }

        // 8. Build the response
        const batchesData = (journey as any).cdm_batches
        const institutesData = (journey as any).cdm_institutes

        const result: LearningJourneyViewData = {
            header: {
                instituteName: institutesData?.name ?? 'Unknown Institute',
                batchName: batchesData?.name ?? 'Unknown Batch',
                status: (journey as any).status ?? 'unknown',
            },
            summary: {
                totalModules,
                durationWeeks,
                startDate: programStartDate
                    ? programStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'TBD',
                endDate: programEndDate
                    ? programEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'TBD',
            },
            progress: {
                percentage: progressPercentage,
                completed: completedModules,
                inProgress: inProgressModules,
                upcoming: upcomingModules,
                yetToSchedule: yetToScheduleModules,
            },
            upNext: upNextItem
                ? {
                    title: upNextItem.particulars,
                    date: new Date(upNextItem.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    duration: `${upNextItem.totalHours}h`,
                }
                : null,
            categories: Object.values(categoryMap),
            mentors: (() => {
                const mentorMap = new Map<string, MentorInfo>();
                for (const item of items) {
                    for (const m of item.mentors) {
                        if (!mentorMap.has(m.id)) mentorMap.set(m.id, m);
                    }
                }
                return Array.from(mentorMap.values());
            })(),
            sequenceList: items,
        }

        return { data: result, error: null }
    } catch (err: any) {
        console.error('Error in getLearningJourneyForBatch:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
