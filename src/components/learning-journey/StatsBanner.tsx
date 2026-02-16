"use client";

interface StatsBannerProps {
    totalModules: number;
    programDuration: string;
    startDate: string;
    endDate: string;
}

export function StatsBanner({
    totalModules,
    programDuration,
    startDate,
    endDate,
}: StatsBannerProps) {
    const stats = [
        { label: "Total Modules", value: String(totalModules), size: "text-3xl" },
        { label: "Program Duration", value: programDuration, size: "text-3xl" },
        { label: "Start Date", value: startDate, size: "text-3xl" },
        { label: "End Date", value: endDate, size: "text-3xl" },
    ];

    return (
        <div className="bg-[#fff4e6] border border-[#ffe0b2] rounded-t-2xl px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-2">
                        <span className="h-10 flex items-end justify-center text-sm font-normal text-[#ff9e44] uppercase tracking-wider text-center">
                            {stat.label}
                        </span>
                        <span
                            className={`${stat.size} font-normal text-[#0f172b] text-center leading-tight`}
                        >
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
