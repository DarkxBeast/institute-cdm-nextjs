"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ClipboardList,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowRightLeft,
    Clock,
} from "lucide-react";
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface DiagnosticInterviewAnalyticsProps {
    reports: AnalyticsReport[];
}

// ── Helpers ──

interface Meta {
    date?: string;
    mentee_name?: string;
    mentor_name?: string;
    overall_rating?: number;
    alignment_score?: number;
}

interface Section {
    title: string;
    rating: number;
    items?: { label: string; value: boolean; is_positive: boolean }[];
}

function parseMeta(data: Record<string, any>): Meta {
    return data.meta && typeof data.meta === "object" ? data.meta : {};
}

function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
        });
    } catch { return dateStr; }
}

function ratingColor(rating: number): string {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#f59e0b";
    if (rating >= 2) return "#f97316";
    return "#ef4444";
}

// ── Component ──

export default function DiagnosticInterviewAnalytics({ reports }: DiagnosticInterviewAnalyticsProps) {
    if (reports.length === 0) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Diagnostic Interview</h2>
                    <p className="text-xs text-gray-500">No reports yet</p>
                </div>
            </div>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No Diagnostic Interview reports</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Reports will appear here once a diagnostic interview has been completed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Sort by date ascending (oldest first)
    const sorted = [...reports].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const hasComparison = sorted.length >= 2;
    const latest = sorted[sorted.length - 1];
    const latestMeta = parseMeta(latest.reportData);
    const latestSections = parseSections(latest.reportData);

    // Section ratings for the latest report
    const sectionData = latestSections.map((s) => ({
        name: s.title,
        rating: s.rating,
        fill: ratingColor(s.rating),
    }));

    // Checklist completion rate
    const allItems = latestSections.flatMap((s) => s.items ?? []);
    const positiveItems = allItems.filter((item) => item.value && item.is_positive);
    const checklistRate = allItems.length > 0
        ? Math.round((positiveItems.length / allItems.length) * 100)
        : null;

    // Comparison data
    let comparisonData: {
        name: string;
        report1: number;
        report2: number;
        delta: number;
    }[] = [];
    let report1Label = "";
    let report2Label = "";

    if (hasComparison) {
        const r1 = sorted[0];
        const r2 = sorted[sorted.length - 1];
        const s1 = parseSections(r1.reportData);
        const s2 = parseSections(r2.reportData);

        report1Label = `DI #1 (${formatDate(r1.createdAt)})`;
        report2Label = `DI #${sorted.length} (${formatDate(r2.createdAt)})`;

        // Map by title
        const s1Map = new Map(s1.map((s) => [s.title, s.rating]));
        const allTitles = Array.from(new Set([...s1.map((s) => s.title), ...s2.map((s) => s.title)]));

        comparisonData = allTitles.map((title) => {
            const r1Rating = s1Map.get(title) ?? 0;
            const r2Rating = s2.find((s) => s.title === title)?.rating ?? 0;
            return {
                name: title,
                report1: r1Rating,
                report2: r2Rating,
                delta: r2Rating - r1Rating,
            };
        });
    }

    // Radar chart data for latest report
    const radarData = latestSections.map((s) => ({
        subject: s.title.length > 18 ? s.title.slice(0, 16) + "…" : s.title,
        fullName: s.title,
        value: s.rating,
    }));

    const hasData = sectionData.length > 0 || latestMeta.overall_rating != null || latestMeta.alignment_score != null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Diagnostic Interview</h2>
                    <p className="text-xs text-gray-500">
                        {reports.length} report{reports.length > 1 ? "s" : ""} ·
                        Latest: {formatDate(latest.createdAt)}
                    </p>
                </div>
                {latestMeta.overall_rating != null && (
                    <Badge
                        variant="outline"
                        className="ml-auto text-sm font-semibold px-3 py-1"
                        style={{ borderColor: ratingColor(latestMeta.overall_rating), color: ratingColor(latestMeta.overall_rating) }}
                    >
                        {latestMeta.overall_rating.toFixed(1)}/5
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
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Overall Rating" value={latestMeta.overall_rating ? `${latestMeta.overall_rating.toFixed(1)}/5` : "—"} />
                        <StatCard label="Alignment Score" value={latestMeta.alignment_score != null ? `${latestMeta.alignment_score}%` : "—"} />
                        <StatCard label="Sections" value={latestSections.length.toString()} />
                        {checklistRate !== null && (
                            <StatCard label="Checklist Completion" value={`${checklistRate}%`} />
                        )}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                        {/* Radar Chart */}
                        {radarData.length >= 3 && (
                            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                                <CardContent className="p-4 sm:p-6">
                                    <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between">
                                        Skills Radar — Latest
                                    </h3>
                                    <div className="relative">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%" margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                                <PolarAngleAxis
                                                    dataKey="subject"
                                                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
                                                    tickSize={12}
                                                />
                                                <PolarRadiusAxis
                                                    domain={[0, 5]}
                                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                                    axisLine={false}
                                                    tickCount={6}
                                                />
                                                <Tooltip
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
                                                <Radar
                                                    dataKey="value"
                                                    stroke="#6366f1"
                                                    fill="url(#di-radar-gradient)"
                                                    fillOpacity={0.6}
                                                    strokeWidth={2.5}
                                                    animationDuration={1500}
                                                />
                                                <defs>
                                                    <linearGradient id="di-radar-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2} />
                                                    </linearGradient>
                                                </defs>
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* ── DI Comparison ── */}
                    {hasComparison && comparisonData.length > 0 && (
                        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white mt-6">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-indigo-50/80 rounded-lg">
                                        <ArrowRightLeft className="h-4.5 w-4.5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {report1Label} <span className="text-slate-400 font-medium mx-1">vs</span> {report2Label}
                                    </h3>
                                </div>

                                {/* Comparison Bar Chart */}
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
                                                `${v ?? 0}/5`,
                                                name === "report1" ? report1Label : report2Label,
                                            ]}
                                        />
                                        <Bar dataKey="report1" fill="#c7d2fe" radius={[0, 4, 4, 0]} barSize={14} name="report1" animationDuration={1000} />
                                        <Bar dataKey="report2" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={14} name="report2" animationDuration={1000} />
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Delta Table */}
                                <div className="mt-8 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                                <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Section</th>
                                                <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">DI #1</th>
                                                <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">DI #{sorted.length}</th>
                                                <th className="text-center py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comparisonData.map((row, i) => (
                                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                                                    <td className="py-4 px-5 font-bold text-slate-900">{row.name}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-slate-600">{row.report1.toFixed(1)}</td>
                                                    <td className="text-center py-4 px-4 font-medium text-slate-600">{row.report2.toFixed(1)}</td>
                                                    <td className="text-center py-4 px-5">
                                                        <DeltaBadge delta={row.delta} />
                                                    </td>
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

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50/80 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-center border border-slate-100 transition-all hover:bg-slate-50">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
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
