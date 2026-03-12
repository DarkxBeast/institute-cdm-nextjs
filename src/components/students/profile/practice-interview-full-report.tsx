"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Video,
    Download,
    Star,
    User,
    Calendar,
    Briefcase,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    Lightbulb,
    Award,
    Target,
    TrendingUp,
    MessageSquare,
    Flag,
    ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import type { StudentReport } from "@/app/actions/student-reports";

// ── Types ──

interface Meta {
    date?: string;
    mentee_name?: string;
    mentor_name?: string;
    mentor_title?: string;
    mentor_experience?: string;
    experience?: string;
    role?: string;
    overall_rating?: number;
    skills_assessed?: string[];
    assessment_summary?: string;
    key_remarks?: string;
    report_version?: string;
}

/** Actual section item from the JSONB `sections` array */
interface Section {
    title: string;
    rating: number;
}

/** Actual feedback_summary object from the JSONB */
interface FeedbackSummary {
    red_flags?: string;
    red_flag_remarks?: string;
    overall_impression?: string;
    career_goals_comment?: string;
    strongest_technical_aspects?: string;
    areas_for_technical_improvement?: string;
    areas_for_behavioral_improvement?: string;
}

interface SkillBreakdownItem {
    name: string;
    rating: number;
}

interface SubMetric {
    name: string;
    percentage: number;
}

interface FeedbackPoint {
    text: string;
    type: "positive" | "improvement" | "suggestion";
}

interface SkillSection {
    title: string;
    rating: number;
    sub_metrics?: SubMetric[];
    feedback_points?: FeedbackPoint[];
}

interface SoftSkill {
    name: string;
    score: number;
    max: number;
}

// ── Helpers ──

function parseMeta(data: Record<string, any>): Meta {
    return data.meta && typeof data.meta === "object" ? data.meta : {};
}

/** Parse the `sections` array from actual JSONB */
function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

/** Parse the `feedback_summary` object from actual JSONB */
function parseFeedbackSummary(data: Record<string, any>): FeedbackSummary {
    return data.feedback_summary && typeof data.feedback_summary === "object"
        ? data.feedback_summary
        : {};
}

function parseSkillBreakdown(data: Record<string, any>): SkillBreakdownItem[] {
    return Array.isArray(data.skill_breakdown) ? data.skill_breakdown : [];
}

function parseSkillSections(data: Record<string, any>): SkillSection[] {
    return Array.isArray(data.skill_sections) ? data.skill_sections : [];
}

function parseSoftSkills(data: Record<string, any>): SoftSkill[] {
    return Array.isArray(data.soft_skills) ? data.soft_skills : [];
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
    size = "md",
}: {
    rating: number;
    max?: number;
    variant?: "default" | "light";
    size?: "sm" | "md";
}) {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    const starFilled = "text-orange-400 fill-orange-400";
    const starEmpty =
        variant === "light"
            ? "text-gray-500 fill-gray-500"
            : "text-gray-200 fill-gray-200";

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }, (_, i) => (
                <Star
                    key={i}
                    className={`${sizeClass} ${i < Math.round(rating) ? starFilled : starEmpty}`}
                />
            ))}
        </div>
    );
}

// ── Feedback Icon ──

function FeedbackIcon({ type }: { type: string }) {
    switch (type) {
        case "positive":
            return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
        case "improvement":
            return <AlertCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />;
        case "suggestion":
            return <Lightbulb className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />;
        default:
            return <CheckCircle2 className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />;
    }
}

// ── Radar Chart Component (SVG-based hexagonal) ──

