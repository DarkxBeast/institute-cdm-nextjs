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
    AlertTriangle,
    MessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { StudentReport } from "@/app/actions/student-reports";

interface PracticeInterviewViewProps {
    reports: StudentReport[];
    instanceLabel?: string;
}

// ── Data shape helpers ──

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
}

interface FeedbackSummary {
    strengths?: string;
    additional_strengths?: string;
    areas_for_improvement?: string;
    overall_impression?: string;
    career_goals_articulation?: string;
    red_flags?: string;
    red_flag_remarks?: string;
}

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

/** Check if a text field has meaningful content (not empty or generic "Nothing" / "None") */
function hasMeaningfulContent(text?: string): boolean {
    if (!text) return false;
    const trimmed = text.trim().toLowerCase();
    return trimmed.length > 0 && trimmed !== "nothing" && trimmed !== "none" && trimmed !== "n/a" && trimmed !== "na" && trimmed !== "nothing to highlight";
}

function formatDate(raw?: string): string {
    if (!raw) return "—";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

// ── Component ──

export function PracticeInterviewView({
    reports,
    instanceLabel,
}: PracticeInterviewViewProps) {
    const pathname = usePathname();

    if (!reports.length) return null;

    return (
        <div className="space-y-12">
            {reports.map((report, index) => {
                const data = report.reportData;
                const meta = parseMeta(data);
                const sections = parseSections(data);
                const feedback = parseFeedback(data);

                const completedDate = meta.date || report.session?.scheduledDate || report.createdAt;
                const journeyItemId = report.journeyItemId || "";
                const reportUrl = `${pathname}/report?type=${encodeURIComponent(report.reportType)}${journeyItemId ? `&journeyItemId=${encodeURIComponent(journeyItemId)}` : ""}`;

                // Combine strengths text
                const allStrengths = [feedback.strengths, feedback.additional_strengths]
                    .filter(Boolean)
                    .join("\n");

                return (
                    <div key={report.id} className="space-y-6">
                        {reports.length > 1 && index > 0 && (
                            <div className="pt-6 border-t border-dashed border-gray-200" />
                        )}
                        {/* ── Header Card ── */}
                        <Card className="border-gray-200 shadow-sm relative overflow-hidden">
                            {reports.length > 1 && (
                                <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                                    Session {reports.length - index}
                                </div>
                            )}
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-semibold text-gray-900">
                                            {instanceLabel || "Practice Interview"}
                                            {reports.length > 1 && <span className="text-gray-400 ml-2 font-normal text-lg">({reports.length - index})</span>}
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
                        {meta.overall_rating !== undefined && (
                            <Card className="relative border-gray-200 shadow-sm mt-4">
                                <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 border-0 shadow-sm z-10">
                                    Overall Assessment
                                </Badge>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <div className="bg-orange-50 rounded-xl p-4 flex-1 text-center">
                                            <p className="text-3xl font-bold text-orange-500">{meta.overall_rating.toFixed(1)}</p>
                                            <p className="text-sm text-gray-600 mt-1">Overall Rating</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Parameter-wise Rating (bar chart) ── */}
                        {sections.length > 0 && (() => {
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
                                                        {sections.map((section, i) => {
                                                            const pct = section.rating / maxScore;
                                                            const barH = Math.max(pct * chartH, 8);
                                                            const colors = getBarColor(section.rating);

                                                            return (
                                                                <div key={i} className="flex flex-col items-center flex-1 min-w-0 group">
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
                                                <div className="pr-3 flex-none" style={{ width: "24px" }} />
                                                <div className="flex-1 flex justify-around gap-2 sm:gap-4">
                                                    {sections.map((section, i) => (
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

                        {/* ── Overall Impression ── */}
                        {hasMeaningfulContent(feedback.overall_impression) && (
                            <Card className="relative border-gray-200 shadow-sm mt-4">
                                <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                                    Overall Impression
                                </Badge>
                                <CardContent className="pt-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <MessageSquare className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                {feedback.overall_impression}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Strengths & Areas for Improvement ── */}
                        {(hasMeaningfulContent(allStrengths) || hasMeaningfulContent(feedback.areas_for_improvement)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="relative border-gray-200 shadow-sm mt-4">
                                    <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                                        Strengths
                                    </Badge>
                                    <CardContent className="pt-6">
                                        {hasMeaningfulContent(allStrengths) ? (
                                            <div className="space-y-2">
                                                {allStrengths.split(/\n/).filter(Boolean).map((line, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                        <p className="text-sm text-gray-600">{line.replace(/^\d+\.\s*/, "").trim()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No strengths recorded.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="relative border-gray-200 shadow-sm mt-4">
                                    <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                                        Areas for Improvement
                                    </Badge>
                                    <CardContent className="pt-6">
                                        {hasMeaningfulContent(feedback.areas_for_improvement) ? (
                                            <div className="space-y-2">
                                                {feedback.areas_for_improvement!.split(/[,\n]/).filter(Boolean).map((line, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <TrendingUp className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                                                        <p className="text-sm text-gray-600">{line.replace(/^\d+\.\s*/, "").trim()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No improvement areas recorded.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ── Career Goals ── */}
                        {hasMeaningfulContent(feedback.career_goals_articulation) && (
                            <Card className="relative border-gray-200 shadow-sm mt-4">
                                <Badge className="absolute -top-3 left-4 bg-orange-400 hover:bg-orange-400 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                                    Career Goals Assessment
                                </Badge>
                                <CardContent className="pt-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Target className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                {feedback.career_goals_articulation}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Red Flags (only shown if meaningful) ── */}
                        {hasMeaningfulContent(feedback.red_flags) && (
                            <Card className="relative border-gray-200 shadow-sm mt-4 border-amber-200">
                                <Badge className="absolute -top-3 left-4 bg-amber-500 hover:bg-amber-500 text-white text-xs rounded-full px-3 py-1 shadow-sm z-10">
                                    Red Flags
                                </Badge>
                                <CardContent className="pt-6">
                                    <div className="bg-amber-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {feedback.red_flags}
                                                </p>
                                                {hasMeaningfulContent(feedback.red_flag_remarks) && (
                                                    <p className="text-sm text-gray-500 italic mt-2">
                                                        {feedback.red_flag_remarks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
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
                                        {hasMeaningfulContent(feedback.overall_impression) && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-900">Summary:</p>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {feedback.overall_impression}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

