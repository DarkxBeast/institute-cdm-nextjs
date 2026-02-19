"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowRightLeft,
    Clock,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface ResumeReviewAnalyticsProps {
    reports: AnalyticsReport[];
}

// ── Helpers ──

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
}

function parseMeta(data: Record<string, any>) {
    return data.meta && typeof data.meta === "object" ? data.meta : {};
}

function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

function parseFeedback(data: Record<string, any>): FeedbackSummary {
    return data.feedback_summary && typeof data.feedback_summary === "object" ? data.feedback_summary : {};
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        });
    } catch { return dateStr; }
}

function ratingColor(r: number) {
    if (r >= 4) return "#10b981";
    if (r >= 3) return "#f59e0b";
    if (r >= 2) return "#f97316";
    return "#ef4444";
}

// ── Component ──

export default function ResumeReviewAnalytics({ reports }: ResumeReviewAnalyticsProps) {
    if (reports.length === 0) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                    <FileText className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Resume Review</h2>
                    <p className="text-xs text-gray-500">No reports yet</p>
                </div>
            </div>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No Resume Review reports</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Reports will appear here once a resume review has been completed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const sorted = [...reports].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const hasComparison = sorted.length >= 2;
    const latest = sorted[sorted.length - 1];
    const meta = parseMeta(latest.reportData);
    const sections = parseSections(latest.reportData);
    const feedback = parseFeedback(latest.reportData);

    const sectionData = sections.map((s) => ({
        name: s.title,
        rating: s.rating,
        fill: ratingColor(s.rating),
    }));

    // Comparison
    let comparisonData: { name: string; report1: number; report2: number; delta: number }[] = [];
    let r1Label = "", r2Label = "";

    if (hasComparison) {
        const r1 = sorted[0], r2 = sorted[sorted.length - 1];
        const s1 = parseSections(r1.reportData);
        const s2 = parseSections(r2.reportData);
        r1Label = `RR #1 (${formatDate(r1.createdAt)})`;
        r2Label = `RR #${sorted.length} (${formatDate(r2.createdAt)})`;

        const s1Map = new Map(s1.map((s) => [s.title, s.rating]));
        const allTitles = Array.from(new Set([...s1.map((s) => s.title), ...s2.map((s) => s.title)]));
        comparisonData = allTitles.map((title) => {
            const v1 = s1Map.get(title) ?? 0;
            const v2 = s2.find((s) => s.title === title)?.rating ?? 0;
            return { name: title, report1: v1, report2: v2, delta: v2 - v1 };
        });
    }

    const hasData = sectionData.length > 0 || feedback.strengths || feedback.areas_for_improvement ||
        feedback.resume_alignment || feedback.specific_recommendations || feedback.next_steps ||
        meta.overall_rating != null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                    <FileText className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Resume Review</h2>
                    <p className="text-xs text-gray-500">
                        {reports.length} report{reports.length > 1 ? "s" : ""} ·
                        Latest: {formatDate(latest.createdAt)}
                    </p>
                </div>
                {meta.overall_rating != null && (
                    <Badge
                        variant="outline"
                        className="ml-auto text-sm font-semibold px-3 py-1"
                        style={{ borderColor: ratingColor(meta.overall_rating), color: ratingColor(meta.overall_rating) }}
                    >
                        {meta.overall_rating.toFixed(1)}/5
                    </Badge>
                )}
            </div>

            {!hasData ? (
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-3 bg-gray-50 rounded-full mb-3">
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Report data not yet available</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                This report has been created but detailed analytics haven&apos;t been generated yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Section Ratings */}
                    {sectionData.length > 0 && (
                        <Card className="border-gray-200 shadow-sm rounded-2xl">
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Section Ratings — Latest</h3>
                                <ResponsiveContainer width="100%" height={Math.max(180, sectionData.length * 40)}>
                                    <BarChart data={sectionData} layout="vertical" barCategoryGap="25%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                        <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                                            tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                                        <YAxis type="category" dataKey="name" width={130}
                                            tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                                            formatter={(v) => [`${v ?? 0}/5`, "Rating"]} />
                                        <Bar dataKey="rating" radius={[0, 6, 6, 0]} barSize={16}>
                                            {sectionData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feedback Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedback.strengths && (
                            <FeedbackCard title="Strengths" content={feedback.strengths} color="emerald" />
                        )}
                        {feedback.areas_for_improvement && (
                            <FeedbackCard title="Areas for Improvement" content={feedback.areas_for_improvement} color="amber" />
                        )}
                        {feedback.resume_alignment && (
                            <FeedbackCard title="Resume Alignment" content={feedback.resume_alignment} color="blue" />
                        )}
                        {feedback.specific_recommendations && (
                            <FeedbackCard title="Recommendations" content={feedback.specific_recommendations} color="violet" />
                        )}
                    </div>

                    {/* Comparison */}
                    {hasComparison && comparisonData.length > 0 && (
                        <Card className="border-gray-200 shadow-sm rounded-2xl">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {r1Label} vs {r2Label}
                                    </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={Math.max(180, comparisonData.length * 45)}>
                                    <BarChart data={comparisonData} layout="vertical" barCategoryGap="30%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                        <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                                            tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                                        <YAxis type="category" dataKey="name" width={130}
                                            tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                                            formatter={(v, name) => [
                                                `${v ?? 0}/5`, name === "report1" ? r1Label : r2Label,
                                            ]} />
                                        <Bar dataKey="report1" fill="#fed7aa" radius={[0, 4, 4, 0]} barSize={12} name="report1" />
                                        <Bar dataKey="report2" fill="#f97316" radius={[0, 4, 4, 0]} barSize={12} name="report2" />
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Delta Table */}
                                <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left py-2 px-3 font-medium text-gray-600">Section</th>
                                                <th className="text-center py-2 px-3 font-medium text-gray-600">RR #1</th>
                                                <th className="text-center py-2 px-3 font-medium text-gray-600">RR #{sorted.length}</th>
                                                <th className="text-center py-2 px-3 font-medium text-gray-600">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map((row, i) => (
                                                <tr key={i} className="border-t border-gray-50">
                                                    <td className="py-2 px-3 text-gray-800">{row.name}</td>
                                                    <td className="text-center py-2 px-3 text-gray-600">{row.report1.toFixed(1)}</td>
                                                    <td className="text-center py-2 px-3 text-gray-600">{row.report2.toFixed(1)}</td>
                                                    <td className="text-center py-2 px-3"><DeltaBadge delta={row.delta} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

// ── Sub-components ──

const FEEDBACK_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-500" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-500" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-500" },
};

function FeedbackCard({ title, content, color }: { title: string; content: string; color: string }) {
    const c = FEEDBACK_COLORS[color] ?? FEEDBACK_COLORS.blue;
    return (
        <Card className={`${c.border} shadow-sm rounded-2xl`}>
            <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
            </CardContent>
        </Card>
    );
}

function DeltaBadge({ delta }: { delta: number }) {
    if (delta > 0)
        return (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> +{delta.toFixed(1)}
            </span>
        );
    if (delta < 0)
        return (
            <span className="inline-flex items-center gap-1 text-red-500 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-full">
                <TrendingDown className="h-3 w-3" /> {delta.toFixed(1)}
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 text-gray-500 font-medium text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            <Minus className="h-3 w-3" /> 0
        </span>
    );
}
