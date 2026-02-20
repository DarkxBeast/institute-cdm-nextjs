"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";
import dynamic from "next/dynamic";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface PracticeInterviewAnalyticsProps {
    reports: AnalyticsReport[];
}

// ── Helpers ──

interface Section {
    title: string;
    rating: number;
}

interface SkillBreakdown {
    name: string;
    rating: number;
    percentage?: number;
}

interface SoftSkill {
    skill: string;
    score: number;
}

interface FeedbackSummary {
    strengths?: string;
    areas_for_improvement?: string;
    overall_impression?: string;
    red_flags?: string;
}

function parseMeta(data: Record<string, any>) {
    return data.meta && typeof data.meta === "object" ? data.meta : {};
}

function parseSections(data: Record<string, any>): Section[] {
    return Array.isArray(data.sections) ? data.sections : [];
}

function parseSkillBreakdown(data: Record<string, any>): SkillBreakdown[] {
    return Array.isArray(data.skill_breakdown) ? data.skill_breakdown : [];
}

function parseSoftSkills(data: Record<string, any>): SoftSkill[] {
    return Array.isArray(data.soft_skills) ? data.soft_skills : [];
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

// Accent colors per sub-type index
const ACCENT = [
    { stroke: "#10b981", fill: "#10b981", bg: "bg-emerald-50", text: "text-emerald-500" },
    { stroke: "#6366f1", fill: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-500" },
    { stroke: "#f59e0b", fill: "#f59e0b", bg: "bg-amber-50", text: "text-amber-500" },
];

// ── Component ──

export default function PracticeInterviewAnalytics({ reports }: PracticeInterviewAnalyticsProps) {
    if (reports.length === 0) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Practice Interview</h2>
                    <p className="text-xs text-gray-500">No reports yet</p>
                </div>
            </div>
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No Practice Interview reports</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Reports will appear here once a practice interview has been completed.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Group by journeyItemName (e.g., "Behavioral Mock Interview", "Technical Mock Interview")
    const grouped: Record<string, AnalyticsReport[]> = {};
    for (const r of reports) {
        const key = r.journeyItemName || "Practice Interview";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
    }

    const subTypes = Object.entries(grouped);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Practice Interview</h2>
                    <p className="text-xs text-gray-500">
                        {reports.length} report{reports.length > 1 ? "s" : ""} ·
                        {subTypes.length} type{subTypes.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Render each sub-type independently */}
            {subTypes.map(([name, subReports], idx) => {
                const accent = ACCENT[idx % ACCENT.length];
                const report = subReports[subReports.length - 1]; // latest
                const meta = parseMeta(report.reportData);
                const sections = parseSections(report.reportData);
                const skillBreakdown = parseSkillBreakdown(report.reportData);
                const softSkills = parseSoftSkills(report.reportData);
                const feedback = parseFeedback(report.reportData);

                const sectionData = sections.map((s) => ({
                    name: s.title,
                    rating: s.rating,
                    fill: ratingColor(s.rating),
                }));

                const radarData = skillBreakdown.map((s) => ({
                    subject: s.name.length > 18 ? s.name.slice(0, 16) + "…" : s.name,
                    fullName: s.name,
                    value: s.rating,
                }));

                const softSkillData = softSkills.map((s) => ({
                    name: s.skill,
                    score: s.score,
                    fill: ratingColor(s.score),
                }));

                const hasData = sectionData.length > 0 || radarData.length > 0 || softSkillData.length > 0 ||
                    feedback.strengths || feedback.areas_for_improvement || feedback.overall_impression || feedback.red_flags;

                return (
                    <Card key={name} className="border-gray-200 shadow-sm rounded-2xl">
                        <CardContent className="p-4 sm:p-5 space-y-5">
                            {/* Sub-type header */}
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 ${accent.bg} rounded-lg`}>
                                    <MessageSquare className={`h-4 w-4 ${accent.text}`} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                                    <p className="text-xs text-gray-500">{formatDate(report.createdAt)}</p>
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
                                /* Empty state: report exists but no analyzable data yet */
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    <div className="p-3.5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                                        <Clock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mb-1">Report data not yet available</p>
                                    <p className="text-[13px] text-slate-400 max-w-xs font-medium">
                                        This report has been created but detailed analytics haven&apos;t been generated yet.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Skill Radar */}
                                        {radarData.length >= 3 && (
                                            <div>
                                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Skill Breakdown</h4>
                                                <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-2">
                                                    <ResponsiveContainer width="100%" height={260}>
                                                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%" margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
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
                                                                stroke={accent.stroke}
                                                                fill={accent.fill}
                                                                fillOpacity={0.25}
                                                                strokeWidth={2.5}
                                                                animationDuration={1500}
                                                            />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}

                                        {/* Section Ratings */}
                                        {sectionData.length > 0 && (
                                            <div>
                                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Section Ratings</h4>
                                                <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                                                    <ResponsiveContainer width="100%" height={Math.max(220, sectionData.length * 45)}>
                                                        <BarChart data={sectionData} layout="vertical" barCategoryGap="25%" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
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
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Soft Skills */}
                                    {softSkillData.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">Soft Skills</h4>
                                            <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                                                <ResponsiveContainer width="100%" height={Math.max(180, softSkillData.length * 45)}>
                                                    <BarChart data={softSkillData} layout="vertical" barCategoryGap="25%" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
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
                                                            formatter={(v) => [`${v ?? 0}/5`, "Score"]}
                                                        />
                                                        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000}>
                                                            {softSkillData.map((entry, i) => (
                                                                <Cell key={i} fill={entry.fill} opacity={0.9} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback */}
                                    {(feedback.strengths || feedback.areas_for_improvement || feedback.overall_impression || feedback.red_flags) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            {feedback.strengths && (
                                                <FeedbackCard title="Strengths" content={feedback.strengths} color="emerald" />
                                            )}
                                            {feedback.areas_for_improvement && (
                                                <FeedbackCard title="Areas for Improvement" content={feedback.areas_for_improvement} color="amber" />
                                            )}
                                            {feedback.overall_impression && (
                                                <FeedbackCard title="Overall Impression" content={feedback.overall_impression} color="blue" />
                                            )}
                                            {feedback.red_flags && (
                                                <FeedbackCard title="Red Flags" content={feedback.red_flags} color="red" />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

// ── Sub-components ──

const FEEDBACK_COLORS: Record<string, { bg: string; border: string; title: string; text: string }> = {
    emerald: { bg: "bg-emerald-50/50", border: "border-emerald-100", title: "text-emerald-700", text: "text-emerald-800/80" },
    amber: { bg: "bg-amber-50/50", border: "border-amber-100", title: "text-amber-700", text: "text-amber-800/80" },
    blue: { bg: "bg-blue-50/50", border: "border-blue-100", title: "text-blue-700", text: "text-blue-800/80" },
    red: { bg: "bg-red-50/50", border: "border-red-100", title: "text-red-700", text: "text-red-800/80" },
};

function FeedbackCard({ title, content, color }: { title: string; content: string; color: string }) {
    const c = FEEDBACK_COLORS[color] ?? FEEDBACK_COLORS.blue;
    return (
        <div className={`border ${c.border} ${c.bg} rounded-xl p-4 transition-colors hover:bg-white`}>
            <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.title}`}>{title}</h4>
            <p className={`text-[13px] leading-relaxed font-medium ${c.text}`}>{content}</p>
        </div>
    );
}
