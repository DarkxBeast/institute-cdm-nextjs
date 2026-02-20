"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, CheckCircle2, Sparkles, CalendarClock } from "lucide-react";
import { type SessionData } from "@/utils/learning-journey-data";
import { JourneyItemDetailModal } from "./JourneyItemDetailModal";

interface SessionCardProps {
    session: SessionData;
}

const statusConfig: Record<
    string,
    {
        label: string;
        badgeBg: string;
        badgeText: string;
        badgeDot: string;
        cardBg: string;
        cardBorder: string;
        cardShadow: string;
        iconBg: string;
        iconText: string;
        footerBorder: string;
        dateText: string;
        icon: "check" | "book" | "sparkle" | "clock";
    }
> = {
    completed: {
        label: "Completed",
        badgeBg: "bg-[#fff5eb]",
        badgeText: "text-[#FF9E44]",
        badgeDot: "bg-[#FF9E44]",
        cardBg: "bg-white",
        cardBorder: "border-[#FFD4A8]/50",
        cardShadow: "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        iconBg: "bg-[#FF9E44]/10",
        iconText: "text-[#FF9E44]",
        footerBorder: "border-[#FFD4A8]/40",
        dateText: "text-[#b07a3f]",
        icon: "check",
    },
    in_progress: {
        label: "In Progress",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeDot: "bg-amber-500",
        cardBg: "bg-white",
        cardBorder: "border-amber-200/50",
        cardShadow: "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        iconBg: "bg-amber-100/80",
        iconText: "text-amber-600",
        footerBorder: "border-amber-100/60",
        dateText: "text-amber-700/70",
        icon: "sparkle",
    },
    upcoming: {
        label: "Upcoming",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
        badgeDot: "bg-blue-500",
        cardBg: "bg-white",
        cardBorder: "border-blue-200/50",
        cardShadow: "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        iconBg: "bg-blue-50",
        iconText: "text-blue-500",
        footerBorder: "border-blue-100/40",
        dateText: "text-blue-600/60",
        icon: "book",
    },
    yet_to_schedule: {
        label: "Yet to Schedule",
        badgeBg: "bg-slate-50",
        badgeText: "text-slate-500",
        badgeDot: "bg-slate-400",
        cardBg: "bg-white",
        cardBorder: "border-slate-200/50",
        cardShadow: "shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
        iconBg: "bg-slate-100/80",
        iconText: "text-slate-400",
        footerBorder: "border-slate-100/60",
        dateText: "text-slate-400",
        icon: "clock",
    },
};

const StatusIcon = ({ type, className }: { type: string; className?: string }) => {
    switch (type) {
        case "check":
            return <CheckCircle2 className={className} />;
        case "sparkle":
            return <Sparkles className={className} />;
        case "clock":
            return <CalendarClock className={className} />;
        default:
            return <BookOpen className={className} />;
    }
};

export function SessionCard({ session }: SessionCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const status = statusConfig[session.status] || statusConfig.upcoming;

    return (
        <>
            <div
                className={`relative h-full border rounded-2xl p-5 flex flex-col cursor-pointer overflow-hidden ${status.cardBg} ${status.cardBorder} ${status.cardShadow}`}
                onClick={() => setModalOpen(true)}
            >

                {/* Top row: icon + duration pill */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${status.iconBg} ${status.iconText}`}
                    >
                        <StatusIcon type={status.icon} className="w-[18px] h-[18px]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-slate-100/80 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                            {session.duration}
                        </span>
                    </div>
                </div>

                {/* Session title */}
                <div className="flex-1 mb-5">
                    <h4 className="text-[15px] font-semibold text-slate-800 leading-snug tracking-[-0.01em] group-hover:text-slate-900 transition-colors duration-200 line-clamp-3">
                        {session.title}
                    </h4>
                </div>

                {/* Bottom row: date + status badge */}
                <div className={`mt-auto flex items-center justify-between pt-3.5 border-t border-dashed ${status.footerBorder}`}>
                    <div className={`flex items-center gap-1.5 ${status.dateText}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{session.date}</span>
                    </div>

                    <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-transparent ${status.badgeBg} ${status.badgeText}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.badgeDot}`} />
                        {status.label}
                    </div>
                </div>
            </div>
            <JourneyItemDetailModal
                itemId={session.id}
                itemName={session.title}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    );
}
