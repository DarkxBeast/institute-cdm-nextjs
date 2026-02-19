"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    FileText,
    Award,
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
    LineChart,
    Line,
    Cell,
} from "recharts";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface OverallPerformanceProps {
    reports: AnalyticsReport[];
}

// ── Helpers ──

function extractOverallRating(report: AnalyticsReport): number | null {
    const meta = report.reportData?.meta;
    if (meta && typeof meta === "object" && typeof meta.overall_rating === "number") {
        return meta.overall_rating;
    }
    return null;
}

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return dateStr;
    }
}

const REPORT_TYPE_LABELS: Record<string, string> = {
    "Diagnostic Interview": "Diagnostic Interview",
    "Resume Review": "Resume Review",
    "Practice Interview": "Practice Interview",
};

const REPORT_TYPE_COLORS: Record<string, string> = {
    "Diagnostic Interview": "#6366f1",
    "Resume Review": "#f97316",
    "Practice Interview": "#10b981",
};

// ── Component ──

export default function OverallPerformance({ reports }: OverallPerformanceProps) {
    if (reports.length === 0) return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Overall Performance
            </h2>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No reports available</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Performance metrics will appear here once reports have been generated.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Compute aggregate metrics
    const ratingsWithDates = reports
        .map((r) => ({ rating: extractOverallRating(r), date: r.createdAt, type: r.reportType }))
        .filter((r) => r.rating !== null) as { rating: number; date: string; type: string }[];

    const avgRating = ratingsWithDates.length > 0
        ? ratingsWithDates.reduce((s, r) => s + r.rating, 0) / ratingsWithDates.length
        : 0;

    const totalReports = reports.length;

    // Report type breakdown
    const typeCountMap: Record<string, number> = {};
    for (const r of reports) {
        const label = REPORT_TYPE_LABELS[r.reportType] ?? r.reportType;
        typeCountMap[label] = (typeCountMap[label] || 0) + 1;
    }
    const typeBreakdownData = Object.entries(typeCountMap).map(([name, count]) => ({
        name,
        count,
        fill: REPORT_TYPE_COLORS[name] ?? "#94a3b8",
    }));

    // Rating trend over time
    const ratingTrendData = ratingsWithDates
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((r, i) => ({
            index: i + 1,
            label: formatDate(r.date),
            rating: r.rating,
            type: REPORT_TYPE_LABELS[r.type] ?? r.type,
        }));

    // Best and latest rating
    const bestRating = ratingsWithDates.length > 0
        ? Math.max(...ratingsWithDates.map((r) => r.rating))
        : 0;

    const latestRating = ratingsWithDates.length > 0
        ? ratingsWithDates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].rating
        : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Overall Performance
            </h2>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={<FileText className="h-5 w-5 text-blue-500" />}
                    label="Total Reports"
                    value={totalReports.toString()}
                    bg="bg-blue-50"
                />
                <MetricCard
                    icon={<Award className="h-5 w-5 text-orange-500" />}
                    label="Avg. Rating"
                    value={avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—"}
                    bg="bg-orange-50"
                />
                <MetricCard
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    label="Best Rating"
                    value={bestRating > 0 ? `${bestRating.toFixed(1)}/5` : "—"}
                    bg="bg-emerald-50"
                />
                <MetricCard
                    icon={<BarChart3 className="h-5 w-5 text-violet-500" />}
                    label="Latest Rating"
                    value={latestRating > 0 ? `${latestRating.toFixed(1)}/5` : "—"}
                    bg="bg-violet-50"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Trend */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Rating Trend</h3>
                        {ratingTrendData.length > 1 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={ratingTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="label"
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
                                        formatter={(value) => [`${value ?? 0}/5`, "Rating"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rating"
                                        stroke="#f97316"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: "#f97316" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="p-3 bg-gray-50 rounded-full mb-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Not enough data for trend</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                    Rating trend will appear once at least two reports with ratings are available.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Report Type Breakdown */}
                <Card className="border-gray-200 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Report Breakdown</h3>
                        {typeBreakdownData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={typeBreakdownData} layout="vertical" barCategoryGap="30%">
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
                                        dataKey="name"
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
                                        {typeBreakdownData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="p-3 bg-gray-50 rounded-full mb-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">No report data</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                    Report breakdown will appear once reports are available.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ── Metric Card ──

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
