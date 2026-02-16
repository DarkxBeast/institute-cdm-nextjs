import { Users, TrendingUp, CheckCircle, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsGridProps {
    totalStudents: number;
    avgPerformance: number;
    completionRate: number;
    activeMentors: number;
}

interface StatisticsCardProps {
    icon: React.ReactNode;
    iconClassName?: string;
    bgClassName?: string;
    value: string | number;
    title: string;
    change: string;
    changeType?: "positive" | "neutral" | "negative";
    delay?: number;
}

function StatisticsCard({
    icon,
    iconClassName,
    bgClassName,
    value,
    title,
    change,
    changeType = "positive",
    delay = 0,
}: StatisticsCardProps) {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 fill-mode-both border-slate-100 bg-white/50 backdrop-blur-sm",
                "hover:border-slate-200"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-4 sm:px-6 pt-4 sm:pt-6">
                <div
                    className={cn(
                        "flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                        bgClassName
                    )}
                >
                    <div className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors", iconClassName)}>{icon}</div>
                </div>
                {change && (
                    <div
                        className={cn(
                            "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide antialiased",
                            changeType === "positive"
                                ? "bg-emerald-50 text-emerald-600"
                                : changeType === "negative"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-slate-50 text-slate-500"
                        )}
                    >
                        {changeType === "positive" ? "+" : ""}
                        {change}
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                        {value}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
                </div>
                {/* Decorative background element for depth */}
                <div
                    className={cn(
                        "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150",
                        bgClassName?.replace("bg-", "bg-current-")
                    )}
                />
            </CardContent>
        </Card>
    );
}

export default function StatsGrid({
    totalStudents,
    avgPerformance,
    completionRate,
    activeMentors,
}: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatisticsCard
                icon={<Users />}
                bgClassName="bg-blue-50"
                iconClassName="text-blue-600"
                value={totalStudents}
                title="Total Students"
                change="12%"
                changeType="positive"
                delay={100}
            />
            <StatisticsCard
                icon={<TrendingUp />}
                bgClassName="bg-orange-50"
                iconClassName="text-orange-600"
                value={avgPerformance}
                title="Avg Performance"
                change="5%"
                changeType="positive"
                delay={200}
            />
            <StatisticsCard
                icon={<CheckCircle />}
                bgClassName="bg-emerald-50"
                iconClassName="text-emerald-600"
                value={`${completionRate}%`}
                title="Completion Rate"
                change="8%"
                changeType="positive"
                delay={300}
            />
            <StatisticsCard
                icon={<UserCheck />}
                // Replacing purple with Rose as per 'Purple Ban' guidelines for distinct look
                bgClassName="bg-rose-50"
                iconClassName="text-rose-600"
                value={activeMentors}
                title="Active Mentors"
                change="Active"
                changeType="neutral"
                delay={400}
            />
        </div>
    );
}
