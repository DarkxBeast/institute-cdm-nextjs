"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Video,
    Download,
    Star,
    CheckCircle2,
    XCircle,
    ClipboardList,
    User,
    Calendar,
    Briefcase,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import type { StudentReport } from "@/app/actions/student-reports";

// ── Types ──

interface Meta {
    date?: string;
    mentee_name?: string;
    mentor_name?: string;
    overall_rating?: number;
    alignment_score?: number;
    skills_assessed?: string[];
}

interface SectionItem {
    label: string;
    value: boolean;
    is_positive: boolean;
}

interface Section {
    title: string;
    rating: number;
    items: SectionItem[];
}

interface FeedbackSummary {
    job_fit?: string;
    plan_b_c?: string;
    target_roles?: string;
    strongest_aspects?: string;
    areas_for_improvement?: string;
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

function formatDate(raw?: string): string {
    if (!raw) return "—";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

// ── Star Rating Component ──

function StarRating({
    rating,
    max = 5,
    variant = "default",
}: {
    rating: number;
    max?: number;
    variant?: "default" | "light";
}) {
    const starFilled =
        variant === "light"
            ? "text-orange-400 fill-orange-400"
            : "text-orange-400 fill-orange-400";
    const starEmpty =
        variant === "light"
            ? "text-gray-500 fill-gray-500"
            : "text-gray-200 fill-gray-200";
    const textColor =
        variant === "light" ? "text-white" : "text-gray-600";

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }, (_, i) => (
                <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? starFilled : starEmpty}`}
                />
            ))}
            <span className={`text-sm font-semibold ml-1.5 ${textColor}`}>
                {typeof rating === 'number' ? rating.toFixed(1) : rating}/{max}
            </span>
        </div>
    );
}

// ── Yes/No Badge ──

function ValueBadge({ value }: { value: boolean }) {
    if (value) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Yes
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500">
            <XCircle className="h-3.5 w-3.5" />
            No
        </span>
    );
}

// ── Main Component ──

interface DiagnosticInterviewFullReportProps {
    report: StudentReport;
    backUrl: string;
}

export function DiagnosticInterviewFullReport({
    report,
    backUrl,
}: DiagnosticInterviewFullReportProps) {
    const data = report.reportData;
    const meta = parseMeta(data);
    const sections = parseSections(data);
    const feedback = parseFeedback(data);

    const reportDate = meta.date || report.session?.scheduledDate || report.createdAt;
    const menteeName = meta.mentee_name || "—";
    const mentorName = meta.mentor_name || report.session?.mentorName || "—";

    // Count total checklist items
    const totalItems = sections.reduce((sum, s) => sum + (s.items?.length || 0), 0);

    // Skills assessed
    const skills: string[] = meta.skills_assessed || [];

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
                                    Diagnostic Interview Report
                                </h1>
                            </div>
                            <p className="text-sm text-slate-300 ml-8 sm:ml-9 max-w-xl">
                                Comprehensive evaluation to identify strengths and growth areas
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 md:mt-2 ml-8 sm:ml-9">
                        Generated on {formatDate(reportDate)}
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* ── Candidate Details (single card, Figma layout) ── */}
                <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-5">
                            Candidate Details
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left: Avatar + Name */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <User className="h-7 w-7 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {menteeName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ID: {report.session?.id?.slice(0, 10) || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Metadata rows */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500 font-medium">Date:</span>
                                    <span className="text-gray-900">{formatDate(reportDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500 font-medium">Overall Rating:</span>
                                    <span className="text-gray-900">{meta.overall_rating != null ? Number(meta.overall_rating).toFixed(1) : "—"} / 5</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                    <BookOpen className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                                    <span className="text-gray-500 font-medium shrink-0">Skills Assessed:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skills.length > 0
                                            ? skills.map((skill, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="bg-orange-50 text-orange-700 border border-orange-200 text-xs py-0.5 px-2 font-normal"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))
                                            : <span className="text-gray-900">{meta.alignment_score ?? "—"} / 5 alignment</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Mentor Details + Assessment Summary (combined 2-col card) ── */}
                <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <User className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Mentor Details
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Mentor info */}
                            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {mentorName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {report.session?.journeyItemTitle || "Interview Mentor"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Assessment Date:</span>
                                    <span className="text-gray-900">{formatDate(reportDate)}</span>
                                </div>
                            </div>

                            {/* Right: Assessment summary */}
                            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Assessment Summary
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feedback.strongest_aspects
                                        ? feedback.strongest_aspects.slice(0, 200) + (feedback.strongest_aspects.length > 200 ? "..." : "")
                                        : "No summary available."}
                                </p>
                                <div className="bg-emerald-50 rounded-lg px-4 py-3">
                                    <p className="text-sm text-emerald-800 font-medium">
                                        Progress: {totalItems}/{totalItems} questions completed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Detailed Mentor Feedback ── */}
                <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ClipboardList className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Detailed Mentor Feedback
                            </h2>
                        </div>

                        {/* ── Descriptive Questions ── */}
                        {(feedback.strongest_aspects || feedback.areas_for_improvement || feedback.job_fit || feedback.target_roles) && (
                            <div className="mb-8">
                                <div className="bg-[#161616] text-white rounded-t-xl px-5 py-4">
                                    <h3 className="text-lg font-semibold">Descriptive Questions</h3>
                                </div>
                                <div className="border border-t-0 border-gray-200 rounded-b-xl divide-y divide-gray-200">
                                    {/* Areas for improvement */}
                                    {feedback.areas_for_improvement && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                Where do you believe improvements are needed?
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-4">
                                                ( Summary of Candidate - areas where they need to work on )
                                            </p>
                                            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-3 sm:p-4">
                                                <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                                    {feedback.areas_for_improvement.split("\n").filter(Boolean).map((line, i) => {
                                                        const cleaned = line.replace(/^[•\-]\s*/, "").trim();
                                                        if (!cleaned) return null;
                                                        return (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="shrink-0">•</span>
                                                                <span>{cleaned}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Target roles — numbered Option badges */}
                                    {feedback.target_roles && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                What are the top 2–3 roles the student is currently targeting?
                                            </h4>
                                            <div className="space-y-2">
                                                {feedback.target_roles.split("\n").filter(Boolean).map((role, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2.5 font-medium shrink-0"
                                                        >
                                                            Option {i + 1}
                                                        </Badge>
                                                        <span className="text-sm text-gray-900">
                                                            {role.replace(/^[•\-\d.)\s]+/, "").trim()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Has the candidate shown clarity... */}
                                    {feedback.plan_b_c && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                Has the candidate shown clarity about their past roles and learnings?
                                            </h4>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Are they able to clearly state what they want to do next?
                                            </h4>
                                            <div className="bg-gray-50 border-l-4 border-gray-300 rounded-r-lg p-3 sm:p-4">
                                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                                    {feedback.plan_b_c}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Strongest aspects */}
                                    {feedback.strongest_aspects && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                What are the strongest aspects of the candidate?
                                            </h4>
                                            <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg p-3 sm:p-4">
                                                <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                                    {feedback.strongest_aspects.split("\n").filter(Boolean).map((line, i) => {
                                                        const cleaned = line.replace(/^[•\-]\s*/, "").trim();
                                                        if (!cleaned) return null;
                                                        return (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="shrink-0">•</span>
                                                                <span>{cleaned}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Job fit */}
                                    {feedback.job_fit && (
                                        <div className="p-4 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Based on your assessment, which 2–3 job families would the student fit best in?
                                            </h4>
                                            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 sm:p-4">
                                                <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
                                                    {feedback.job_fit.split("\n").filter(Boolean).map((line, i) => {
                                                        const cleaned = line.replace(/^[•\-]\s*/, "").trim();
                                                        if (!cleaned) return null;
                                                        return (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="shrink-0">•</span>
                                                                <span>{cleaned}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Section-wise Checklists ── */}
                        <div className="space-y-6">
                            {sections.map((section, sIdx) => (
                                <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                                    {/* Section header — dark #161616 */}
                                    <div className="bg-[#161616] px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                                        <h3 className="text-base font-semibold text-white">
                                            {section.title}
                                        </h3>
                                        <StarRating rating={section.rating} variant="light" />
                                    </div>

                                    {/* Checklist items */}
                                    <div className="divide-y divide-gray-100">
                                        {(section.items || []).map((item, iIdx) => (
                                            <div
                                                key={iIdx}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3.5 gap-3 sm:gap-4 hover:bg-gray-50/50 transition-colors"
                                            >
                                                <p className="text-sm text-gray-700 flex-1">
                                                    {item.label}
                                                </p>
                                                <div className="flex-shrink-0 self-start sm:self-auto">
                                                    <ValueBadge value={item.value} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
