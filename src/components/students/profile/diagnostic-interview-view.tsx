"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    FileText,
    CheckCircle2,
    TrendingUp,
    Target,
    Briefcase,
    ClipboardList,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { StudentReport } from "@/app/actions/student-reports";

interface DiagnosticInterviewViewProps {
    reports: StudentReport[];
    instanceLabel?: string;
}

// ── Data shape helpers ──

interface Meta {
    date?: string;
    mentee_name?: string;
    mentor_name?: string;
    overall_rating?: number;
    alignment_score?: number;
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

function parseMeta(data: Record<string, any>): Meta {
    return (data.meta && typeof data.meta === "object") ? data.meta : {};
}

function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

function parseFeedbackSummary(data: Record<string, any>): FeedbackSummary {
    return (data.feedback_summary && typeof data.feedback_summary === "object")
        ? data.feedback_summary
        : {};
}

/** Rating label and color */
function getRatingLabel(score: number): { text: string; className: string } {
    if (score >= 4.5) return { text: "Excellent", className: "text-emerald-600" };
    if (score >= 3.5) return { text: "Good", className: "text-emerald-500" };
    if (score >= 2.5) return { text: "Average", className: "text-orange-500" };
    if (score >= 1.5) return { text: "Below Average", className: "text-amber-500" };
    return { text: "Needs Improvement", className: "text-red-500" };
}

function hasMeaningfulContent(text?: string): boolean {
    if (!text) return false;
    const t = text.trim().toLowerCase();
    return t.length > 0 && !["nothing", "none", "n/a", "na", "-", "—"].includes(t);
}

function formatDate(raw?: string): string {
    if (!raw) return "—";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export function DiagnosticInterviewView({
    reports,
    instanceLabel,
}: DiagnosticInterviewViewProps) {
    if (!reports.length) return null;
    const report = reports[0];
    if (!report) return null;

    const data = report.reportData;
    const meta = parseMeta(data);
    const sections = parseSections(data);
    const feedback = parseFeedbackSummary(data);

    // Collect strengths and development areas
    const strengths: string[] = [];
    const developmentAreas: string[] = [];
    for (const section of sections) {
        for (const item of section.items || []) {
            if (item.is_positive && item.value) {
                strengths.push(item.label);
            } else if ((!item.is_positive && item.value) || (item.is_positive && !item.value)) {
                developmentAreas.push(item.label);
            }
        }
    }

    // Only show rated sections in bar chart
    const ratedSections = sections.filter((s) => s.rating > 0);

    const completedDate = meta.date || report.session?.scheduledDate || report.createdAt;
    const pathname = usePathname();
    const journeyItemId = report.journeyItemId || '';
    const reportUrl = `${pathname}/report?type=${encodeURIComponent(report.reportType)}${journeyItemId ? `&journeyItemId=${encodeURIComponent(journeyItemId)}` : ''}`;

    return (
        <div className="space-y-6">
            {/* ── Header Card ── */}
            <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6 pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {instanceLabel || "Diagnostic Interview"}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>Completed on {formatDate(completedDate)}</span>
                            </div>
                        </div>
                        <Link href={reportUrl}>
                            <Button className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg gap-2">
                                <FileText className="h-4 w-4" />
                                View Full Report
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* ── Overall Rating ── */}
            {(meta.overall_rating !== undefined || meta.alignment_score !== undefined) && (
                <Card className="relative border-gray-200 shadow-sm mt-4">
                    <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 border-0 shadow-sm z-10">
                        Overall Assessment
                    </Badge>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            {meta.overall_rating !== undefined && (() => {
                                const label = getRatingLabel(meta.overall_rating);
                                return (
                                    <div className="bg-orange-50 rounded-xl p-4 flex-1 text-center">
                                        <p className="text-3xl font-bold text-orange-500">{meta.overall_rating.toFixed(1)}</p>
                                        <p className={`text-sm font-medium mt-1 ${label.className}`}>{label.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Overall Rating</p>
                                    </div>
                                );
                            })()}
                            {meta.alignment_score !== undefined && (() => {
                                const label = getRatingLabel(meta.alignment_score);
                                return (
                                    <div className="bg-orange-50 rounded-xl p-4 flex-1 text-center">
                                        <p className="text-3xl font-bold text-orange-500">{meta.alignment_score.toFixed(1)}</p>
                                        <p className={`text-sm font-medium mt-1 ${label.className}`}>{label.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Alignment Score</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Career Direction (compact at-a-glance) ── */}
            {(hasMeaningfulContent(feedback.target_roles) || hasMeaningfulContent(feedback.job_fit) || hasMeaningfulContent(feedback.plan_b_c)) && (
                <Card className="relative border-gray-200 shadow-sm mt-4">
                    <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                        Career Direction
                    </Badge>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {hasMeaningfulContent(feedback.target_roles) && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-orange-500" />
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Roles</p>
                                    </div>
                                    <div className="space-y-1">
                                        {feedback.target_roles!.split(/\n/).filter(Boolean).map((role, i) => (
                                            <p key={i} className="text-sm font-medium text-gray-800">{role.trim()}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {hasMeaningfulContent(feedback.job_fit) && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-orange-500" />
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Fit</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{feedback.job_fit}</p>
                                </div>
                            )}
                            {hasMeaningfulContent(feedback.plan_b_c) && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4 text-orange-500" />
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan B / C</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{feedback.plan_b_c}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Parameter-wise Rating (bar chart — only rated sections) ── */}
            {ratedSections.length > 0 && (() => {
                const maxScore = 5;
                const chartH = 220;
                const gridLines = [1, 2, 3, 4, 5];

                const getBarColor = (score: number) => {
                    if (score <= 1) return { bg: "from-red-400 to-red-500", badge: "bg-red-500" };
                    if (score <= 2) return { bg: "from-amber-400 to-amber-500", badge: "bg-amber-500" };
                    if (score <= 3) return { bg: "from-orange-400 to-orange-500", badge: "bg-orange-500" };
                    return { bg: "from-emerald-400 to-emerald-500", badge: "bg-emerald-500" };
                };

                return (
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    Parameter-wise Rating
                                </CardTitle>
                                <span className="text-xs text-gray-400 font-medium">
                                    Scale: 0 – 5
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto -mx-2 px-2 pb-2">
                                <div className="flex min-w-[500px]">
                                    {/* Y-axis labels */}
                                    <div
                                        className="flex flex-col justify-between pr-3 flex-none"
                                        style={{ height: `${chartH}px` }}
                                    >
                                        {[...gridLines].reverse().map((v) => (
                                            <span key={v} className="text-[11px] text-gray-400 font-medium leading-none">
                                                {v}
                                            </span>
                                        ))}
                                        <span className="text-[11px] text-gray-400 font-medium leading-none">0</span>
                                    </div>

                                    {/* Chart area */}
                                    <div className="flex-1 relative">
                                        {gridLines.map((v) => (
                                            <div
                                                key={v}
                                                className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                                                style={{ bottom: `${(v / maxScore) * chartH}px` }}
                                            />
                                        ))}
                                        <div
                                            className="absolute left-0 right-0 border-t border-gray-200"
                                            style={{ bottom: 0 }}
                                        />
                                        <div
                                            className="flex items-end justify-around gap-2 sm:gap-4 relative"
                                            style={{ height: `${chartH}px` }}
                                        >
                                            {ratedSections.map((section, i) => {
                                                const pct = section.rating / maxScore;
                                                const barH = Math.max(pct * chartH, 8);
                                                const colors = getBarColor(section.rating);

                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex flex-col items-center flex-1 min-w-0 group"
                                                    >
                                                        <div
                                                            className={`${colors.badge} text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center mb-1.5 shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                                                        >
                                                            {section.rating.toFixed(1)}
                                                        </div>
                                                        <div
                                                            className={`w-full max-w-[72px] rounded-t-lg bg-gradient-to-t ${colors.bg} shadow-sm group-hover:shadow-md group-hover:brightness-110 transition-all duration-500 ease-out cursor-default`}
                                                            style={{ height: `${barH}px` }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* X-axis labels */}
                                <div className="flex min-w-[500px] mt-3">
                                    <div className="pr-3 flex-none" style={{ width: '24px' }} />
                                    <div className="flex-1 flex justify-around gap-2 sm:gap-4">
                                        {ratedSections.map((section, i) => (
                                            <p
                                                key={i}
                                                className="text-[11px] sm:text-xs text-gray-500 text-center flex-1 min-w-0 leading-tight font-medium"
                                            >
                                                {section.title}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })()}

            {/* ── Strengths & Development Areas ── */}
            {(strengths.length > 0 || developmentAreas.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="relative border-gray-200 shadow-sm mt-4">
                        <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                            Strengths
                        </Badge>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {strengths.length > 0 ? (
                                    strengths.slice(0, 6).map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">{item}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No strengths recorded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Development Areas */}
                    <Card className="relative border-gray-200 shadow-sm mt-4">
                        <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                            Areas for Development
                        </Badge>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {developmentAreas.length > 0 ? (
                                    developmentAreas.slice(0, 6).map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <TrendingUp className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">{item}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No development areas recorded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── Mentor Summary ── */}
            {(meta.mentor_name || report.session?.mentorName) && (
                <Card className="relative border-gray-200 shadow-sm mt-4">
                    <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                        Mentor Summary
                    </Badge>
                    <CardContent className="pt-6">
                        <div className="bg-orange-50 rounded-xl p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold text-white">
                                        {(meta.mentor_name || report.session?.mentorName || "M")
                                            .split(" ")
                                            .map((w: string) => w[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {meta.mentor_name || report.session?.mentorName || "—"}
                                    </h4>
                                    <p className="text-sm text-gray-500">Mentor</p>
                                </div>
                            </div>
                            {hasMeaningfulContent(feedback.strongest_aspects) && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">Summary:</p>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                        {feedback.strongest_aspects}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
