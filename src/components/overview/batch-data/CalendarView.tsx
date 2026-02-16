"use client";

import { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    parse,
    isWithinInterval,
    getDay
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Re-using the Module interface from ModulesTable
interface Module {
    id: string;
    name: string;
    mentors: string;
    startDate: string; // Format: "Jan 10, 2024"
    endDate: string;   // Format: "Jan 15, 2024"
    status: "Completed" | "In Progress" | "Scheduled" | "Yet to Schedule";
    duration: string;
    format: string;
    mode: "Offline" | "Online";
    avgScore: number | string;
}

interface CalendarViewProps {
    modules: Module[];
}

interface ModuleSpan {
    module: Module;
    isStart: boolean;
    isEnd: boolean;
}

export default function CalendarView({ modules }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // Start in Jan 2024 for mock data visibility

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const jumpToToday = () => setCurrentMonth(new Date());

    // Generate Calendar Grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Helper to parse "Jan 10, 2024" format
    const parseModuleDate = (dateStr: string) => {
        try {
            return parse(dateStr, "MMM d, yyyy", new Date());
        } catch (e) {
            return null;
        }
    };

    // Get modules for a specific day with span information
    const getModulesForDay = (day: Date): ModuleSpan[] => {
        return modules
            .filter(module => {
                const start = parseModuleDate(module.startDate);
                const end = parseModuleDate(module.endDate);

                if (!start || !end) return false;

                return isWithinInterval(day, { start, end });
            })
            .map(module => {
                const start = parseModuleDate(module.startDate)!;
                const end = parseModuleDate(module.endDate)!;
                const dayOfWeek = getDay(day);

                return {
                    module,
                    isStart: isSameDay(day, start) || dayOfWeek === 0, // Start of module OR Sunday
                    isEnd: isSameDay(day, end) || dayOfWeek === 6      // End of module OR Saturday
                };
            });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-green-500/90 text-white border-green-600";
            case "In Progress": return "bg-yellow-500/90 text-white border-yellow-600";
            case "Scheduled": return "bg-blue-500/90 text-white border-blue-600";
            case "Yet to Schedule": return "bg-gray-400/90 text-white border-gray-500";
            default: return "bg-gray-500/90 text-white border-gray-600";
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevMonth}
                            className="h-8 w-8 rounded-r-none border-r border-gray-200 hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextMonth}
                            className="h-8 w-8 rounded-l-none hover:bg-gray-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={jumpToToday} className="h-8">
                        Today
                    </Button>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {weekDays.map((day) => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 flex-1 border-l border-gray-200">
                {days.map((day) => {
                    const dayModules = getModulesForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] bg-white p-2 border-r border-b border-gray-200 hover:bg-gray-50/50 transition-colors relative",
                                !isCurrentMonth && "bg-gray-50/30"
                            )}
                        >
                            {/* Date Number */}
                            <div className={cn(
                                "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-2",
                                isToday(day)
                                    ? "bg-[#ff9e44] text-white"
                                    : isCurrentMonth
                                        ? "text-gray-900"
                                        : "text-gray-400"
                            )}>
                                {format(day, "d")}
                            </div>

                            {/* Modules List with Continuous Bars */}
                            <div className="flex flex-col gap-1">
                                {dayModules.map(({ module, isStart, isEnd }) => {
                                    return (
                                        <div
                                            key={module.id}
                                            className={cn(
                                                "text-[11px] font-medium px-2 py-1 border-y cursor-pointer hover:brightness-110 transition-all shadow-sm relative",
                                                getStatusColor(module.status),
                                                // Left border and rounding
                                                isStart ? "rounded-l border-l" : "border-l-0",
                                                // Right border and rounding
                                                isEnd ? "rounded-r border-r" : "border-r-0",
                                                // Extend to edges for continuous look
                                                !isStart && "-ml-2 pl-2",
                                                !isEnd && "-mr-2 pr-2"
                                            )}
                                            style={{
                                                minWidth: isStart && isEnd ? "auto" : "calc(100% + 1rem)"
                                            }}
                                            title={`${module.name} (${module.status})\n${module.startDate} - ${module.endDate}`}
                                        >
                                            {/* Only show text on start day */}
                                            {isStart && (
                                                <span className="truncate block">
                                                    {module.name}
                                                </span>
                                            )}
                                            {/* Hidden text on middle/end days for height consistency */}
                                            {!isStart && (
                                                <span className="truncate block opacity-0">
                                                    {module.name}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
