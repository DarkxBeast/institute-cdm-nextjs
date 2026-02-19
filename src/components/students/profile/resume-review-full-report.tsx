"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Video,
    Download,
    User,
    Calendar,
    Briefcase,
    ClipboardList,
    Settings2,
} from "lucide-react";
import Link from "next/link";
import type { StudentReport } from "@/app/actions/student-reports";

// ── Types ──

interface Meta {
    date?: string;
    mentee_name?: string;
    mentor_name?: string;
    overall_rating?: number;
    report_version?: string;
}

interface Section {
    title: string;
    rating: number;
    comments?: string;
}

interface FeedbackSummary {
    strengths?: string;
    areas_for_improvement?: string;
    resume_alignment?: string;
    specific_recommendations?: string;
    next_steps?: string;
    certifications_tools_courses?: string;
}

// ── Helpers ──

function parseMeta(data: Record<string, any>): Meta {
    return data.meta && typeof data.meta === "object" ? data.meta : {};
}

function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

function parseFeedback(data: Record<string, any>): FeedbackSummary {
    return data.feedback_summary && typeof data.feedback_summary === "object"
        ? data.feedback_summary
        : {};
}

function hasMeaningfulContent(text?: string): boolean {
    if (!text) return false;
    const t = text.trim().toLowerCase();
    return t.length > 0 && !["nothing", "none", "n/a", "na", "-", "—"].includes(t);
}

// ── Component ──

interface ResumeReviewFullReportProps {
    report: StudentReport;
    backUrl: string;
}