function RadarChart({
    labels,
    values,
    max = 5,
}: {
    labels: string[];
    values: number[];
    max?: number;
}) {
    const size = 260;
    const center = size / 2;
    const radius = 100;
    const levels = 5;

    // Calculate angle for each axis (starting from top)
    const angleStep = (2 * Math.PI) / labels.length;
    const startAngle = -Math.PI / 2;

    // Get point coordinates
    const getPoint = (index: number, value: number) => {
        const angle = startAngle + index * angleStep;
        const r = (value / max) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Generate polygon points for grid levels
    const gridPolygons = Array.from({ length: levels }, (_, level) => {
        const levelRadius = ((level + 1) / levels) * radius;
        const points = labels.map((_, i) => {
            const angle = startAngle + i * angleStep;
            return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
        });
        return points.join(" ");
    });

    // Generate data polygon
    const dataPoints = values.map((v, i) => {
        const p = getPoint(i, v);
        return `${p.x},${p.y}`;
    });

    // Label positions
    const labelPositions = labels.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const r = radius + 30;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    });

    return (
        <div className="flex items-center justify-center py-6">
            <svg width="100%" height={size + 60} viewBox={`-30 -30 ${size + 60} ${size + 60}`} className="overflow-visible">
                {/* Grid polygons */}
                {gridPolygons.map((points, i) => (
                    <polygon
                        key={`grid-${i}`}
                        points={points}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={1}
                    />
                ))}

                {/* Axis lines */}
                {labels.map((_, i) => {
                    const p = getPoint(i, max);
                    return (
                        <line
                            key={`axis-${i}`}
                            x1={center}
                            y1={center}
                            x2={p.x}
                            y2={p.y}
                            stroke="#e5e7eb"
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={dataPoints.join(" ")}
                    fill="rgba(249, 115, 22, 0.15)"
                    stroke="#f97316"
                    strokeWidth={2}
                />

                {/* Data points */}
                {values.map((v, i) => {
                    const p = getPoint(i, v);
                    return (
                        <circle
                            key={`point-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={3}
                            fill="#f97316"
                        />
                    );
                })}

                {/* Labels */}
                {labelPositions.map((pos, i) => (
                    <text
                        key={`label-${i}`}
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-700 text-[10px] font-medium uppercase tracking-wide"
                    >
                        {labels[i]}
                    </text>
                ))}
            </svg>
        </div>
    );
}

// ── Main Component ──

interface PracticeInterviewFullReportProps {
    report: StudentReport;
    backUrl: string;
    enrollmentId?: string;
}

export function PracticeInterviewFullReport({
    report,
    backUrl,
    enrollmentId,
}: PracticeInterviewFullReportProps) {
    const data = report.reportData;
    const meta = parseMeta(data);
    const sections = parseSections(data);
    const feedbackSummary = parseFeedbackSummary(data);
    const skillBreakdown = parseSkillBreakdown(data);
    const skillSections = parseSkillSections(data);
    const softSkills = parseSoftSkills(data);

    const reportDate = meta.date || report.session?.scheduledDate || report.createdAt;
    const menteeName = meta.mentee_name || "—";
    const mentorName = meta.mentor_name || report.session?.mentorName || "—";
    const overallRating = meta.overall_rating ?? 0;
    const skills: string[] = meta.skills_assessed || [];
    const keyRemarks = meta.key_remarks || "";

    // Derive skill breakdown from sections if the dedicated field is empty
    const effectiveSkillBreakdown: SkillBreakdownItem[] =
        skillBreakdown.length > 0
            ? skillBreakdown
            : sections.map((s) => ({ name: s.title, rating: s.rating }));

    // Radar chart: use sections data, or fallback to defaults
    const radarLabels: string[] = (() => {
        if (sections.length > 0) return sections.map((s) => s.title);
        if (data.radar_values && Array.isArray(data.radar_values))
            return ["Communication", "Technical Skills", "Enthusiasm", "Soft Skills", "Attitude"];
        return ["Communication", "Technical Skills", "Enthusiasm", "Soft Skills", "Attitude"];
    })();

    const radarValues: number[] = (() => {
        if (sections.length > 0) return sections.map((s) => s.rating);
        if (data.radar_values && Array.isArray(data.radar_values)) return data.radar_values;
        return radarLabels.map(() => overallRating);
    })();

    // Check if we have any feedback to show
    const hasFeedback =
        feedbackSummary.overall_impression ||
        feedbackSummary.strongest_technical_aspects ||
        feedbackSummary.areas_for_technical_improvement ||
        feedbackSummary.areas_for_behavioral_improvement ||
        feedbackSummary.career_goals_comment ||
        feedbackSummary.red_flags;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* ── Header ── */}
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
                                    Practice Interview Report
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
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Report Details (merged candidate + mentor) ── */}
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-5">
                            Report Details
                        </h2>
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Column 1: Candidate */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <User className="h-7 w-7 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {menteeName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ID: {enrollmentId || report.session?.id?.slice(0, 10) || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block w-px bg-gray-200" />

                            {/* Column 2: Mentor */}
                            <div className="space-y-2 lg:pl-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mentor</p>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {mentorName}
                                </h3>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block w-px bg-gray-200" />

                            {/* Column 3: Date & Rating */}
                            <div className="space-y-3 lg:pl-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500 font-medium">Date:</span>
                                    <span className="text-gray-900">{formatDate(reportDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500 font-medium">Overall Rating:</span>
                                    <span className="text-gray-900">{overallRating.toFixed(1)} / 5</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Overall Assessment ── */}
                <Card className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                        <div className="mb-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Overall Assessment
                            </h2>
                            <p className="text-xl font-bold text-orange-500">
                                {overallRating.toFixed(1)}/5.0
                            </p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                            {/* Left: Radar chart */}
                            <div className="shrink-0 w-full lg:w-3/5 xl:w-[60%] flex justify-center">
                                <RadarChart
                                    labels={radarLabels}
                                    values={radarValues}
                                    max={5}
                                />
                            </div>

                            {/* Right: Skill breakdown grid */}
                            {effectiveSkillBreakdown.length > 0 && (
                                <div className="flex-1 w-full max-w-sm ml-auto">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                                        Skill Breakdown
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {effectiveSkillBreakdown.map((skill, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                                            >
                                                <span className="text-sm font-medium text-gray-700">
                                                    {skill.name}
                                                </span>
                                                <StarRating rating={skill.rating} size="sm" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Key Remarks ── */}
                {keyRemarks && (
                    <div className="bg-gradient-to-r from-[#ffe4cb] to-[#fff3e7] rounded-2xl p-6 shadow-sm">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <svg className="h-8 w-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Key Remarks
                                </h3>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {keyRemarks}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Feedback Summary ── */}
                {hasFeedback && (
                    <Card className="border-0 shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="h-5 w-5 text-gray-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Feedback Summary
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Overall Impression */}
                                {feedbackSummary.overall_impression && (
                                    <div className="bg-emerald-50 rounded-xl p-4 space-y-2 md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="h-4 w-4 text-emerald-600" />
                                            <h3 className="text-sm font-semibold text-emerald-800">
                                                Overall Impression
                                            </h3>
                                        </div>
                                        <p className="text-sm text-emerald-700 leading-relaxed">
                                            {feedbackSummary.overall_impression}
                                        </p>
                                    </div>
                                )}

                                {/* Strongest Technical Aspects */}
                                {feedbackSummary.strongest_technical_aspects && (
                                    <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-blue-600" />
                                            <h3 className="text-sm font-semibold text-blue-800">
                                                Strongest Technical Aspects
                                            </h3>
                                        </div>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            {feedbackSummary.strongest_technical_aspects}
                                        </p>
                                    </div>
                                )}

                                {/* Career Goals */}
                                {feedbackSummary.career_goals_comment && (
                                    <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-purple-600" />
                                            <h3 className="text-sm font-semibold text-purple-800">
                                                Career Goals
                                            </h3>
                                        </div>
                                        <p className="text-sm text-purple-700 leading-relaxed">
                                            {feedbackSummary.career_goals_comment}
                                        </p>
                                    </div>
                                )}

                                {/* Areas for Technical Improvement */}
                                {feedbackSummary.areas_for_technical_improvement && (
                                    <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-orange-600" />
                                            <h3 className="text-sm font-semibold text-orange-800">
                                                Technical Improvement Areas
                                            </h3>
                                        </div>
                                        <p className="text-sm text-orange-700 leading-relaxed">
                                            {feedbackSummary.areas_for_technical_improvement}
                                        </p>
                                    </div>
                                )}

                                {/* Areas for Behavioral Improvement */}
                                {feedbackSummary.areas_for_behavioral_improvement && (
                                    <div className="bg-amber-50 rounded-xl p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-amber-600" />
                                            <h3 className="text-sm font-semibold text-amber-800">
                                                Behavioral Improvement Areas
                                            </h3>
                                        </div>
                                        <p className="text-sm text-amber-700 leading-relaxed">
                                            {feedbackSummary.areas_for_behavioral_improvement}
                                        </p>
                                    </div>
                                )}

                                {/* Red Flags */}
                                {feedbackSummary.red_flags && feedbackSummary.red_flags.toLowerCase() !== "no" && (
                                    <div className="bg-red-50 rounded-xl p-4 space-y-2 md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Flag className="h-4 w-4 text-red-600" />
                                            <h3 className="text-sm font-semibold text-red-800">
                                                Red Flags
                                            </h3>
                                        </div>
                                        <p className="text-sm text-red-700 leading-relaxed">
                                            {feedbackSummary.red_flags}
                                        </p>
                                        {feedbackSummary.red_flag_remarks && feedbackSummary.red_flag_remarks.toLowerCase() !== "no" && (
                                            <p className="text-sm text-red-600 italic">
                                                Remarks: {feedbackSummary.red_flag_remarks}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ── Detailed Skill Assessment ── */}
                {skillSections.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Detailed Skill Assessment
                        </h2>

                        {skillSections.map((section, sIdx) => (
                            <Card key={sIdx} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                                {/* Dark header with gradient */}
                                <div className="bg-gradient-to-r from-[#161616] to-[#161616]/80 px-6 py-5 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white tracking-tight">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={section.rating} variant="light" size="sm" />
                                        <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                            {section.rating.toFixed(1)}/5
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Sub-metrics with progress bars */}
                                        {section.sub_metrics && section.sub_metrics.length > 0 && (
                                            <div className="lg:w-[320px] shrink-0 space-y-4">
                                                {section.sub_metrics.map((metric, mIdx) => (
                                                    <div key={mIdx} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {metric.name}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {metric.percentage}%
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${mIdx % 2 === 0 ? "bg-orange-400" : "bg-gray-900"}`}
                                                                style={{ width: `${metric.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Right: Feedback points */}
                                        {section.feedback_points && section.feedback_points.length > 0 && (
                                            <div className="flex-1 space-y-3">
                                                <h4 className="text-base font-semibold text-gray-900">
                                                    Feedback Points
                                                </h4>
                                                <div className="space-y-3">
                                                    {section.feedback_points.map((fp, fpIdx) => (
                                                        <div
                                                            key={fpIdx}
                                                            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
                                                        >
                                                            <FeedbackIcon type={fp.type} />
                                                            <p className="text-sm text-gray-700">
                                                                {fp.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ── Soft Skills Assessment ── */}
                {softSkills.length > 0 && (
                    <Card className="border-0 shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Award className="h-5 w-5 text-gray-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Soft Skills Assessment
                                </h2>
                            </div>
                            <div className="space-y-6">
                                {softSkills.map((skill, i) => {
                                    const percentage = (skill.score / skill.max) * 100;
                                    // Alternate bar colors between dark and orange
                                    const barColor = i % 2 === 0 ? "bg-gray-900" : "bg-orange-400";

                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {skill.name}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    {skill.score.toFixed(1)}/{skill.max}
                                                </span>
                                            </div>
                                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${barColor}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
