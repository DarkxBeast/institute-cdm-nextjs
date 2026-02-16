"use client";

import * as React from "react";
import { format, addDays, addWeeks, addMonths, startOfToday, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, subDays, subWeeks, subMonths, isWithinInterval, differenceInCalendarDays, isBefore, isAfter } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { type LearningJourneyViewData } from "@/app/actions/learning-journey";

interface CalendarViewProps {
    items: LearningJourneyViewData["sequenceList"];
}

const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return format(new Date().setHours(hour, 0, 0, 0), "h:00 a");
});

// Helper to check if item is "All Day" (conceptually, if duration > 8h or no specific time provided)
// For now, we'll assume items without specific timestamps (just dates) are All Day, 
// and items with specific times are time-based.
// Since the current data might just be dates, we'll simulate time for demonstration if needed, 
// or strictly use the provided ISO strings.
const isAllDay = (item: LearningJourneyViewData["sequenceList"][0]) => {
    // Per user request, all current modules are treated as all-day events.
    return true;
};

const getEventStyle = (item: LearningJourneyViewData["sequenceList"][0]) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    // Default to 9 AM if time is 00:00 (midnight) which implies date-only in some systems
    let startHour = start.getHours();
    let startMin = start.getMinutes();

    if (startHour === 0 && startMin === 0) {
        startHour = 9; // Default start
    }

    // Duration in minutes
    let durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes <= 0) durationMinutes = 60; // Default 1h if invalid

    // Calculate top offset from 8 AM
    const startOffsetMinutes = (startHour - 8) * 60 + startMin;

    // 1 hour = 80px height (h-20)
    const top = (startOffsetMinutes / 60) * 80;
    const height = (durationMinutes / 60) * 80;

    return {
        top: `${Math.max(0, top)}px`,
        height: `${Math.max(40, height)}px`, // Min height for visibility
        minHeight: '40px'
    };
};

// Helper to get layout for events in a week (0-6 index)
// Returns array of events with colStart, colSpan, and row index (0-based)
const getLayoutItems = (items: LearningJourneyViewData["sequenceList"], weekStart: Date, weekEnd: Date) => {
    // 1. Filter items that overlap with this week
    const relevantItems = items.filter(item => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return (isBefore(start, weekEnd) || isSameDay(start, weekEnd)) && (isAfter(end, weekStart) || isSameDay(end, weekStart));
    });

    // 2. Sort by start date, then duration (longer first)
    relevantItems.sort((a, b) => {
        const startA = new Date(a.startDate);
        const startB = new Date(b.startDate);
        if (startA.getTime() !== startB.getTime()) return startA.getTime() - startB.getTime();
        const durationA = new Date(a.endDate).getTime() - startA.getTime();
        const durationB = new Date(b.endDate).getTime() - startB.getTime();
        return durationB - durationA;
    });

    // 3. Assign rows
    const eventsWithLayout: { item: typeof items[0], colStart: number, colSpan: number, row: number, isStart: boolean, isEnd: boolean }[] = [];
    const filledSlots: boolean[][] = []; // [row][dayIndex]

    relevantItems.forEach(item => {
        const itemStart = new Date(item.startDate);
        const itemEnd = new Date(item.endDate);

        // Calculate start/end indices relative to week (0-6)
        let startIndex = differenceInCalendarDays(itemStart, weekStart);
        let endIndex = differenceInCalendarDays(itemEnd, weekStart);

        // Clamp to 0-6
        const originalStartIndex = startIndex;
        const originalEndIndex = endIndex;

        startIndex = Math.max(0, startIndex);
        endIndex = Math.min(6, endIndex);

        if (startIndex > endIndex) return; // Should not happen if logic is correct

        const colSpan = endIndex - startIndex + 1;

        // Find first available row
        let row = 0;
        while (true) {
            if (!filledSlots[row]) filledSlots[row] = [];
            let isRowFree = true;
            for (let d = startIndex; d <= endIndex; d++) {
                if (filledSlots[row][d]) {
                    isRowFree = false;
                    break;
                }
            }
            if (isRowFree) {
                // Mark slots as filled
                for (let d = startIndex; d <= endIndex; d++) {
                    filledSlots[row][d] = true;
                }
                break;
            }
            row++;
        }

        eventsWithLayout.push({
            item,
            colStart: startIndex + 1, // CSS Grid is 1-based
            colSpan,
            row,
            isStart: originalStartIndex >= 0,
            isEnd: originalEndIndex <= 6,
        });
    });

    return eventsWithLayout;
};

