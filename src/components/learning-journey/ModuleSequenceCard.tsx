import { format, isSameDay, isValid } from "date-fns";
import { Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleSequenceCardProps {
    item: {
        id: string;
        particulars: string;
        startDate: string;
        endDate: string;
        status: string;
        deliveryMode: string;
        format: string;
        totalHours: number;
        averageRating: number | null;
    };
    index: number;
}

const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed")
        return {
            badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
            dot: "bg-emerald-500",
            cardBg: "bg-gradient-to-r from-emerald-50/50 via-white to-white",
            cardBorder: "border-emerald-200/70",
            accent: "border-l-emerald-500",
            numBg: "bg-emerald-600",
        };
    if (s === "ongoing")
        return {
            badge: "bg-amber-50 border-amber-200 text-amber-700",
            dot: "bg-amber-500",
            cardBg: "bg-gradient-to-r from-amber-50/50 via-white to-white",
            cardBorder: "border-amber-200/70",
            accent: "border-l-amber-400",
            numBg: "bg-amber-600",
        };
    if (s === "delayed")
        return {
            badge: "bg-red-50 border-red-200 text-red-700",
            dot: "bg-red-500",
            cardBg: "bg-gradient-to-r from-red-50/40 via-white to-white",
            cardBorder: "border-red-200/70",
            accent: "border-l-red-400",
            numBg: "bg-red-600",
        };
    // scheduled / upcoming / default
    return {
        badge: "bg-slate-50 border-slate-200 text-slate-600",
        dot: "bg-slate-400",
        cardBg: "bg-white",
        cardBorder: "border-[#e5e7eb]",
        accent: "border-l-slate-300",
        numBg: "bg-[#45556c]",
    };
};

export function ModuleSequenceCard({ item, index }: ModuleSequenceCardProps) {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const startOk = isValid(start);
    const endOk = isValid(end);

    let dateString = "TBD";
    if (startOk && endOk) {
        dateString = isSameDay(start, end)
            ? format(start, "MMM d, yyyy")
            : `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
    } else if (startOk) {
        dateString = format(start, "MMM d, yyyy");
    } else if (endOk) {
        dateString = format(end, "MMM d, yyyy");
    }

    const style = getStatusStyle(item.status);

    return (
        <div
            className={cn(
                "border border-l-[4px] rounded-[14px] p-3 sm:p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]",
                style.cardBg,
                style.cardBorder,
                style.accent
            )}
        >
            {/* ── Desktop layout (md+): horizontal row ── */}
            <div className="hidden md:flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Number */}
                    <div
                        className={cn(
                            "rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-white text-sm font-normal transition-colors",
                            style.numBg
                        )}
                    >
                        {index + 1}
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <h4 className="font-semibold text-[#0a0a0a] text-base leading-6">
                            {item.particulars}
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[#62748e] text-xs">
                                <Calendar className="w-3 h-3" />
                                <span>{dateString}</span>
                            </div>
                            <div className="w-px h-3 bg-[#d1d5dc]" />
                            <div className="flex items-center gap-2">
                                <div className="border border-[rgba(0,0,0,0.08)] rounded-[10px] px-2 py-0.5 text-[#0a0a0a] text-xs bg-white/80">
                                    {item.deliveryMode}
                                </div>
                                <div className="border border-[rgba(0,0,0,0.08)] rounded-[10px] px-2 py-0.5 text-[#0a0a0a] text-xs bg-white/80">
                                    {item.format}
                                </div>
                                <div className="border border-[rgba(0,0,0,0.08)] rounded-[10px] px-2 py-0.5 text-[#0a0a0a] text-xs bg-white/80">
                                    {item.totalHours}h
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Status & Rating */}
                <div className="flex items-center gap-8 pr-4">
                    <div
                        className={cn(
                            "border px-3 py-1 rounded-full flex items-center gap-2",
                            style.badge
                        )}
                    >
                        <div
                            className={cn("w-2.5 h-2.5 rounded-full", style.dot)}
                        />
                        <span className="text-xs font-medium capitalize">
                            {item.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 min-w-[40px] justify-end">
                        {item.averageRating ? (
                            <>
                                <span className="text-sm font-normal text-black">
                                    {item.averageRating.toFixed(1)}
                                </span>
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </>
                        ) : (
                            <span className="text-[#d1d5dc] text-sm">—</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile layout (below md): stacked card ── */}
            <div className="flex flex-col gap-2.5 md:hidden">
                {/* Row 1: Number + Title + Status */}
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "rounded-full w-7 h-7 flex items-center justify-center shrink-0 text-white text-xs font-medium mt-0.5",
                            style.numBg
                        )}
                    >
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#0a0a0a] text-sm leading-5">
                            {item.particulars}
                        </h4>
                    </div>
                    <div
                        className={cn(
                            "border px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0",
                            style.badge
                        )}
                    >
                        <div
                            className={cn("w-2 h-2 rounded-full", style.dot)}
                        />
                        <span className="text-[11px] font-medium capitalize whitespace-nowrap">
                            {item.status}
                        </span>
                    </div>
                </div>

                {/* Row 2: Date + Tags + Rating */}
                <div className="flex items-center gap-2 flex-wrap pl-10">
                    <div className="flex items-center gap-1 text-[#62748e] text-xs">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="whitespace-nowrap">{dateString}</span>
                    </div>
                    <div className="w-px h-3 bg-[#d1d5dc]" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="border border-[rgba(0,0,0,0.08)] rounded-lg px-1.5 py-0.5 text-[#0a0a0a] text-[11px] bg-white/80">
                            {item.deliveryMode}
                        </span>
                        <span className="border border-[rgba(0,0,0,0.08)] rounded-lg px-1.5 py-0.5 text-[#0a0a0a] text-[11px] bg-white/80">
                            {item.format}
                        </span>
                        <span className="border border-[rgba(0,0,0,0.08)] rounded-lg px-1.5 py-0.5 text-[#0a0a0a] text-[11px] bg-white/80">
                            {item.totalHours}h
                        </span>
                    </div>
                    {item.averageRating != null && item.averageRating > 0 && (
                        <>
                            <div className="w-px h-3 bg-[#d1d5dc]" />
                            <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-[#0a0a0a] font-medium">
                                    {item.averageRating.toFixed(1)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
