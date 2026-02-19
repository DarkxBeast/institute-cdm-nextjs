"use client";

import { Card, CardContent } from "@/components/ui/card";
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                <MetricCard
                    icon={<Award className="h-5 w-5 text-orange-500" />}
                    label="Avg. Rating"
                    value={avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—"}
                    bg="bg-orange-50"
                />
                <MetricCard
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    label="Completion"
                    value={`${completionRate}%`}
                    subtitle={`${studentsWithReports}/${totalStudents} students`}
                    bg="bg-emerald-50"
                />
                <MetricCard
                    icon={<CheckCircle2 className="h-5 w-5 text-teal-500" />}
                    label="Attendance Rate"
                    value={`${Math.round(attendanceRate)}%`}
                    subtitle={`${sessionStats.completedSessions}/${sessionStats.totalSessions} sessions`}
                    bg="bg-teal-50"
                />
                <MetricCard
                    icon={<MessageSquare className="h-5 w-5 text-pink-500" />}
                    label="Feedback Rate"
                    value={`${Math.round(feedbackRate)}%`}
                    bg="bg-pink-50"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Rating Distribution */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                        {ratingDistribution.some((d) => d.count > 0) ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={ratingDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="range"
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value) => [`${value} students`, "Count"]}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36} fill={RATING_BAR_COLOR}>
                                        {ratingDistribution.map((_, i) => (
                                            <Cell key={i} fill={RATING_BAR_COLOR} opacity={0.7 + i * 0.075} />
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
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Reports by Type</h3>
                        {reportsByType.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={reportsByType} layout="vertical" barCategoryGap="30%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                        allowDecimals={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="type"
                                        tick={{ fontSize: 11, fill: "#374151" }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={140}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                                        {reportsByType.map((entry, i) => (
                                            <Cell key={i} fill={REPORT_TYPE_COLORS[entry.type] ?? "#94a3b8"} />
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
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            Journey Progress
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all"
                                    style={{ width: `${journeyProgress.total > 0 ? Math.round((journeyProgress.completed / journeyProgress.total) * 100) : 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {journeyProgress.completed}/{journeyProgress.total} items
                            </span>
                        </div>

                        {/* Journey Items Table */}
                        {journeyItems.length > 0 && (
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                                            <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
                                            <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {journeyItems.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-2.5 px-2 font-medium text-gray-900">{item.name}</td>
                                                <td className="py-2.5 px-2 text-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-gray-50 text-gray-600 border-gray-200'
                                                        }`}>{item.status}</span>
                                                </td>
                                                <td className="py-2.5 px-2 text-center text-gray-600">
                                                    {item.sessionsCompleted}/{item.totalSessions}
                                                </td>
                                                <td className="py-2.5 px-2 text-center">
                                                    <span className={`font-semibold ${item.avgRating > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                                        {item.avgRating > 0 ? `${item.avgRating.toFixed(1)}/5` : '—'}
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
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            Top Performers
                        </h3>
                        <div className="space-y-2">
                            {topPerformers.map((p, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500" :
                                            i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                                                i === 2 ? "bg-gradient-to-br from-orange-300 to-orange-400" :
                                                    "bg-gradient-to-br from-gray-200 to-gray-300"
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-500">{p.reportCount} reports</span>
                                        <span className="text-sm font-semibold text-orange-600">
                                            {p.avgRating.toFixed(1)}/5
                                        </span>
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
        <Card className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-[11px] text-gray-400">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyChartPlaceholder({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-3 bg-gray-50 rounded-full mb-3">
                <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">{message}</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Data will appear once reports are generated.
            </p>
        </div>
    );
}
