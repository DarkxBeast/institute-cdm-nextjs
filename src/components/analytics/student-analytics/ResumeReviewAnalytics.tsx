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
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
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
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <div className="p-3.5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                                <Clock className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-600 mb-1">Report data not yet available</p>
                            <p className="text-[13px] text-slate-400 max-w-xs font-medium">
                                This report has been created but detailed analytics haven&apos;t been generated yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Section Ratings */}
                    {sectionData.length > 0 && (
                        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                            <CardContent className="p-4 sm:p-6">
                                <h3 className="text-base font-bold text-slate-900 mb-6">Section Ratings — Latest</h3>
                                <ResponsiveContainer width="100%" height={Math.max(220, sectionData.length * 45)}>
                                    <BarChart data={sectionData} layout="vertical" barCategoryGap="25%" margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                                        <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                                            tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis type="category" dataKey="name" width={150}
                                            tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: "#f8fafc" }}
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "1px solid #f1f5f9",
                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                backdropFilter: "blur(8px)",
                                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                color: "#0f172a",
                                            }}
                                            formatter={(v) => [`${v ?? 0}/5`, "Rating"]}
                                        />
                                        <Bar dataKey="rating" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000}>
                                            {sectionData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} opacity={0.9} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Feedback Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
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
                        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white mt-6">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-orange-50/80 rounded-lg">
                                        <ArrowRightLeft className="h-4.5 w-4.5 text-orange-600" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {r1Label} <span className="text-slate-400 font-medium mx-1">vs</span> {r2Label}
                                    </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={Math.max(240, comparisonData.length * 50)}>
                                    <BarChart data={comparisonData} layout="vertical" barCategoryGap="25%" margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                                        <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                                            tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis type="category" dataKey="name" width={140}
                                            tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: "#f8fafc" }}
                                            contentStyle={{
                                                borderRadius: "12px",
                                                border: "1px solid #f1f5f9",
                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                backdropFilter: "blur(8px)",
                                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                color: "#0f172a",
                                            }}
                                            formatter={(v, name) => [
                                                `${v ?? 0}/5`, name === "report1" ? r1Label : r2Label,
                                            ]}
                                        />
                                        <Bar dataKey="report1" fill="#fed7aa" radius={[0, 4, 4, 0]} barSize={14} name="report1" animationDuration={1000} />
                                        <Bar dataKey="report2" fill="#f97316" radius={[0, 4, 4, 0]} barSize={14} name="report2" animationDuration={1000} />
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Delta Table */}
                                <div className="mt-8 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Section</th>
                                                <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">RR #1</th>
                                                <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">RR #{sorted.length}</th>
                                                <th className="text-center py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map((row, i) => (
                                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                                                    <td className="py-4 px-5 font-bold text-slate-900">{row.name}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-slate-600">{row.report1.toFixed(1)}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-slate-600">{row.report2.toFixed(1)}</td>
                                                    <td className="text-center py-4 px-5"><DeltaBadge delta={row.delta} /></td>
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

const FEEDBACK_COLORS: Record<string, { bg: string; border: string; title: string; text: string }> = {
    emerald: { bg: "bg-emerald-50/50", border: "border-emerald-100", title: "text-emerald-700", text: "text-emerald-800/80" },
    amber: { bg: "bg-amber-50/50", border: "border-amber-100", title: "text-amber-700", text: "text-amber-800/80" },
    blue: { bg: "bg-blue-50/50", border: "border-blue-100", title: "text-blue-700", text: "text-blue-800/80" },
    violet: { bg: "bg-violet-50/50", border: "border-violet-100", title: "text-violet-700", text: "text-violet-800/80" },
};

function FeedbackCard({ title, content, color }: { title: string; content: string; color: string }) {
    const c = FEEDBACK_COLORS[color] ?? FEEDBACK_COLORS.blue;
    return (
        <Card className={`${c.border} ${c.bg} shadow-sm rounded-2xl transition-colors hover:bg-white`}>
            <CardContent className="p-5">
                <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.title}`}>{title}</h4>
                <p className={`text-[13px] leading-relaxed font-medium ${c.text}`}>{content}</p>
            </CardContent>
        </Card>
    );
}

function DeltaBadge({ delta }: { delta: number }) {
    if (delta > 0)
        return (
            <span className="inline-flex items-center justify-center gap-1 text-emerald-700 font-bold text-[11px] uppercase tracking-wide bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-600/20 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5" /> +{delta.toFixed(1)}
            </span>
        );
    if (delta < 0)
        return (
            <span className="inline-flex items-center justify-center gap-1 text-red-700 font-bold text-[11px] uppercase tracking-wide bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-600/20 shadow-sm">
                <TrendingDown className="h-3.5 w-3.5" /> {delta.toFixed(1)}
            </span>
        );
    return (
        <span className="inline-flex items-center justify-center gap-1 text-slate-500 font-bold text-[11px] uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-full ring-1 ring-slate-200 shadow-sm">
            <Minus className="h-3.5 w-3.5" /> 0
        </span>
    );
}
