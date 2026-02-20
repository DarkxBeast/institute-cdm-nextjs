"use client";

import { Card, CardContent } from "@/components/ui/card";
import CircularProgressCard from "../CircularProgressCard";
import {
    Users,
    FileText,
    Award,
    TrendingUp,
    BarChart3,
    Clock,
    Trophy,
    CheckCircle2,
    MessageSquare,
    BookOpen,
} from "lucide-react";
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import type { BatchAnalyticsData } from "@/app/actions/batch-analytics";

interface BatchOverviewProps {
    data: BatchAnalyticsData;
    batchName: string;
}

const REPORT_TYPE_COLORS: Record<string, string> = {
    "Diagnostic Interview": "#6366f1",
    "Resume Review": "#f97316",
    "Practice Interview": "#10b981",
};

const RATING_BAR_COLOR = "#f97316";

// ── Component ──

export default function BatchOverview({ data, batchName }: BatchOverviewProps) {
    const {
        totalStudents,
        studentsWithReports,
        totalReports,
        avgRating,
        reportsByType,
        ratingDistribution,
        topPerformers,
        attendanceRate,
        feedbackRate,
        journeyProgress,
        sessionStats,
        journeyItems,
    } = data;

    const completionRate =
        totalStudents > 0
            ? Math.round((studentsWithReports / totalStudents) * 100)
            : 0;

    // Empty state
    if (totalStudents === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Batch Overview
                    <span className="text-sm font-normal text-gray-500">— {batchName}</span>
                </h2>
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-3 bg-gray-50 rounded-full mb-3">
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">No students in this batch</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                Add students to start tracking performance.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Batch Overview
                <span className="text-sm font-normal text-gray-500">— {batchName}</span>
            </h2>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    icon={<Users className="h-5 w-5 text-blue-500" />}
                    label="Total Students"
                    value={totalStudents.toString()}
                    bg="bg-blue-50"
                />
                <MetricCard
                    icon={<FileText className="h-5 w-5 text-violet-500" />}
                    label="Total Reports"
                    value={totalReports.toString()}
                    bg="bg-violet-50"
                />
                <CircularProgressCard
                    percentage={avgRating > 0 ? (avgRating / 5) * 100 : 0}
                    centerLabel={avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—"}
                    label="Avg. Rating"
                    color="#f97316"
                    icon={<Award className="h-4 w-4 text-orange-500" />}
                    iconBg="bg-orange-50"
                />
                <CircularProgressCard
                    percentage={completionRate}
                    centerLabel={`${completionRate}%`}
                    label="Completion"
                    subtitle={`${studentsWithReports}/${totalStudents} students`}
                    color="#10b981"
                    icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    iconBg="bg-emerald-50"
                />
                <CircularProgressCard
                    percentage={Math.round(attendanceRate)}
                    centerLabel={`${Math.round(attendanceRate)}%`}
                    label="Attendance Rate"
                    subtitle={`${sessionStats.completedSessions}/${sessionStats.totalSessions} sessions`}
                    color="#14b8a6"
                    icon={<CheckCircle2 className="h-4 w-4 text-teal-500" />}
                    iconBg="bg-teal-50"
                />
                <CircularProgressCard
                    percentage={Math.round(feedbackRate)}
                    centerLabel={`${Math.round(feedbackRate)}%`}
                    label="Feedback Rate"
                    color="#ec4899"
                    icon={<MessageSquare className="h-4 w-4 text-pink-500" />}
                    iconBg="bg-pink-50"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Rating Distribution */}
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6">Rating Distribution</h3>
                        {ratingDistribution.some((d) => d.count > 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={ratingDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="range"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        dx={-10}
                                    />
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
                                        formatter={(value) => [`${value} students`, "Count"]}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40} fill={RATING_BAR_COLOR} animationDuration={1000}>
                                        {ratingDistribution.map((_, i) => (
                                            <Cell key={i} fill={RATING_BAR_COLOR} opacity={0.75 + i * 0.05} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartPlaceholder message="No rating data yet" />
                        )}
                    </CardContent>
                </Card>

                {/* Reports by Type */}
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6">Reports by Type</h3>
                        {reportsByType.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={reportsByType} layout="vertical" barCategoryGap="25%" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="type"
                                        tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={110}
                                    />
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
                                    />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1000}>
                                        {reportsByType.map((entry, i) => (
                                            <Cell key={i} fill={REPORT_TYPE_COLORS[entry.type] ?? "#94a3b8"} opacity={0.9} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartPlaceholder message="No reports generated yet" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Journey Progress ── */}
            {journeyProgress.total > 0 && (
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-50/80 rounded-lg">
                                    <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                                </div>
                                Journey Progress
                            </h3>
                            <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                {journeyProgress.completed} / {journeyProgress.total} items
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000 relative overflow-hidden"
                                    style={{ width: `${journeyProgress.total > 0 ? Math.round((journeyProgress.completed / journeyProgress.total) * 100) : 0}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Journey Items Table */}
                        {journeyItems.length > 0 && (
                            <div className="mt-8 overflow-x-auto rounded-xl border border-slate-100">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Item</th>
                                            <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sessions</th>
                                            <th className="text-center py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {journeyItems.map((item, idx) => (
                                            <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors last:border-0">
                                                <td className="py-4 px-5 font-semibold text-slate-900 max-w-[300px] truncate" title={item.name}>{item.name}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' :
                                                        item.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20' :
                                                            'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20'
                                                        }`}>{item.status}</span>
                                                </td>
                                                <td className="py-4 px-4 text-center font-medium text-slate-600">
                                                    {item.sessionsCompleted} <span className="text-slate-400">/</span> {item.totalSessions}
                                                </td>
                                                <td className="py-4 px-5 text-center">
                                                    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${item.avgRating > 0 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' : 'bg-slate-50 text-slate-400 ring-1 ring-slate-200'}`}>
                                                        {item.avgRating > 0 ? `${item.avgRating.toFixed(1)} / 5` : '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── Top Performers ── */}
            {topPerformers.length > 0 && (
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2.5">
                            <div className="p-2 bg-amber-50/80 rounded-lg">
                                <Trophy className="h-4.5 w-4.5 text-amber-500" />
                            </div>
                            Top Performers
                        </h3>
                        <div className="space-y-3">
                            {topPerformers.map((p, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold tracking-wider shadow-sm shrink-0 ${i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500 ring-4 ring-amber-50" :
                                            i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 ring-4 ring-slate-50" :
                                                i === 2 ? "bg-gradient-to-br from-orange-300 to-orange-400 ring-4 ring-orange-50" :
                                                    "bg-slate-100 text-slate-500 font-semibold border border-slate-200"
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 block">{p.name}</span>
                                            <span className="text-xs text-slate-500 font-medium">{p.reportCount} report{p.reportCount !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Rating</span>
                                            <span className="text-base font-bold text-orange-600">
                                                {p.avgRating.toFixed(1)} <span className="text-xs text-orange-400/70 font-medium">/5</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// ── Subcomponents ──

function MetricCard({
    icon,
    label,
    value,
    subtitle,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle?: string;
    bg: string;
}) {
    return (
        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyChartPlaceholder({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="p-3.5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">{message}</p>
            <p className="text-[13px] text-slate-400 max-w-xs font-medium">
                Data will appear once reports are generated.
            </p>
        </div>
    );
}
