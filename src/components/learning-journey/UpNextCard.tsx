"use client";

import { Calendar, Clock, ChevronRight } from "lucide-react";

interface UpNextCardProps {
    title: string;
    date: string;
    duration: string;
}

export function UpNextCard({ title, date, duration }: UpNextCardProps) {
    return (
        <div className="bg-[#0a0a0a] rounded-2xl px-8 pt-8 pb-8 flex flex-col gap-2">
            {/* Label */}
            <span className="text-sm font-normal text-[#90a1b9] uppercase tracking-wider">
                Up Next
            </span>

            {/* Title */}
            <h3 className="text-2xl font-normal text-white leading-8">{title}</h3>

            {/* Details row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 gap-4 md:gap-0">
                <div className="flex flex-row items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#cad5e2]" />
                        <span className="text-base text-[#cad5e2]">{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#cad5e2]" />
                        <span className="text-base text-[#cad5e2]">{duration}</span>
                    </div>
                </div>
                <button className="bg-white text-[#0f172b] px-6 py-2 rounded-[10px] text-base font-medium inline-flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer w-full md:w-auto">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
