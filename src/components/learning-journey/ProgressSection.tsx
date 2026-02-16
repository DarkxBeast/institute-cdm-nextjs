"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    upcomingSessions: number;
}

export function ProgressSection({
    totalSessions,
    completedSessions,
    inProgressSessions,
    upcomingSessions,
}: ProgressSectionProps) {
    const percentage =
        totalSessions > 0
            ? Math.round((completedSessions / totalSessions) * 100)
            : 0;

    return (
        <div className="bg-white border border-[#e0e6eb] rounded-2xl p-8 flex flex-col gap-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal text-[#0f172b]">Your Progress</h3>
                    <p className="text-sm text-[#62748e]">
                        {completedSessions} of {totalSessions} sessions completed
                    </p>
                </div>
                <span className="text-3xl font-normal text-[#0f172b]">
                    {percentage}%
                </span>
            </div>

            {/* Progress bar */}
            <Progress
                value={percentage}
                className="h-2 bg-[#f1f5f9]"
                indicatorClassName="bg-[#0f172b]"
            />

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-[#e2e8f0] rounded-[14px] py-4 px-4 flex flex-col items-center gap-1">
                    <span className="text-2xl font-normal text-[#0f172b]">
                        {completedSessions}
                    </span>
                    <span className="text-xs font-normal text-[#62748e] uppercase tracking-wider">
                        Completed
                    </span>
                </div>
                <div className="border border-[#e2e8f0] rounded-[14px] py-4 px-4 flex flex-col items-center gap-1">
                    <span className="text-2xl font-normal text-[#0f172b]">
                        {inProgressSessions}
                    </span>
                    <span className="text-xs font-normal text-[#62748e] uppercase tracking-wider">
                        In Progress
                    </span>
                </div>
                <div className="border border-[#e2e8f0] rounded-[14px] py-4 px-4 flex flex-col items-center gap-1">
                    <span className="text-2xl font-normal text-[#0f172b]">
                        {upcomingSessions}
                    </span>
                    <span className="text-xs font-normal text-[#62748e] uppercase tracking-wider">
                        Upcoming
                    </span>
                </div>
            </div>
        </div>
    );
}
