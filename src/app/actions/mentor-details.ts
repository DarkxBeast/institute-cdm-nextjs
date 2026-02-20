'use server'

import { createClient } from '@/utils/supabase/server'

// --- Types ---

export interface MentorEducation {
    qualification: string;
    institution: string;
    gpaPercentage: string;
    graduationYear: string;
}

export interface MentorWorkExperience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    jobDescription: string; // HTML string
    skills: string[];
}

export interface MentorCertification {
    name: string;
    issuer: string;
    year: string;
}

export interface MentorLanguage {
    language: string;
    proficiency: string;
}

export interface MentorDetail {
    id: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string;
    email: string | null;
    phone: string | null;
    profileUrl: string | null;
    linkedinUrl: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    about: string | null;
    experienceYears: string | null;
    averageRating: string | null;
    domainExpertise: string[];
    functionalDomainExpertise: string[];
    technicalSkills: string[];
    softSkills: string[];
    education: MentorEducation[];
    workExperience: MentorWorkExperience[];
    certifications: MentorCertification[];
    languages: MentorLanguage[];
    servicesOffered: string[];
    preferMentoring: string[];
    areaInterest: string[];
}

// --- Helpers ---

/**
 * Parse a JSON object with numbered keys like {"education_1": {...}, "education_2": {...}}
 * into a sorted array, sorted by key suffix number.
 */
function parseNumberedJsonObject<T>(raw: unknown, mapFn: (val: any) => T | null): T[] {
    if (!raw) return [];
    let obj: Record<string, any>;
    if (typeof raw === 'string') {
        try { obj = JSON.parse(raw); } catch { return []; }
    } else if (typeof raw === 'object' && !Array.isArray(raw)) {
        obj = raw as Record<string, any>;
    } else {
        return [];
    }

    // Sort by numbered suffix (e.g. experience_1, experience_2)
    const entries = Object.entries(obj).sort(([a], [b]) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
    });

    return entries.map(([, val]) => mapFn(val)).filter((v): v is T => v != null);
}

/**
 * Parse text[] columns — they come as actual arrays from Supabase,
 * but the array items may themselves be JSON-stringified arrays like '["item1","item2"]'
 */
function parseStringArray(raw: unknown): string[] {
    if (!raw) return [];
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
        } catch { /* ignore */ }
        return raw ? [raw] : [];
    }
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    return [];
}

// --- Service ---

export async function getMentorDetails(mentorId: string): Promise<{ data: MentorDetail | null; error: string | null }> {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        const { data: mentor, error } = await supabase
            .from('mentors_new')
            .select(`
                id,
                mentor_first_name,
                mentor_last_name,
                mentor_email,
                mentor_phone,
                mentor_profile_url,
                mentor_linkedin_url,
                mentor_city,
                mentor_state,
                mentor_country,
                mentor_about,
                experience_years,
                mentor_average_rating,
                mentor_domain_expertise,
                mentor_functional_domain_expertise,
                mentor_technical_skills,
                mentor_soft_skills,
                mentor_education,
                mentor_work_experience,
                mentor_certification,
                mentor_languages,
                mentor_who_do_you,
                mentor_prefer_mentoring,
                mentor_area_interest
            `)
            .eq('id', mentorId)
            .maybeSingle()

        if (error) {
            console.error('Error fetching mentor details:', error)
            return { data: null, error: error.message }
        }

        if (!mentor) {
            return { data: null, error: 'Mentor not found' }
        }

        const m = mentor as any;

        const firstName = m.mentor_first_name ?? null;
        const lastName = m.mentor_last_name ?? null;
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown Mentor';

        const result: MentorDetail = {
            id: m.id,
            firstName,
            lastName,
            fullName,
            email: m.mentor_email ?? null,
            phone: m.mentor_phone ?? null,
            profileUrl: m.mentor_profile_url ?? null,
            linkedinUrl: m.mentor_linkedin_url ?? null,
            city: m.mentor_city ?? null,
            state: m.mentor_state ?? null,
            country: m.mentor_country ?? null,
            about: m.mentor_about ?? null,
            experienceYears: m.experience_years ?? null,
            averageRating: m.mentor_average_rating ?? null,
            domainExpertise: parseStringArray(m.mentor_domain_expertise),
            functionalDomainExpertise: parseStringArray(m.mentor_functional_domain_expertise),
            technicalSkills: parseStringArray(m.mentor_technical_skills),
            softSkills: parseStringArray(m.mentor_soft_skills),
            education: parseNumberedJsonObject(m.mentor_education, (val) => ({
                qualification: val.qualification ?? '',
                institution: val.Institution ?? val.institution ?? '',
                gpaPercentage: val.gpa_percentage ?? '',
                graduationYear: val.graduation_year ?? '',
            })),
            workExperience: parseNumberedJsonObject(m.mentor_work_experience, (val) => ({
                jobTitle: val.job_title ?? '',
                company: val.company ?? '',
                startDate: val.start_date ?? '',
                endDate: val.end_date ?? '',
                currentlyWorking: val.currently_working ?? false,
                jobDescription: val.job_description ?? '',
                skills: Array.isArray(val.skills) ? val.skills.filter(Boolean) : [],
            })),
            certifications: parseNumberedJsonObject(m.mentor_certification, (val) => {
                if (!val || (!val.name && !val.certification_name)) return null;
                return {
                    name: val.name ?? val.certification_name ?? '',
                    issuer: val.issuer ?? val.issuing_organization ?? '',
                    year: val.year ?? val.issue_date ?? '',
                };
            }),
            languages: parseNumberedJsonObject(m.mentor_languages, (val) => ({
                language: val.language ?? '',
                proficiency: val.proficiency ?? '',
            })),
            servicesOffered: parseStringArray(m.mentor_who_do_you),
            preferMentoring: parseStringArray(m.mentor_prefer_mentoring),
            areaInterest: parseStringArray(m.mentor_area_interest),
        }

        return { data: result, error: null }
    } catch (err: any) {
        console.error('Error in getMentorDetails:', err?.message ?? err)
        return { data: null, error: err?.message ?? 'Unknown error' }
    }
}
