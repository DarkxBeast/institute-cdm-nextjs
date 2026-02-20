"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CircularProgressCard from "./CircularProgressCard";
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
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";
import { getInstituteAnalytics } from "@/app/actions/batch-analytics";
import type { InstituteAnalyticsData } from "@/app/actions/batch-analytics";

import { InstituteSkeleton } from "./AnalyticsSkeletons";

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
        return <InstituteSkeleton />;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <CircularProgressCard
                    percentage={data.overallAvgRating > 0 ? (data.overallAvgRating / 5) * 100 : 0}
                    centerLabel={data.overallAvgRating > 0 ? `${data.overallAvgRating.toFixed(1)}/5` : "—"}
                    label="Overall Avg. Rating"
                    color="#f97316"
                    icon={<Award className="h-4 w-4 text-orange-500" />}
                    iconBg="bg-orange-50"
                />
                <CircularProgressCard
                    percentage={Math.round(data.overallAttendanceRate)}
                    centerLabel={`${Math.round(data.overallAttendanceRate)}%`}
                    label="Attendance Rate"
                    color="#14b8a6"
                    icon={<CheckCircle2 className="h-4 w-4 text-teal-500" />}
                    iconBg="bg-teal-50"
                />
                <CircularProgressCard
                    percentage={Math.round(data.overallFeedbackRate)}
                    centerLabel={`${Math.round(data.overallFeedbackRate)}%`}
                    label="Feedback Rate"
                    color="#ec4899"
                    icon={<MessageSquare className="h-4 w-4 text-pink-500" />}
                    iconBg="bg-pink-50"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Batch Comparison */}
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6">
                            Avg. Rating by Batch
                        </h3>
                        {batchComparisonData.some((d) => d.avgRating > 0) ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={batchComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        ticks={[0, 1, 2, 3, 4, 5]}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
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
                                        formatter={(value) => [`${value ?? 0}/5`, "Avg Rating"]}
                                    />
                                    <Bar dataKey="avgRating" radius={[6, 6, 0, 0]} barSize={48} animationDuration={1000}>
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
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6">
                            Reports by Type
                        </h3>
                        {reportTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={reportTypeData} layout="vertical" barCategoryGap="25%" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        dx={-10}
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
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                        <h3 className="text-base font-bold text-slate-900">
                            Batch Details
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Batch
                                    </th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Students
                                    </th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Reports
                                    </th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Avg. Rating
                                    </th>

                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Attendance %
                                    </th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Feedback %
                                    </th>
                                    <th className="text-center py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.batches.map((batch) => (
                                    <tr
                                        key={batch.batchId}
                                        className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="py-4 px-6 font-semibold text-slate-900 w-1/4">
                                            {batch.batchName}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-slate-600">
                                            {batch.studentCount}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-slate-600">
                                            {batch.reportCount}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`font-bold ${batch.avgRating > 0 ? "text-orange-600" : "text-slate-400"}`}>
                                                {batch.avgRating > 0 ? `${batch.avgRating.toFixed(1)}/5` : "—"}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <span className={`text-sm font-bold ${batch.attendanceRate > 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                                                {Math.round(batch.attendanceRate)}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`text-sm font-bold ${batch.feedbackRate > 0 ? 'text-pink-600' : 'text-slate-400'}`}>
                                                {Math.round(batch.feedbackRate)}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
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
        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colorMap: Record<string, string> = {
        Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
        Completed: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20",
        Tentative: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    };

    const classes = colorMap[status] ?? "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20";

    return (
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${classes}`}>
            {status}
        </span>
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