// Helper to check if an item spans a specific date
const getItemsForDate = (items: LearningJourneyViewData["sequenceList"], date: Date) => {
    return items.filter(item => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        // Correctly handle ranges using isWithinInterval
        // Ensure to normalize date times to avoid issues with time components if just checking dates
        return isWithinInterval(date, { start: start, end: end }) || isSameDay(date, start) || isSameDay(date, end);
    });
};

export function CalendarView({ items }: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date>(startOfToday());
    const [view, setView] = React.useState<"day" | "week" | "month">("day");

    const navigateDate = (direction: "prev" | "next") => {
        if (view === "day") {
            setSelectedDate(current => direction === "prev" ? subDays(current, 1) : addDays(current, 1));
        } else if (view === "week") {
            setSelectedDate(current => direction === "prev" ? subWeeks(current, 1) : addWeeks(current, 1));
        } else {
            setSelectedDate(current => direction === "prev" ? subMonths(current, 1) : addMonths(current, 1));
        }
    };

    const renderDayView = () => {
        const todaysItems = getItemsForDate(items, selectedDate);
        const allDayItems = todaysItems.filter(i => isAllDay(i));
        const timeItems = todaysItems.filter(i => !isAllDay(i));

        return (
            <div className="flex-1 overflow-auto bg-white relative flex flex-col">
                {/* All Day Section */}
                <div className="flex border-b border-gray-100 min-h-[50px] sm:min-h-[60px] shrink-0">
                    <div className="w-14 sm:w-20 border-r border-gray-100 bg-gray-50/30 flex items-center justify-end px-2 sm:px-3 py-2">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">all day</span>
                    </div>
                    <div className="flex-1 p-1.5 sm:p-2 space-y-1">
                        {allDayItems.map(item => (
                            <div key={item.id} className="bg-orange-500 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded shadow-sm border border-orange-600">
                                {item.particulars}
                                <div className="text-[9px] sm:text-[10px] font-normal opacity-90 mt-0.5">
                                    {isSameDay(new Date(item.startDate), new Date(item.endDate))
                                        ? format(new Date(item.startDate), "MMMM d, yyyy")
                                        : `${format(new Date(item.startDate), "MMM d")} - ${format(new Date(item.endDate), "MMM d, yyyy")}`}
                                </div>
                            </div>
                        ))}
                        {allDayItems.length === 0 && (
                            <div className="text-xs text-gray-400 italic p-2">No all-day events</div>
                        )}
                    </div>
                </div>

                {/* Time Slots Grid */}
                <div className="relative flex-1">
                    {timeSlots.map((time, i) => (
                        <div key={time} className="flex h-16 sm:h-20 border-b border-dashed border-gray-100 box-content">
                            <div className="w-14 sm:w-20 border-r border-gray-100 bg-gray-50/30 flex items-center justify-center shrink-0">
                                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{time}</span>
                            </div>
                            <div className="flex-1 relative group hover:bg-gray-50/10 transition-colors">
                                {/* Grid lines helper */}
                            </div>
                        </div>
                    ))}

                    {/* Events Overlay */}
                    <div className="absolute top-0 left-14 sm:left-20 right-0 bottom-0 pointer-events-none custom-scrollbar overflow-hidden">
                        {timeItems.map(item => (
                            <div
                                key={item.id}
                                className="absolute left-2 right-2 bg-blue-50 border border-blue-100 text-blue-700 p-2 rounded shadow-sm border-l-4 border-l-blue-500 flex flex-col overflow-hidden pointer-events-auto cursor-pointer hover:shadow-md transition-shadow z-10"
                                style={getEventStyle(item)}
                            >
                                <div className="text-xs font-semibold leading-tight line-clamp-2">{item.particulars}</div>
                                <div className="text-[10px] flex items-center gap-1 mt-0.5 opacity-80 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(item.startDate), "h:mm a")} - {format(new Date(item.endDate), "h:mm a")}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Current Time Indicator logic could be added here */}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
        const days = eachDayOfInterval({
            start: startDate,
            end: endOfWeek(selectedDate, { weekStartsOn: 1 })
        });

        return (
            <div className="flex-1 overflow-auto bg-white flex flex-col">
                <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20 shadow-sm shrink-0 flex-col">
                    <div className="flex border-b border-gray-100">
                        <div className="w-14 sm:w-20 border-r border-gray-100 bg-gray-50/30 shrink-0" /> {/* Time column header placeholder */}
                        <div className="flex-1 grid grid-cols-7">
                            {days.map((day) => (
                                <div key={day.toISOString()} className={cn("p-1 sm:p-2 text-center border-r border-gray-100 last:border-r-0", isSameDay(day, new Date()) && "bg-orange-50")}>
                                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium">
                                        <span className="sm:hidden">{format(day, "EEEEE")}</span>
                                        <span className="hidden sm:inline">{format(day, "EEE")}</span>
                                    </div>
                                    <div className={cn("text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mx-auto rounded-full", isSameDay(day, new Date()) ? "bg-orange-500 text-white" : "text-gray-900")}>
                                        {format(day, "d")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* All Day Row for Week View */}
                    <div className="flex min-h-[40px] sm:min-h-[50px] border-b border-gray-100">
                        <div className="w-14 sm:w-20 border-r border-gray-100 bg-gray-50/30 flex items-center justify-end px-1 sm:px-2 py-1 shrink-0">
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">all-day</span>
                        </div>
                        <div className="flex-1 relative">
                            {/* Background Grid */}
                            <div className="absolute inset-0 grid grid-cols-7">
                                {days.map((day) => (
                                    <div key={day.toISOString()} className="border-r border-gray-100 last:border-r-0 h-full" />
                                ))}
                            </div>

                            {/* Events Overlay */}
                            <div className="relative z-10 grid grid-cols-7 gap-y-1 p-1">
                                {getLayoutItems(items, startDate, endOfWeek(startDate, { weekStartsOn: 1 })).map(({ item, colStart, colSpan, row, isStart, isEnd }) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "bg-orange-500 text-white text-[10px] font-medium px-2 py-1 shadow-sm border border-orange-600 truncate cursor-pointer hover:bg-orange-600 transition-colors",
                                            isStart ? "rounded-l-md ml-1" : "rounded-l-none border-l-0 -ml-[1px]",
                                            isEnd ? "rounded-r-md mr-1" : "rounded-r-none border-r-0 -mr-[1px]"
                                        )}
                                        style={{
                                            gridColumnStart: colStart,
                                            gridColumnEnd: `span ${colSpan}`,
                                            gridRowStart: row + 1,
                                        }}
                                        title={`${item.particulars} (${format(new Date(item.startDate), "MMM d")} - ${format(new Date(item.endDate), "MMM d")})`}
                                    >
                                        {item.particulars}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex-1">
                    {/* Background Grid */}
                    {timeSlots.map((time) => (
                        <div key={time} className="flex h-16 sm:h-20 border-b border-dashed border-gray-100 box-content">
                            <div className="w-14 sm:w-20 border-r border-gray-100 bg-gray-50/30 flex items-center justify-center shrink-0">
                                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{time}</span>
                            </div>
                            {/* Columns for days */}
                            <div className="flex-1 grid grid-cols-7 h-full">
                                {days.map((day) => (
                                    <div key={day.toISOString()} className="border-r border-gray-100 last:border-r-0 h-full hover:bg-gray-50/10 transition-colors" />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Events Overlay Layer */}
                    <div className="absolute top-0 left-14 sm:left-20 right-0 bottom-0 pointer-events-none grid grid-cols-7 overflow-hidden">
                        {days.map((day) => {
                            const dayItems = getItemsForDate(items, day).filter(i => !isAllDay(i));
                            return (
                                <div key={day.toISOString()} className="relative h-full border-r border-transparent last:border-r-0">
                                    {dayItems.map(item => (
                                        <div
                                            key={item.id}
                                            className="absolute left-1 right-1 bg-orange-100 border border-orange-200 text-orange-900 p-1.5 rounded shadow-sm flex flex-col overflow-hidden pointer-events-auto cursor-pointer hover:shadow-md hover:z-20 transition-all z-10"
                                            style={getEventStyle(item)}
                                            title={item.particulars}
                                        >
                                            <div className="text-[10px] font-semibold leading-tight line-clamp-2">{item.particulars}</div>
                                            <div className="text-[9px] mt-0.5 opacity-90 hidden sm:block">
                                                {format(new Date(item.startDate), "h:mm a")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weeks: Date[][] = [];
        let week: Date[] = [];

        days.forEach((day) => {
            week.push(day);
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        });

        return (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div key={day} className="p-1 sm:p-2 text-center text-[10px] sm:text-xs font-semibold text-gray-500 uppercase">
                            <span className="sm:hidden">{day.charAt(0)}</span>
                            <span className="hidden sm:inline">{day}</span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 grid grid-rows-5 sm:grid-rows-6"> {/* dynamic rows based on weeks count */}
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="relative border-b border-gray-100 last:border-b-0 h-full">
                            {/* Background Layer: Day Cells */}
                            <div className="absolute inset-0 grid grid-cols-7 h-full">
                                {week.map((day) => {
                                    const isCurrentMonth = isSameMonth(day, monthStart);
                                    return (
                                        <div key={day.toISOString()} className={cn("border-r border-gray-100 last:border-r-0 p-1 relative flex flex-col hover:bg-gray-50 transition-colors", !isCurrentMonth && "bg-gray-50/30")}>
                                            <div className="flex justify-end p-1">
                                                <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                                    isSameDay(day, new Date())
                                                        ? "bg-orange-500 text-white"
                                                        : isCurrentMonth ? "text-gray-700" : "text-gray-400"
                                                )}>
                                                    {format(day, "d")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Events Layer: Spanning Banners */}
                            <div className="absolute top-8 left-0 right-0 bottom-0 grid grid-cols-7 grid-rows-[repeat(auto-fill,24px)] gap-y-1 px-0.5 overflow-hidden pointer-events-none">
                                {getLayoutItems(items, week[0], week[6]).map(({ item, colStart, colSpan, row, isStart, isEnd }) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "bg-orange-100/90 text-orange-900 text-[10px] px-2 py-0.5 shadow-sm truncate border border-orange-200 pointer-events-auto cursor-pointer flex items-center h-[22px]",
                                            isStart ? "rounded-l ml-1" : "rounded-l-none border-l-0 -ml-[1px]",
                                            isEnd ? "rounded-r mr-1" : "rounded-r-none border-r-0 -mr-[1px]"
                                        )}
                                        style={{
                                            gridColumnStart: colStart,
                                            gridColumnEnd: `span ${colSpan}`,
                                            gridRowStart: row + 1,
                                        }}
                                        title={item.particulars}
                                    >
                                        <div className="font-medium truncate w-full">
                                            {item.particulars}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:h-[600px] w-full mt-4 sm:mt-6">
            {/* Left Panel: Upcoming Events List */}
            <div className="w-full lg:w-[350px] bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm max-h-[280px] lg:max-h-none">
                <div className="p-3 sm:p-4 border-b border-gray-100 bg-white shrink-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Module Timeline</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                    <div className="space-y-2 sm:space-y-3">
                        {items.slice(0, 10).map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
                                onClick={() => {
                                    setSelectedDate(new Date(item.startDate));
                                    setView("day");
                                }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-100 group-hover:bg-orange-400 transition-colors" />
                                <div className="pl-3">
                                    <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight mb-1.5 sm:mb-2 pr-2">
                                        {item.particulars}
                                    </h4>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] sm:text-xs text-gray-500 font-normal">
                                            {isSameDay(new Date(item.startDate), new Date(item.endDate))
                                                ? format(new Date(item.startDate), "MMMM d, yyyy")
                                                : `${format(new Date(item.startDate), "MMM d")} - ${format(new Date(item.endDate), "MMM d, yyyy")}`}
                                        </span>
                                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-orange-100 text-orange-700 uppercase tracking-wide shrink-0">
                                            {item.category === 'General' ? 'Platform' : 'Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Calendar Scheduler */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm overflow-hidden min-h-[400px] lg:min-h-0">
                {/* Header */}
                <div className="border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-3 sm:py-0 sm:h-16 bg-white shrink-0 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-gray-50" onClick={() => navigateDate("prev")}>
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-gray-50" onClick={() => navigateDate("next")}>
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                            </Button>
                        </div>
                        <h2 className="text-sm sm:text-lg font-semibold text-gray-900">
                            {view === "month"
                                ? format(selectedDate, "MMMM yyyy")
                                : view === "week"
                                    ? `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                                    : format(selectedDate, "MMMM d, yyyy")
                            }
                        </h2>
                    </div>

                    <div className="flex bg-gray-100/50 p-1 rounded-lg">
                        {(["day", "week", "month"] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={cn(
                                    "px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all",
                                    view === v
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Body */}
                {view === "day" && renderDayView()}
                {view === "week" && renderWeekView()}
                {view === "month" && renderMonthView()}
            </div>
        </div>
    );
}
