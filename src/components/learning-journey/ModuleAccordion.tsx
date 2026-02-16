"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { type ModuleData, type SessionStatus } from "@/utils/learning-journey-data";
import { SessionCard } from "./SessionCard";

interface ModuleAccordionProps {
    module: ModuleData;
    defaultExpanded?: boolean;
    activeFilter: "all" | SessionStatus;
}

export function ModuleAccordion({
    module,
    defaultExpanded = false,
    activeFilter,
}: ModuleAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const percentage =
        module.totalSessions > 0
            ? Math.round(
                (module.completedSessions / module.totalSessions) * 100
            )
            : 0;

    const progressWidth =
        module.totalSessions > 0
            ? (module.completedSessions / module.totalSessions) * 100
            : 0;

    // Filter sessions based on activeFilter
    const filteredSessions =
        activeFilter === "all"
            ? module.sessions
            : module.sessions.filter((s) => s.status === activeFilter);

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            {/* Header (always visible, clickable) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 md:px-8 py-5 md:py-7 cursor-pointer hover:bg-gray-50/50 transition-colors"
            >
                {/* Left: badge + info */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ff9e44] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs md:text-sm font-medium text-white">
                            {percentage}%
                        </span>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <h3 className="text-lg md:text-2xl font-normal text-[#0f172b] text-left">
                            {module.name}
                        </h3>
                        <p className="text-xs md:text-sm text-[#62748e]">
                            {module.completedSessions} of {module.totalSessions} completed
                        </p>
                    </div>
                </div>

                {/* Right: progress bar + chevron */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Mini progress bar */}
                    <div className="hidden md:block w-32 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#ff9e44] rounded-full transition-all"
                            style={{ width: `${progressWidth}%` }}
                        />
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#62748e]" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[#62748e]" />
                    )}
                </div>
            </button>

            {/* Expanded session cards */}
            {isExpanded && filteredSessions.length > 0 && (
                <div className="px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
                        {filteredSessions.map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            )}

            {isExpanded && filteredSessions.length === 0 && (
                <div className="px-8 pb-8">
                    <p className="text-sm text-[#62748e] text-center py-4">
                        No sessions match the current filter.
                    </p>
                </div>
            )}
        </div>
    );
}
