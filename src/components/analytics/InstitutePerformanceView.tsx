"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Building2,
    Users,
    FileText,
    Award,
    Loader2,
    AlertCircle,
    Clock,
    BarChart3,
    CheckCircle2,
    MessageSquare,
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
    Legend,
} from "recharts";
import { getInstituteAnalytics } from "@/app/actions/batch-analytics";
import type { InstituteAnalyticsData } from "@/app/actions/batch-analytics";

// ── Colors ──

const BATCH_COLORS = [
    "#f97316", "#6366f1", "#10b981", "#ec4899", "#8b5cf6",
    "#14b8a6", "#f59e0b", "#ef4444", "#3b82f6", "#84cc16",
];

const REPORT_TYPE_COLORS: Record<string, string> = {
    "Diagnostic Interview": "#6366f1",
    "Resume Review": "#f97316",
    "Practice Interview": "#10b981",
};

// ── Component ──

export default function InstitutePerformanceView() {
    const [data, setData] = useState<InstituteAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const result = await getInstituteAnalytics();
                if (cancelled) return;
                if (result.data) setData(result.data);
                if (result.error) setError(result.error);
            } catch {
                if (!cancelled) setError("Failed to load institute analytics");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Loading
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-orange-400 animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading institute analytics…</p>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 text-sm mt-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
            </div>
        );
    }

    // Empty
    if (!data || data.totalBatches === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
                <div className="p-5 bg-orange-50 rounded-2xl mb-6 border border-orange-100">
                    <Building2 className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Institute Performance
                </h2>
                <p className="text-gray-500 text-sm max-w-md">
                    No batches found. Create a batch to start tracking institute performance.
                </p>
            </div>
        );
    }

    // ── Chart data ──

    // Batch comparison (avg rating per batch)
    const batchComparisonData = data.batches.map((b, i) => ({
        name: b.batchName.length > 18 ? b.batchName.slice(0, 18) + "…" : b.batchName,
        avgRating: Number(b.avgRating.toFixed(1)),
        students: b.studentCount,
        reports: b.reportCount,
        fill: BATCH_COLORS[i % BATCH_COLORS.length],
    }));

    // Report type distribution
    const reportTypeData = data.reportsByType.map((r) => ({
        ...r,
        fill: REPORT_TYPE_COLORS[r.type] ?? "#94a3b8",
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Institute Overview
            </h2>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                    label="Total Batches"
                    value={data.totalBatches.toString()}
                    bg="bg-blue-50"
                />
                <MetricCard
                    icon={<Users className="h-5 w-5 text-violet-500" />}
                    label="Total Students"
                    value={data.totalStudents.toString()}
                    bg="bg-violet-50"
                />
                <MetricCard
                    icon={<FileText className="h-5 w-5 text-emerald-500" />}
                    label="Total Reports"
                    value={data.totalReports.toString()}
                    bg="bg-emerald-50"
                />
                <MetricCard
                    icon={<Award className="h-5 w-5 text-orange-500" />}
                    label="Overall Avg. Rating"
                    value={data.overallAvgRating > 0 ? `${data.overallAvgRating.toFixed(1)}/5` : "—"}
                    bg="bg-orange-50"
                />
                <MetricCard
                    icon={<CheckCircle2 className="h-5 w-5 text-teal-500" />}
                    label="Attendance Rate"
                    value={`${Math.round(data.overallAttendanceRate)}%`}
                    bg="bg-teal-50"
                />
                <MetricCard
                    icon={<MessageSquare className="h-5 w-5 text-pink-500" />}
                    label="Feedback Rate"
                    value={`${Math.round(data.overallFeedbackRate)}%`}
                    bg="bg-pink-50"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Batch Comparison */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Avg. Rating by Batch
                        </h3>
                        {batchComparisonData.some((d) => d.avgRating > 0) ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={batchComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        ticks={[0, 1, 2, 3, 4, 5]}
                                        tick={{ fontSize: 11, fill: "#6b7280" }}
                                        tickLine={false}
                                        axisLine={{ stroke: "#e5e7eb" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value) => [`${value ?? 0}/5`, "Avg Rating"]}
                                    />
                                    <Bar dataKey="avgRating" radius={[6, 6, 0, 0]} barSize={40}>
                                        {batchComparisonData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChartPlaceholder message="No ratings data yet" />
                        )}
                    </CardContent>
                </Card>

                {/* Report Type Distribution */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Reports by Type
                        </h3>
                        {reportTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={reportTypeData} layout="vertical" barCategoryGap="30%">
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
                                        {reportTypeData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
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

            {/* ── Batch Table ── */}
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Batch Details
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Batch
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Students
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Reports
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Avg. Rating
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Completion
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Attendance %
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Feedback %
                                    </th>
                                    <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.batches.map((batch) => (
                                    <tr
                                        key={batch.batchId}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-3 px-3 font-medium text-gray-900">
                                            {batch.batchName}
                                        </td>
                                        <td className="py-3 px-3 text-center text-gray-600">
                                            {batch.studentCount}
                                        </td>
                                        <td className="py-3 px-3 text-center text-gray-600">
                                            {batch.reportCount}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className={`font-semibold ${batch.avgRating > 0 ? "text-orange-600" : "text-gray-400"}`}>
                                                {batch.avgRating > 0 ? `${batch.avgRating.toFixed(1)}/5` : "—"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-400 rounded-full transition-all"
                                                        style={{ width: `${Math.min(batch.completionRate, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {Math.round(batch.completionRate)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className={`text-sm font-medium ${batch.attendanceRate > 0 ? 'text-teal-600' : 'text-gray-400'}`}>
                                                {Math.round(batch.attendanceRate)}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className={`text-sm font-medium ${batch.feedbackRate > 0 ? 'text-pink-600' : 'text-gray-400'}`}>
                                                {Math.round(batch.feedbackRate)}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <StatusBadge status={batch.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Subcomponents ──

function MetricCard({
    icon,
    label,
    value,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    bg: string;
}) {
    return (
        <Card className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colorMap: Record<string, string> = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Completed: "bg-blue-50 text-blue-700 border-blue-200",
        Tentative: "bg-amber-50 text-amber-700 border-amber-200",
    };

    const classes = colorMap[status] ?? "bg-gray-50 text-gray-600 border-gray-200";

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${classes}`}>
            {status}
        </span>
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
