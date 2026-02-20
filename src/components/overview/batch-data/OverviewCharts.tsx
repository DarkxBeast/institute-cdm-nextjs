"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { PieLabelRenderProps } from "recharts";
import type { LearningJourneyViewData } from "@/app/actions/learning-journey";

import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
interface OverviewChartsProps {
    data: LearningJourneyViewData;
}

// ─── Palette ────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
    completed: "#10b981",   // emerald-500
    "in-progress": "#f59e0b", // amber-500
    upcoming: "#3b82f6",     // blue-500
    "yet-to-schedule": "#9ca3af", // gray-400
};

const CATEGORY_COLORS = [
    "#ff9e44", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#06b6d4", "#ec4899",
];

const DELIVERY_COLORS: Record<string, string> = {
    online: "#6366f1",   // indigo-500
    offline: "#f97316",  // orange-500
    hybrid: "#14b8a6",   // teal-500
};

const RADIAN = Math.PI / 180;


// ─── Shared card wrapper ────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="flex-1 min-h-0">{children}</div>
        </div>
    );
}

// ─── Custom tooltip ─────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
            {label && <p className="font-medium text-slate-700 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-600">{p.name}:</span>
                    <span className="font-semibold text-slate-900">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Pie label renderer ─────────────────────────────────────
function renderPieLabel(props: PieLabelRenderProps) {
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = Number(props.midAngle ?? 0);
    const innerRadius = Number(props.innerRadius ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const percent = Number(props.percent ?? 0);
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

// ─── Main component ─────────────────────────────────────────
export default function OverviewCharts({ data }: OverviewChartsProps) {
    // 1) Module status donut data
    const statusData = useMemo(() => [
        { name: "Completed", value: data.progress.completed, color: STATUS_COLORS.completed },
        { name: "In Progress", value: data.progress.inProgress, color: STATUS_COLORS["in-progress"] },
        { name: "Upcoming", value: data.progress.upcoming, color: STATUS_COLORS.upcoming },
        { name: "Yet to Schedule", value: data.progress.yetToSchedule, color: STATUS_COLORS["yet-to-schedule"] },
    ].filter(d => d.value > 0), [data.progress]);

    // 2) Hours by category
    const categoryHoursData = useMemo(() => {
        const map = new Map<string, number>();
        data.sequenceList.forEach(item => {
            const cat = item.category || "Uncategorized";
            map.set(cat, (map.get(cat) || 0) + item.totalHours);
        });
        return Array.from(map.entries())
            .map(([name, hours]) => ({ name, hours: Math.round(hours * 10) / 10 }))
            .sort((a, b) => b.hours - a.hours);
    }, [data.sequenceList]);

    // 3) Delivery mode distribution
    const deliveryData = useMemo(() => {
        const map = new Map<string, number>();
        data.sequenceList.forEach(item => {
            const mode = (item.deliveryMode || "unknown").toLowerCase();
            map.set(mode, (map.get(mode) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value,
                color: DELIVERY_COLORS[name] || "#94a3b8",
            }))
            .filter(d => d.value > 0);
    }, [data.sequenceList]);

    // 4) Module timeline (modules per month)
    const timelineData = useMemo(() => {
        const map = new Map<string, number>();
        data.sequenceList.forEach(item => {
            if (!item.startDate) return;
            const d = new Date(item.startDate);
            const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
            map.set(key, (map.get(key) || 0) + 1);
        });
        // Sort chronologically
        const entries = Array.from(map.entries()).sort((a, b) => {
            const da = new Date(a[0]);
            const db = new Date(b[0]);
            return da.getTime() - db.getTime();
        });
        return entries.map(([month, count]) => ({ month, modules: count }));
    }, [data.sequenceList]);

    // If no real data available at all, render a friendly state
    const hasModules = data.summary.totalModules > 0;

    return (
        <div className="flex flex-col gap-6">
            {/* ── Row 1: Stat mini-cards ─────────── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                <StatMiniCard label="Total Modules" value={data.summary.totalModules} color="text-slate-900" />
                <StatMiniCard label="Completed" value={data.progress.completed} color="text-emerald-600" />
                <StatMiniCard label="In Progress" value={data.progress.inProgress} color="text-amber-600" />
                <StatMiniCard label="Upcoming" value={data.progress.upcoming} color="text-blue-600" />
                <StatMiniCard label="Yet to Schedule" value={data.progress.yetToSchedule} color="text-gray-500" />
            </div>

            {hasModules ? (
                <>
                    {/* ── Row 2: Donut + Category hours ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
                        {/* Module Status Donut — 2/5 width */}
                        <div className="md:col-span-2">
                            <ChartCard title="Module Status">
                                <div className="relative">
                                    {/* Center label overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: 30 }}>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-slate-900">{data.progress.percentage}%</div>
                                            <div className="text-xs text-slate-500">Complete</div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {statusData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend
                                                iconType="circle"
                                                iconSize={8}
                                                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>
                        </div>

                        {/* Hours by Category — 3/5 width */}
                        <div className="md:col-span-3">
                            <ChartCard title="Hours by Category">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart
                                        data={categoryHoursData}
                                        layout="vertical"
                                        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                                    >
                                        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{ fontSize: 11, fill: "#64748b" }}
                                            width={100}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                        <Bar dataKey="hours" name="Hours" radius={[0, 6, 6, 0]} barSize={20}>
                                            {categoryHoursData.map((_, i) => (
                                                <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </div>

                    {/* ── Row 3: Delivery Mode + Timeline ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Delivery Mode Pie */}
                        <ChartCard title="Delivery Mode">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={deliveryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={renderPieLabel}
                                        labelLine={false}
                                        stroke="none"
                                    >
                                        {deliveryData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Module Timeline */}
                        <ChartCard title="Module Timeline">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={timelineData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 11, fill: "#64748b" }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                                    <Bar dataKey="modules" name="Modules" fill="#ff9e44" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </>
            ) : null}

            {/* ── Row 4: Overall Progress bar ──── */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#1a1a1a]">Overall Progress</h3>
                    <span className="text-sm font-bold text-[#ff9e44]">{data.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-[#ff9e44] to-[#ff7e1f] h-3 rounded-full transition-all duration-700"
                        style={{ width: `${data.progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* ── Batch Summary (compact) ──────── */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Batch Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                    <SummaryItem label="Batch" value={data.header.batchName} />
                    <SummaryItem label="Institute" value={data.header.instituteName} />
                    <SummaryItem label="Duration" value={`${data.summary.durationWeeks} weeks`} />
                    <SummaryItem label="Date Range" value={`${data.summary.startDate} – ${data.summary.endDate}`} />
                    <SummaryItem label="Status" value={data.header.status} capitalize />
                </div>
            </div>
        </div>
    );
}

// ─── Tiny helper components ─────────────────────────────────
function StatMiniCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 text-center sm:text-left">
            <p className="text-xs font-medium text-[#717182] uppercase tracking-wide">{label}</p>
            <p className={`text-xl sm:text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
    );
}

function SummaryItem({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
            <span className="text-[#717182]">{label}</span>
            <span className={`font-medium text-[#1a1a1a] text-right ${capitalize ? "capitalize" : ""}`}>{value}</span>
        </div>
    );
}