export function ResumeReviewFullReport({
    report,
    backUrl,
}: ResumeReviewFullReportProps) {
    const data = report.reportData;
    const meta = parseMeta(data);
    const sections = parseSections(data);
    const feedback = parseFeedback(data);

    const reportDate = meta.date || report.session?.scheduledDate || report.createdAt;
    const menteeName = meta.mentee_name || "—";
    const mentorName = meta.mentor_name || report.session?.mentorName || "—";

    // Collect section titles as "skills assessed"
    const skills = sections.map((s) => s.title).filter(Boolean);

    // Collect sections that have comments (for the detailed feedback)
    const sectionsWithComments = sections.filter((s) => hasMeaningfulContent(s.comments));

    // Group comments per section for counting
    const totalComments = sectionsWithComments.reduce((sum, s) => {
        // Each section has 1 comment
        return sum + 1;
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* ── Header (dark, sticky) ── */}
            <div className="bg-[#161616] static md:sticky top-0 z-10 shadow-lg">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={backUrl}
                                    className="text-gray-400 hover:text-white transition-colors p-1 -ml-1"
                                >
                                    <ArrowLeft className="h-6 w-6 sm:h-5 sm:w-5" />
                                </Link>
                                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                    Resume Review Report
                                </h1>
                            </div>
                            <p className="text-sm text-slate-300 ml-8 sm:ml-9 max-w-xl">
                                Comprehensive evaluation to identify strengths and growth areas
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 md:mt-0 pl-8 md:pl-0">
                            <Button
                                variant="outline"
                                className="gap-2 text-sm justify-center border-white text-white hover:bg-white/10 bg-transparent"
                            >
                                <Video className="h-4 w-4" />
                                View Recording
                            </Button>
                            <Button className="gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white justify-center">
                                <Download className="h-4 w-4" />
                                Download Report
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 md:mt-2 ml-8 sm:ml-9">
                        Generated on {reportDate || "—"}
                    </p>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ── Candidate Details ── */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-5">
                            Candidate Details
                        </h2>
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <User className="h-7 w-7 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {menteeName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ID: {report.session?.id?.slice(0, 10) || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="flex flex-col gap-3 flex-1">
                                {/* Overall Rating */}
                                {meta.overall_rating !== undefined && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Overall Rating:</span>
                                        <span className="text-gray-900">{meta.overall_rating} / 5</span>
                                    </div>
                                )}

                                {/* Skills Assessed */}
                                {skills.length > 0 && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <Settings2 className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div className="space-y-2">
                                            <span className="text-gray-600 font-medium">Skills Assessed:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-orange-50 text-orange-500 text-xs font-semibold px-3 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Mentor Details ── */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <User className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Mentor Details
                            </h2>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Mentor info */}
                            <div className="flex flex-col gap-3 flex-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {mentorName}
                                </h3>
                                <p className="text-sm font-medium text-orange-500">
                                    {report.session?.journeyItemTitle || "Resume Review Mentor"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Assessment Date:</span>
                                    <span className="text-gray-900">{reportDate || "—"}</span>
                                </div>
                            </div>

                            {/* Right: Assessment Summary */}
                            {(hasMeaningfulContent(feedback.strengths) || hasMeaningfulContent(feedback.resume_alignment)) && (
                                <div className="bg-gray-50 rounded-xl p-4 flex-1 space-y-2">
                                    <h4 className="text-base font-semibold text-gray-900">
                                        Assessment Summary
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feedback.resume_alignment
                                            ? feedback.resume_alignment.slice(0, 200) + (feedback.resume_alignment.length > 200 ? "..." : "")
                                            : feedback.strengths
                                                ? feedback.strengths.slice(0, 200) + (feedback.strengths.length > 200 ? "..." : "")
                                                : "No summary available."
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Detailed Section Feedback ── */}
                {sections.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-gray-900" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Detailed Section Feedback
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {sections.map((section, sIdx) => {
                                const hasComments = hasMeaningfulContent(section.comments);
                                // Split comments into individual points if they have multiple lines
                                const commentLines = hasComments
                                    ? section.comments!
                                        .split(/\n/)
                                        .map((l) => l.trim())
                                        .filter(Boolean)
                                    : [];
                                const commentCount = commentLines.length || 0;

                                return (
                                    <div
                                        key={sIdx}
                                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                                    >
                                        {/* Section header (dark bar) */}
                                        <div className="bg-[#161616] px-6 py-4 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-white">
                                                {section.title}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                {section.rating > 0 && (
                                                    <span className="text-sm font-medium text-gray-300">
                                                        Rating: {section.rating}/5
                                                    </span>
                                                )}
                                                {commentCount > 0 && (
                                                    <span className="bg-orange-50 border border-orange-400 text-orange-500 text-xs font-semibold px-3 py-1 rounded-full">
                                                        {commentCount} {commentCount === 1 ? "comment" : "comments"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comments list */}
                                        {commentCount > 0 && (
                                            <div className="p-6">
                                                <div className="border-l-4 border-blue-200 pl-5 space-y-3">
                                                    <p className="text-base font-medium text-gray-700">
                                                        {section.title}
                                                    </p>
                                                    <div className="space-y-3">
                                                        {commentLines.map((comment, cIdx) => (
                                                            <div
                                                                key={cIdx}
                                                                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                                                            >
                                                                <div className="flex gap-3">
                                                                    {/* Numbered badge */}
                                                                    <div className="bg-orange-400 text-black text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                        {cIdx + 1}
                                                                    </div>
                                                                    <div className="flex-1 space-y-2">
                                                                        <p className="text-sm text-gray-800 leading-relaxed">
                                                                            {comment}
                                                                        </p>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-gray-500">
                                                                                {/* No timestamp in actual data */}
                                                                            </span>
                                                                            <span className="bg-white border border-gray-200 text-xs font-semibold text-gray-900 px-3 py-0.5 rounded-full">
                                                                                Mentor Feedback
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* No comments fallback */}
                                        {commentCount === 0 && (
                                            <div className="p-6">
                                                <p className="text-sm text-gray-400 italic">
                                                    No comments for this section.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Feedback Summary (descriptive sections) ── */}
                {(hasMeaningfulContent(feedback.strengths) ||
                    hasMeaningfulContent(feedback.areas_for_improvement) ||
                    hasMeaningfulContent(feedback.resume_alignment) ||
                    hasMeaningfulContent(feedback.specific_recommendations) ||
                    hasMeaningfulContent(feedback.next_steps) ||
                    hasMeaningfulContent(feedback.certifications_tools_courses)) && (
                        <Card className="border-gray-200 shadow-sm rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <ClipboardList className="h-5 w-5 text-gray-500" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Feedback Summary
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Strengths */}
                                    {hasMeaningfulContent(feedback.strengths) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Strengths
                                            </h4>
                                            <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.strengths}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Areas for Improvement */}
                                    {hasMeaningfulContent(feedback.areas_for_improvement) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Areas for Improvement
                                            </h4>
                                            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.areas_for_improvement}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resume Alignment */}
                                    {hasMeaningfulContent(feedback.resume_alignment) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Resume Alignment
                                            </h4>
                                            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.resume_alignment}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Specific Recommendations */}
                                    {hasMeaningfulContent(feedback.specific_recommendations) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Specific Recommendations
                                            </h4>
                                            <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.specific_recommendations}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Next Steps */}
                                    {hasMeaningfulContent(feedback.next_steps) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Next Steps
                                            </h4>
                                            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.next_steps}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Certifications & Tools */}
                                    {hasMeaningfulContent(feedback.certifications_tools_courses) && (
                                        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Recommended Certifications, Tools & Courses
                                            </h4>
                                            <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.certifications_tools_courses}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </div>
    );
}
