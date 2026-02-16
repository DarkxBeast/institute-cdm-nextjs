"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarDays, Layers } from "lucide-react";
import { format, isSameDay, isValid } from "date-fns";
import { JourneyHeader } from "./JourneyHeader";
import { StatsBanner } from "./StatsBanner";
import { ModuleTitle } from "./ModuleTitle";
import { ProgressSection } from "./ProgressSection";
import { UpNextCard } from "./UpNextCard";
import { FilterTabs, type FilterValue } from "./FilterTabs";
import { ModuleAccordion } from "./ModuleAccordion";
import { CalendarView } from "./CalendarView";
import { ModuleSequenceList } from "./ModuleSequenceList";
import type { LearningJourneyViewData } from "@/app/actions/learning-journey";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LearningJourneyPageProps {
    batchId: string;
    data: LearningJourneyViewData | null;
    error: string | null;
}

/**
 * Map Supabase service data into the shape our sub-components expect.
 */
function useNormalizedData(serviceData: LearningJourneyViewData | null) {
    return useMemo(() => {
        if (!serviceData) return null;

        const statusMap: Record<string, "completed" | "in_progress" | "upcoming" | "yet_to_schedule"> =
        {
            Completed: "completed",
            Ongoing: "in_progress",
            Upcoming: "upcoming",
            "Yet to Schedule": "yet_to_schedule",
        };

        return {
            batchTitle: serviceData.header.batchName,
            batchSubtitle: "Learning Journey Visualization",
            batchStatus: serviceData.header.status,
            programLabel: `${serviceData.header.instituteName} - ${serviceData.header.batchName}`,
            moduleName: "Career Development Module",
            totalModules: serviceData.summary.totalModules,
            programDuration: `${serviceData.summary.durationWeeks} weeks`,
            startDate: serviceData.summary.startDate,
            endDate: serviceData.summary.endDate,
            totalSessions: serviceData.summary.totalModules,
            completedSessions: serviceData.progress.completed,
            inProgressSessions: serviceData.progress.inProgress,
            upcomingSessions: serviceData.progress.upcoming,
            yetToScheduleSessions: serviceData.progress.yetToSchedule,
            upNext: serviceData.upNext,
            modules: serviceData.categories.map((cat) => ({
                id: cat.name.toLowerCase().replace(/\s+/g, "-"),
                name: cat.name,
                totalSessions: cat.total,
                completedSessions: cat.completed,
                sessions: cat.items.map((item) => {
                    const start = new Date(item.startDate);
                    const end = new Date(item.endDate);
                    const startOk = isValid(start);
                    const endOk = isValid(end);

                    let dateStr = "TBD";
                    if (startOk && endOk) {
                        const isSame = isSameDay(start, end);
                        dateStr = isSame
                            ? format(start, "MMMM d, yyyy")
                            : `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
                    } else if (startOk) {
                        dateStr = format(start, "MMMM d, yyyy");
                    } else if (endOk) {
                        dateStr = format(end, "MMMM d, yyyy");
                    }

                    return {
                        id: item.id,
                        title: item.particulars,
                        date: dateStr,
                        duration: `${item.totalHours}h`,
                        status: statusMap[item.status] ?? "yet_to_schedule",
                    };
                }),
            })),
        };
    }, [serviceData]);
}

export function LearningJourneyPage({
    batchId,
    data: serviceData,
    error,
}: LearningJourneyPageProps) {
    const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

    const data = useNormalizedData(serviceData);

    // Empty state: no learning journey found for this batch
    if (!data) {
        return (
            <div className="bg-[#fafafa] min-h-screen">
                <div className="max-w-[1380px] mx-auto px-8 py-12 flex flex-col gap-8">
                    <Link
                        href="/batches"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-[#ff9e44] transition-colors w-fit"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Batches
                    </Link>
                    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center">
                        <p className="text-sm text-[#62748e]">
                            No learning journey found for this batch.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter modules: show only modules that have sessions matching the filter
    const filteredModules =
        activeFilter === "all"
            ? data.modules
            : data.modules.filter((m) =>
                m.sessions.some((s) => s.status === activeFilter)
            );

    return (
        <div className="bg-[#fafafa] min-h-screen">
            <div className="max-w-[1380px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-7">
                {/* Header: back link, title, badge */}
                <JourneyHeader
                    batchId={batchId}
                    batchTitle={data.batchTitle}
                    batchSubtitle={data.batchSubtitle}
                    batchStatus={data.batchStatus}
                />

                {/* Tabs: pill-style toggle */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="modules" className="gap-2">
                            <Layers className="h-4 w-4" />
                            Modules
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Calendar
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-6">
                        <div className="flex flex-col gap-0">
                            <StatsBanner
                                totalModules={data.totalModules}
                                programDuration={data.programDuration}
                                startDate={data.startDate}
                                endDate={data.endDate}
                            />
                            <ModuleTitle
                                programLabel={data.programLabel}
                                moduleName={data.moduleName}
                            />
                        </div>

                        <div className="flex flex-col gap-6 mt-6">
                            <ProgressSection
                                totalSessions={data.totalSessions}
                                completedSessions={data.completedSessions}
                                inProgressSessions={data.inProgressSessions}
                                upcomingSessions={data.upcomingSessions}
                                yetToScheduleSessions={data.yetToScheduleSessions}
                            />

                            <UpNextCard
                                title={data.upNext?.title}
                                date={data.upNext?.date}
                                duration={data.upNext?.duration}
                            />

                            <div className="flex flex-col gap-6">
                                <FilterTabs
                                    activeFilter={activeFilter}
                                    onFilterChange={setActiveFilter}
                                />

                                <div className="flex flex-col gap-4">
                                    {filteredModules.map((module, index) => (
                                        <ModuleAccordion
                                            key={module.id}
                                            module={module}
                                            defaultExpanded={index === 0}
                                            activeFilter={activeFilter}
                                        />
                                    ))}

                                    {filteredModules.length === 0 && (
                                        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center">
                                            <p className="text-sm text-[#62748e]">
                                                No modules match the current filter.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Modules Tab */}
                    <TabsContent value="modules" className="mt-6">
                        {serviceData && <ModuleSequenceList items={serviceData.sequenceList} />}
                    </TabsContent>

                    {/* Calendar Tab */}
                    <TabsContent value="calendar" className="mt-6">
                        {serviceData && <CalendarView items={serviceData.sequenceList} />}
                    </TabsContent>
                </Tabs >
            </div >
        </div >
    );
}
