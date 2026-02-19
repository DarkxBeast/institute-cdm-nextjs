"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
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
                        <CardContent className="p-5 space-y-5">
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
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="p-3 bg-gray-50 rounded-full mb-3">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Report data not yet available</p>
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                        This report has been created but detailed analytics haven&apos;t been generated yet.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        {/* Skill Radar */}
                                        {radarData.length >= 3 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Skill Breakdown</h4>
                                                <ResponsiveContainer width="100%" height={240}>
                                                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                                                        <PolarGrid stroke="#e5e7eb" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#374151" }} />
                                                        <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} axisLine={false} />
                                                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                                                            formatter={(v) => [`${v ?? 0}/5`, "Rating"]} />
                                                        <Radar dataKey="value" stroke={accent.stroke} fill={accent.fill} fillOpacity={0.25} strokeWidth={2} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {/* Section Ratings */}
                                        {sectionData.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Section Ratings</h4>
                                                <ResponsiveContainer width="100%" height={Math.max(180, sectionData.length * 36)}>
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
                                            </div>
                                        )}
                                    </div>

                                    {/* Soft Skills */}
                                    {softSkillData.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Soft Skills</h4>
                                            <ResponsiveContainer width="100%" height={Math.max(140, softSkillData.length * 36)}>
                                                <BarChart data={softSkillData} layout="vertical" barCategoryGap="25%">
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                                    <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                                                        tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                                                    <YAxis type="category" dataKey="name" width={130}
                                                        tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} axisLine={false} />
                                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                                                        formatter={(v) => [`${v ?? 0}/5`, "Score"]} />
                                                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
                                                        {softSkillData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.fill} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    {/* Feedback */}
                                    {(feedback.strengths || feedback.areas_for_improvement || feedback.overall_impression || feedback.red_flags) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
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

const FEEDBACK_COLORS: Record<string, { border: string }> = {
    emerald: { border: "border-emerald-100" },
    amber: { border: "border-amber-100" },
    blue: { border: "border-blue-100" },
    red: { border: "border-red-100" },
};

function FeedbackCard({ title, content, color }: { title: string; content: string; color: string }) {
    const c = FEEDBACK_COLORS[color] ?? FEEDBACK_COLORS.blue;
    return (
        <div className={`border ${c.border} rounded-xl p-3`}>
            <h4 className="text-xs font-semibold text-gray-700 mb-1">{title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
        </div>
    );
}
