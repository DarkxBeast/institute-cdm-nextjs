"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CircularProgressCard from "./CircularProgressCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    MessageSquare,
    Star,
    Calendar,
    Loader2,
    AlertCircle,
    ClipboardCheck,
    FileText,
    Mic,
    BookOpen,
    TrendingUp,
    ThumbsUp,
} from "lucide-react";
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { getBatchesForUser } from "@/app/actions/batches";
import { getTccAnalytics } from "@/app/actions/tcc-analytics";
import type { TccAnalyticsData } from "@/app/actions/tcc-analytics";
import StudentFeedbacksSection from "./StudentFeedbacksSection";

import { TccSkeleton } from "./AnalyticsSkeletons";

// ── Component ──

export default function TccPerformanceView() {
    const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>("all");
    const [data, setData] = useState<TccAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch batches
    useEffect(() => {
        async function loadBatches() {
            const result = await getBatchesForUser();
            if (result.data) {
                setBatches(result.data.map((b: any) => ({ id: b.id, name: b.title })));
            }
        }
        loadBatches();
    }, []);

    // Fetch analytics when batch changes
    useEffect(() => {
        async function loadAnalytics() {
            setLoading(true);
            setError(null);
            const batchId = selectedBatch === "all" ? undefined : selectedBatch;
            const result = await getTccAnalytics(batchId);
            if (result.error) {
                setError(result.error);
            } else {
                setData(result.data);
            }
            setLoading(false);
        }
        loadAnalytics();
    }, [selectedBatch]);

    if (loading) {
        return <TccSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (!data || data.totalFeedbacks === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
                <div className="p-5 bg-orange-50 rounded-2xl mb-6 border border-orange-100">
                    <MessageSquare className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Data</h2>
                <p className="text-gray-500 text-sm max-w-md">
                    No student feedback has been collected yet. Feedback analytics will appear here once students submit feedback.
                </p>
            </div>
        );
    }

    // Workshop bar chart data
    const workshopBarData = data.sectoralWorkshop.byWorkshop.map((ws) => ({
        name: ws.name,
        fullName: ws.name,
        Delivery: ws.avgDelivery,
        Helpfulness: ws.avgHelpfulness,
    }));


    return (
        <div className="flex flex-col gap-6">
            {/* Batch Selector */}
            <div className="flex justify-center">
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white w-full sm:w-auto">
                    <CardContent className="p-2 sm:p-3">
                        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                            <SelectTrigger className="w-full sm:w-[320px] text-sm bg-slate-50 border-slate-200 focus:ring-orange-500 font-medium h-10">
                                <SelectValue placeholder="All Batches" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
                    label="Total Feedbacks"
                    value={data.totalFeedbacks.toString()}
                    bg="bg-blue-50"
                />
                <MetricCard
                    icon={<Calendar className="h-5 w-5 text-green-500" />}
                    label="Total Sessions"
                    value={data.totalSessions.toString()}
                    bg="bg-green-50"
                />
                <MetricCard
                    icon={<Users className="h-5 w-5 text-purple-500" />}
                    label="Total Mentors"
                    value={data.totalMentors.toString()}
                    bg="bg-purple-50"
                />
                <CircularProgressCard
                    percentage={data.overallAvgRating > 0 ? (data.overallAvgRating / 5) * 100 : 0}
                    centerLabel={data.overallAvgRating > 0 ? `${data.overallAvgRating}/5` : "—"}
                    label="Overall Avg Rating"
                    color="#f97316"
                    icon={<Star className="h-4 w-4 text-orange-500" />}
                    iconBg="bg-orange-50"
                />
            </div>

            {/* ── Per-Type Feedback Sections ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Diagnostic Interview */}
                {data.diagnosticInterview.count > 0 && (
                    <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-50/80 rounded-xl">
                                        <Mic className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Diagnostic Interview</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                        {data.diagnosticInterview.count} Feedbacks
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.diagnosticInterview.avgExperience > 0 && <MiniCircularStat label="Avg Experience" value={data.diagnosticInterview.avgExperience} max={5} color="#6366f1" />}
                                {data.diagnosticInterview.avgClarity > 0 && <MiniCircularStat label="Avg Clarity" value={data.diagnosticInterview.avgClarity} max={5} color="#3b82f6" />}
                                {data.diagnosticInterview.avgHelpfulness > 0 && <MiniCircularStat label="Avg Helpfulness" value={data.diagnosticInterview.avgHelpfulness} max={5} color="#10b981" />}
                                {data.diagnosticInterview.avgConfidence > 0 && <MiniCircularStat label="Avg Confidence" value={data.diagnosticInterview.avgConfidence} max={5} color="#f59e0b" />}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Resume Review */}
                {data.resumeReview.count > 0 && (
                    <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-orange-50/80 rounded-xl">
                                        <FileText className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Resume Review</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                        {data.resumeReview.count} Feedbacks
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.resumeReview.avgExperience > 0 && <MiniCircularStat label="Avg Experience" value={data.resumeReview.avgExperience} max={5} color="#f59e0b" />}
                                {data.resumeReview.avgConfidence > 0 && <MiniCircularStat label="Avg Confidence" value={data.resumeReview.avgConfidence} max={5} color="#10b981" />}
                                {data.resumeReview.clarityYesPercent > 0 && <MiniCircularStat label="Clarity (Yes)" value={data.resumeReview.clarityYesPercent} max={100} color="#3b82f6" suffix="%" />}
                                {data.resumeReview.preparednessYesPercent > 0 && <MiniCircularStat label="Preparedness (Yes)" value={data.resumeReview.preparednessYesPercent} max={100} color="#8b5cf6" suffix="%" />}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Masterclass */}
                {data.masterclass.count > 0 && (
                    <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-50/80 rounded-xl">
                                        <BookOpen className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Masterclass</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                        {data.masterclass.count} Feedbacks
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.masterclass.avgContentQuality > 0 && <MiniCircularStat label="Content Quality" value={data.masterclass.avgContentQuality} max={5} color="#f59e0b" />}
                                {data.masterclass.avgRelevance > 0 && <MiniCircularStat label="Relevance" value={data.masterclass.avgRelevance} max={5} color="#10b981" />}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Sectoral Workshop - overview stats */}
                {data.sectoralWorkshop.count > 0 && (
                    <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-sky-50/80 rounded-xl">
                                        <ClipboardCheck className="h-5 w-5 text-sky-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Sectoral Workshops</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                        {data.sectoralWorkshop.count} Feedbacks
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.sectoralWorkshop.avgDelivery > 0 && <MiniCircularStat label="Avg Delivery" value={data.sectoralWorkshop.avgDelivery} max={5} color="#f59e0b" />}
                                {data.sectoralWorkshop.avgHelpfulness > 0 && <MiniCircularStat label="Avg Helpfulness" value={data.sectoralWorkshop.avgHelpfulness} max={5} color="#3b82f6" />}
                                {data.sectoralWorkshop.clarityYesPercent > 0 && <MiniCircularStat label="Clarity (Yes)" value={data.sectoralWorkshop.clarityYesPercent} max={100} color="#10b981" suffix="%" />}
                                {data.sectoralWorkshop.interestYesPercent > 0 && <MiniCircularStat label="Interest (Yes)" value={data.sectoralWorkshop.interestYesPercent} max={100} color="#8b5cf6" suffix="%" />}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ── Workshop Breakdown Chart ── */}
            {workshopBarData.length > 0 && (
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                    <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                        <h3 className="text-base font-bold text-slate-900 mb-6">Workshop-wise Ratings</h3>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={workshopBarData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        domain={[0, 5]}
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={0}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={140}
                                        tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-5}
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
                                        formatter={((value: any, name: any) => [`${value ?? 0}/5`, name]) as any}
                                        labelFormatter={((label: any, payload: any) => payload?.[0]?.payload?.fullName ?? label) as any}
                                        allowEscapeViewBox={{ x: false, y: true }}
                                        wrapperStyle={{ zIndex: 10 }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 13, fontWeight: 500, paddingTop: "10px" }} iconType="circle" />
                                    <Bar dataKey="Delivery" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000} />
                                    <Bar dataKey="Helpfulness" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Mentor Performance Table ── */}
            {data.mentorPerformance.length > 0 && (
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-0">
                        <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                            <h3 className="text-base font-bold text-slate-900">
                                Mentor Performance
                            </h3>
                        </div>
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="text-left py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mentor</th>
                                        <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sessions</th>
                                        <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Feedbacks</th>
                                        <th className="text-center py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.mentorPerformance.map((m) => (
                                        <tr key={m.mentorId} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-slate-900">{m.mentorName}</td>
                                            <td className="py-4 px-4 text-center font-medium text-slate-600">{m.sessionCount}</td>
                                            <td className="py-4 px-4 text-center font-medium text-slate-600">{m.feedbackCount}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${m.avgRating >= 4
                                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                                        : m.avgRating >= 3
                                                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                                                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
                                                        }`}
                                                >
                                                    <Star className="w-3.5 h-3.5" />
                                                    {m.avgRating > 0 ? m.avgRating.toFixed(1) : "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Student Feedbacks Section ── */}
            <StudentFeedbacksSection batches={batches} selectedBatchId={selectedBatch} />
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
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function MiniCircularStat({
    label,
    value,
    max,
    color,
    suffix,
}: {
    label: string;
    value: number;
    max: number;
    color: string;
    suffix?: string;
}) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const size = 48;
    const strokeW = 5;
    const r = (size - strokeW) / 2;
    const circ = 2 * Math.PI * r;
    const off = circ - (circ * pct) / 100;
    const displayValue = suffix ? `${value}${suffix}` : `${value}/${max}`;

    return (
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 border border-slate-100/50 rounded-xl hover:bg-white transition-colors hover:shadow-sm">
            <div className="relative shrink-0 flex items-center justify-center filter drop-shadow-sm" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeW} opacity={0.15} />
                    <circle
                        cx={size / 2} cy={size / 2} r={r} fill="none"
                        stroke={color} strokeWidth={strokeW}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={off}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-slate-900 tracking-tighter" style={{ fontSize: 11 }}>
                        {Math.round(pct)}%
                    </span>
                </div>
            </div>
            <div className="min-w-0 pr-1 flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider leading-tight truncate">{label}</p>
                <p className="text-[15px] font-bold text-slate-900 mt-0.5">{displayValue}</p>
            </div>
        </div>
    );
}
