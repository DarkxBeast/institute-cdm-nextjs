"use client";

import { BookOpen, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { type SessionData } from "@/utils/learning-journey-data";

interface SessionCardProps {
    session: SessionData;
}

const statusConfig: Record<
    string,
    {
        label: string;
        badgeBg: string;
        badgeText: string;
        badgeBorder: string;
        cardBg: string;
        cardBorder: string;
        cardHoverBorder: string;
        cardHoverShadow: string;
        accentBorder: string;
        iconBg: string;
        iconText: string;
        iconHoverBg: string;
        iconHoverText: string;
        iconHoverShadow: string;
        useCheckIcon: boolean;
    }
> = {
    completed: {
        label: "Completed",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        badgeBorder: "border-emerald-200",
        cardBg: "bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30",
        cardBorder: "border-emerald-200/80",
        cardHoverBorder: "hover:border-emerald-300",
        cardHoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.10)]",
        accentBorder: "border-l-emerald-500",
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        iconHoverBg: "group-hover:bg-emerald-500",
        iconHoverText: "group-hover:text-white",
        iconHoverShadow: "group-hover:shadow-emerald-200",
        useCheckIcon: true,
    },
    in_progress: {
        label: "In Progress",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeBorder: "border-amber-200",
        cardBg: "bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30",
        cardBorder: "border-amber-200/80",
        cardHoverBorder: "hover:border-amber-300",
        cardHoverShadow: "hover:shadow-[0_8px_30px_rgba(245,158,11,0.10)]",
        accentBorder: "border-l-amber-400",
        iconBg: "bg-amber-100",
        iconText: "text-amber-600",
        iconHoverBg: "group-hover:bg-amber-500",
        iconHoverText: "group-hover:text-white",
        iconHoverShadow: "group-hover:shadow-amber-200",
        useCheckIcon: false,
    },
    upcoming: {
        label: "Upcoming",
        badgeBg: "bg-slate-50",
        badgeText: "text-slate-600",
        badgeBorder: "border-slate-200",
        cardBg: "bg-white",
        cardBorder: "border-slate-200",
        cardHoverBorder: "hover:border-orange-200",
        cardHoverShadow: "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        accentBorder: "border-l-slate-200",
        iconBg: "bg-orange-50",
        iconText: "text-orange-500",
        iconHoverBg: "group-hover:bg-orange-500",
        iconHoverText: "group-hover:text-white",
        iconHoverShadow: "group-hover:shadow-orange-200",
        useCheckIcon: false,
    },
};

export function SessionCard({ session }: SessionCardProps) {
    const status = statusConfig[session.status] || statusConfig.upcoming;

    return (
        <div
            className={`group h-full border border-l-[3px] rounded-xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer ${status.cardBg} ${status.cardBorder} ${status.accentBorder} ${status.cardHoverBorder} ${status.cardHoverShadow}`}
        >
            {/* Top row: icon + duration */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-md ${status.iconBg} ${status.iconText} ${status.iconHoverBg} ${status.iconHoverText} ${status.iconHoverShadow}`}
                >
                    {status.useCheckIcon ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <BookOpen className="w-5 h-5" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-100 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">
                        {session.duration}
                    </span>
                </div>
            </div>

            {/* Session title - flex-1 pushes footer down */}
            <div className="flex-1 mb-6">
                <h4 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-slate-800 transition-colors">
                    {session.title}
                </h4>
            </div>

            {/* Bottom row: date + status */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100/80 dashed">
                <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{session.date}</span>
                </div>

                <div
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${status.badgeBg} ${status.badgeText} ${status.badgeBorder}`}
                >
                    {status.label}
                </div>
            </div>
        </div>
    );
}
