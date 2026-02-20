"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    User,
    Briefcase,
    GraduationCap,
    MapPin,
    Globe,
    Star,
    Award,

    BookOpen,
    Calendar,
    Linkedin,
    Loader2,
    X,
    Languages,
} from "lucide-react";
import { getMentorDetails, type MentorDetail } from "@/app/actions/mentor-details";

interface MentorDetailModalProps {
    mentorId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Strip HTML tags and decode HTML entities for plain text rendering
function stripHtml(html: string): string {
    if (!html) return "";
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

// Format date string (YYYY-MM-DD) to more readable format
function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
        return dateStr;
    }
}

// Capitalize first letter
function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function MentorDetailModal({ mentorId, open, onOpenChange }: MentorDetailModalProps) {
    const [mentor, setMentor] = useState<MentorDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMentor = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        const { data, error: err } = await getMentorDetails(id);
        if (err) setError(err);
        setMentor(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (open && mentorId) {
            fetchMentor(mentorId);
        } else if (!open) {
            setMentor(null);
            setError(null);
        }
    }, [open, mentorId, fetchMentor]);

    // Current job (experience_1 with currently_working=true, or first entry)
    const currentJob = mentor?.workExperience?.find((j) => j.currentlyWorking) ?? mentor?.workExperience?.[0] ?? null;
    const highestEducation = mentor?.education?.[0] ?? null;

    // Location string
    const locationParts = [mentor?.city, mentor?.state].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(", ") : null;

    // Languages as a comma-separated string for header
    const validLanguages = mentor?.languages?.filter((l) => l.language) ?? [];
    const languageStr = validLanguages.map((l) => l.language).join(", ") || null;

    // Initials for avatar
    const initials = mentor
        ? [mentor.firstName, mentor.lastName]
            .filter(Boolean)
            .map((n) => n!.charAt(0).toUpperCase())
            .join("")
        : "?";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-6xl max-h-[90vh] p-0 gap-0 rounded-xl border-0 flex flex-col overflow-hidden"
            >
                {/* Fixed Header bar */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-zinc-200 rounded-t-xl z-20">
                    <DialogTitle className="text-lg font-semibold text-zinc-900">Mentor Profile</DialogTitle>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-full p-1.5 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4 text-gray-600" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="h-8 w-8 animate-spin text-[#ff9e44]" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-2">
                            <p className="text-sm text-gray-500">{error}</p>
                        </div>
                    ) : mentor ? (
                        <div className="bg-[#fafafa]">

                            {/* ====== HERO / HEADER SECTION ====== */}
                            <div className="relative">
                                {/* Gradient banner */}
                                <div className="h-[80px] sm:h-[100px] bg-gradient-to-r from-[#ffe4cb] to-[#ff9e44]" />

                                {/* Profile card overlapping gradient */}
                                <div className="mx-auto px-4 sm:px-6 -mt-[40px] sm:-mt-[50px] relative z-10">
                                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            {/* Avatar */}
                                            <div className="shrink-0 flex justify-center sm:justify-start">
                                                <div className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[#ff9e44] to-[#ff7b00] flex items-center justify-center overflow-hidden">
                                                    {mentor.profileUrl ? (
                                                        <img
                                                            src={mentor.profileUrl}
                                                            alt={mentor.fullName}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-bold text-xl sm:text-2xl">
                                                            {initials}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                    <div className="flex flex-col gap-1 text-center sm:text-left">
                                                        {/* Name + LinkedIn */}
                                                        <div className="flex items-center justify-center sm:justify-start gap-3">
                                                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                                                {mentor.fullName}
                                                            </h1>
                                                            {mentor.linkedinUrl && (
                                                                <a
                                                                    href={mentor.linkedinUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#0077b5] hover:opacity-80 transition-opacity"
                                                                >
                                                                    <Linkedin className="h-5 w-5" />
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Current title */}
                                                        {currentJob ? (
                                                            <p className="text-gray-600 text-sm">
                                                                {currentJob.jobTitle}
                                                                {currentJob.company ? ` at ${currentJob.company}` : ""}
                                                            </p>
                                                        ) : (
                                                            <p className="text-gray-400 text-sm italic">No current position</p>
                                                        )}

                                                        {/* Experience badge */}
                                                        {mentor.experienceYears && (
                                                            <div className="mt-1">
                                                                <span className="inline-flex items-center bg-[#e6f9ee] text-[#16a34a] text-xs font-semibold px-3 py-1 rounded-full">
                                                                    {mentor.experienceYears}+ years experience
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Meta row: location, languages, rating */}
                                                        <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-2 flex-wrap">
                                                            {locationStr && (
                                                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                                    <MapPin className="h-3.5 w-3.5" />
                                                                    <span>{locationStr}</span>
                                                                </div>
                                                            )}
                                                            {languageStr && (
                                                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                                    <Globe className="h-3.5 w-3.5" />
                                                                    <span>{languageStr}</span>
                                                                </div>
                                                            )}
                                                            {mentor.averageRating && (
                                                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                                    <span>{mentor.averageRating}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right side mini-cards — hidden on mobile */}
                                                    <div className="hidden lg:flex flex-col gap-3 shrink-0">
                                                        {currentJob && (
                                                            <div className="flex items-center gap-3 border border-blue-100 bg-white rounded-xl px-4 py-3 shadow-sm min-w-[200px]">
                                                                <div className="bg-orange-100 rounded-lg p-2">
                                                                    <Briefcase className="h-4 w-4 text-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                                                                        {currentJob.company}
                                                                    </p>
                                                                    <p className="text-xs font-medium text-blue-600">
                                                                        Current Company
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {highestEducation && (
                                                            <div className="flex items-center gap-3 border border-orange-100 bg-white rounded-xl px-4 py-3 shadow-sm min-w-[200px]">
                                                                <div className="bg-orange-100 rounded-lg p-2">
                                                                    <GraduationCap className="h-4 w-4 text-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                                                                        {highestEducation.institution || "—"}
                                                                    </p>
                                                                    <p className="text-xs font-medium text-orange-600">
                                                                        {capitalize(highestEducation.qualification) || "Degree"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ====== BODY ====== */}
                            <div className="mx-auto px-4 sm:px-6 pb-8 mt-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* ---- LEFT COLUMN ---- */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                                        {/* About */}
                                        <SectionCard icon={User} title="About">
                                            {mentor.about ? (
                                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {stripHtml(mentor.about)}
                                                </p>
                                            ) : (
                                                <EmptyText>No about information available.</EmptyText>
                                            )}
                                        </SectionCard>

                                        {/* Experience */}
                                        <SectionCard icon={Briefcase} title="Experience">
                                            {mentor.workExperience.length > 0 ? (
                                                <div className="flex flex-col gap-6">
                                                    {mentor.workExperience.map((job, idx) => (
                                                        <div key={idx}>
                                                            {idx > 0 && <div className="h-px bg-zinc-100 mb-6" />}
                                                            <div className="flex gap-4">
                                                                <div className="shrink-0">
                                                                    <div className="bg-orange-100 rounded-lg p-2.5 mt-0.5">
                                                                        <Briefcase className="h-4 w-4 text-orange-600" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-base font-semibold text-zinc-900">
                                                                        {job.jobTitle || "Untitled Role"}
                                                                    </h4>
                                                                    <p className="text-sm font-medium text-[#ff9e44]">
                                                                        {job.company || "Unknown Company"}
                                                                    </p>
                                                                    {(job.startDate || job.endDate || job.currentlyWorking) && (
                                                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                                            <Calendar className="h-3.5 w-3.5" />
                                                                            <span>
                                                                                {formatDate(job.startDate)}
                                                                                {" - "}
                                                                                {job.currentlyWorking ? "Present" : formatDate(job.endDate)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {job.jobDescription && (
                                                                        <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                                            {stripHtml(job.jobDescription)
                                                                                .split("\n")
                                                                                .filter(Boolean)
                                                                                .map((line, i) => (
                                                                                    <span key={i}>
                                                                                        {line.startsWith("•") || line.startsWith("-") || line.startsWith("\\t•")
                                                                                            ? line
                                                                                            : `• ${line}`}
                                                                                        {"\n"}
                                                                                    </span>
                                                                                ))}
                                                                        </p>
                                                                    )}
                                                                    {job.skills && job.skills.length > 0 && (
                                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                                            {job.skills.map((s, i) => (
                                                                                <SkillBadge key={i} variant="outline">{s}</SkillBadge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyText>No work experience listed.</EmptyText>
                                            )}
                                        </SectionCard>

                                        {/* Education */}
                                        <SectionCard icon={GraduationCap} title="Education">
                                            {mentor.education.length > 0 ? (
                                                <div className="flex flex-col gap-4">
                                                    {mentor.education.map((edu, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="shrink-0">
                                                                <div className="bg-orange-100 rounded-lg p-2.5">
                                                                    <GraduationCap className="h-4 w-4 text-orange-600" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-base font-semibold text-zinc-900">
                                                                    {capitalize(edu.qualification) || "Qualification"}
                                                                </h4>
                                                                <p className="text-sm font-medium text-[#ff9e44]">
                                                                    {edu.institution || "Institution"}
                                                                </p>
                                                                {edu.graduationYear && (
                                                                    <p className="text-xs text-gray-500">
                                                                        Graduated: {edu.graduationYear}
                                                                    </p>
                                                                )}
                                                                {edu.gpaPercentage && (
                                                                    <p className="text-xs text-gray-600">
                                                                        GPA: {edu.gpaPercentage}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyText>No education details available.</EmptyText>
                                            )}
                                        </SectionCard>
                                    </div>

                                    {/* ---- RIGHT COLUMN ---- */}
                                    <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
                                        {/* Domain Expertise */}
                                        <SectionCard icon={BookOpen} title="Domain Expertise" titleSize="sm">
                                            {mentor.domainExpertise.length > 0 || mentor.functionalDomainExpertise.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {[...mentor.domainExpertise, ...mentor.functionalDomainExpertise]
                                                        .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
                                                        .map((d, i) => (
                                                            <SkillBadge key={i} variant="orange">{d}</SkillBadge>
                                                        ))}
                                                </div>
                                            ) : (
                                                <EmptyText>No domain expertise listed.</EmptyText>
                                            )}
                                        </SectionCard>



                                        {/* Skills */}
                                        <SectionCard icon={Star} title="Skills" titleSize="sm">
                                            {mentor.technicalSkills.length > 0 || mentor.softSkills.length > 0 ? (
                                                <div className="flex flex-col gap-4">
                                                    {mentor.technicalSkills.length > 0 && (
                                                        <div>
                                                            <h5 className="text-sm font-semibold text-zinc-900 mb-2">
                                                                Technical Skills
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {mentor.technicalSkills.map((s, i) => (
                                                                    <SkillBadge key={i} variant="orange">{s}</SkillBadge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {mentor.softSkills.length > 0 && (
                                                        <div>
                                                            <h5 className="text-sm font-semibold text-zinc-900 mb-2">
                                                                Soft Skills
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {mentor.softSkills.map((s, i) => (
                                                                    <SkillBadge key={i} variant="orange">{s}</SkillBadge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <EmptyText>No skills listed.</EmptyText>
                                            )}
                                        </SectionCard>

                                        {/* Certifications */}
                                        <SectionCard icon={Award} title="Certifications" titleSize="sm">
                                            {mentor.certifications.length > 0 ? (
                                                <div className="flex flex-col gap-3">
                                                    {mentor.certifications.map((c, i) => (
                                                        <div key={i}>
                                                            <p className="text-sm font-semibold text-zinc-900">
                                                                {c.name}
                                                            </p>
                                                            {(c.issuer || c.year) && (
                                                                <p className="text-xs text-gray-500">
                                                                    {[c.issuer, c.year].filter(Boolean).join(" • ")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyText>No certifications listed.</EmptyText>
                                            )}
                                        </SectionCard>

                                        {/* Languages */}
                                        <SectionCard icon={Languages} title="Languages" titleSize="sm">
                                            {validLanguages.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {validLanguages.map((l, i) => (
                                                        <div key={i} className="flex items-center justify-between">
                                                            <span className="text-sm text-zinc-900">{l.language}</span>
                                                            {l.proficiency && (
                                                                <span className="text-xs text-gray-500 capitalize">{l.proficiency}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <EmptyText>No languages listed.</EmptyText>
                                            )}
                                        </SectionCard>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- Sub-components ---

function SectionCard({
    icon: Icon,
    title,
    titleSize = "lg",
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    titleSize?: "sm" | "lg";
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-zinc-700" />
                    <h3
                        className={`font-bold text-zinc-900 ${titleSize === "sm" ? "text-base" : "text-lg"
                            }`}
                    >
                        {title}
                    </h3>
                </div>
                {children}
            </div>
        </div>
    );
}

function SkillBadge({
    variant,
    children,
}: {
    variant: "orange" | "outline";
    children: React.ReactNode;
}) {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    const styles =
        variant === "orange"
            ? "bg-[rgba(255,228,203,0.4)] border border-[#ffc892] text-[#ff9e44]"
            : "border border-zinc-200 text-zinc-700";

    return <span className={`${base} ${styles}`}>{children}</span>;
}

function EmptyText({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-gray-400 italic">{children}</p>;
}
