"use client";

import { type SessionStatus } from "@/utils/learning-journey-data";

type FilterValue = "all" | SessionStatus;

interface FilterTabsProps {
    activeFilter: FilterValue;
    onFilterChange: (filter: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "In Progress", value: "in_progress" },
    { label: "Upcoming", value: "upcoming" },
];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-sm font-normal text-[#45556c]">Filter:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeFilter === filter.value
                            ? "bg-[#0a0a0a] text-white"
                            : "border border-[#e2e8f0] text-[#45556c] hover:bg-gray-50"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export type { FilterValue };
