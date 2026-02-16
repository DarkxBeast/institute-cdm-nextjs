"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    BarChart3,
    Users,
    Layers,
    Users2,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import type { LearningJourneyViewData } from "@/app/actions/learning-journey";

// Learning Journey sub-components (reused from the dedicated page)
import { StatsBanner } from "@/components/learning-journey/StatsBanner";
import { ProgressSection } from "@/components/learning-journey/ProgressSection";
import { UpNextCard } from "@/components/learning-journey/UpNextCard";
import { FilterTabs, type FilterValue } from "@/components/learning-journey/FilterTabs";
import { ModuleAccordion } from "@/components/learning-journey/ModuleAccordion";

import EmptyState from "./EmptyState";
import StudentPerformanceTable from "./StudentPerformanceTable";
import ModulesTable from "./ModulesTable";
import MentorsTable from "./MentorsTable";
import OverviewCharts from "./OverviewCharts";

interface Batch {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    studentCount: number;
    startDate: string;
    endDate: string;
}

interface BatchDetails {
    batchInfo: {
        batchName: string;

        startDate: string;
        endDate: string;
        status: string;
        description: string;
    };
    students: Array<{
        id?: string;
        studentName: string;
        enrollmentId: string;
        email: string;
        phoneNumber: string;
        gender?: string;
    }>;
}

interface ContentTabsPanelProps {
    batchDetails: BatchDetails | null;
    selectedBatch: Batch | undefined;
    learningJourneyData: LearningJourneyViewData | null;
    isLoading: boolean;
}

/**
 * Map service data into the shape the learning journey sub-components expect.
 */
function useNormalizedJourneyData(serviceData: LearningJourneyViewData | null) {
    return useMemo(() => {
        if (!serviceData) return null;

        const statusMap: Record<string, "completed" | "in_progress" | "upcoming"> = {
            Completed: "completed",
            Ongoing: "in_progress",
            Upcoming: "upcoming",
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
            upNext: serviceData.upNext,
            modules: serviceData.categories.map((cat) => ({
                id: cat.name.toLowerCase().replace(/\s+/g, "-"),
                name: cat.name,
                totalSessions: cat.total,
                completedSessions: cat.completed,
                sessions: cat.items.map((item) => {
                    const start = new Date(item.startDate);
                    const end = new Date(item.endDate);
                    const isSame = isSameDay(start, end);

                    return {
                        id: item.id,
                        title: item.particulars,
                        date: isSame
                            ? format(start, "MMMM d, yyyy")
                            : `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
                        duration: `${item.totalHours}h`,
                        status: statusMap[item.status] ?? "upcoming",
                    };
                }),
            })),
        };
    }, [serviceData]);
}

export default function ContentTabsPanel({
    batchDetails,
    selectedBatch,
    learningJourneyData,
    isLoading,
}: ContentTabsPanelProps) {
    const students = batchDetails?.students || [];
    const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

    const journeyData = useNormalizedJourneyData(learningJourneyData);

    // Filter modules for learning journey tab
    const filteredModules = journeyData
        ? activeFilter === "all"
            ? journeyData.modules
            : journeyData.modules.filter((m) =>
                m.sessions.some((s) => s.status === activeFilter)
            )
        : [];

    return (
        <div className="w-full rounded-[16px] border border-[#e0e6eb] bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: "200ms" }}>
            {/* Tabs Navigation */}
            <Tabs defaultValue="learning-journey" className="w-full">
                <div className="border-b border-[#e0e6eb]">
                    <TabsList className="flex w-full items-center justify-start gap-2 bg-transparent px-6 py-3 border-none rounded-none">
                        {[
                            { value: "learning-journey", icon: BookOpen, label: "Learning Journey" },
                            { value: "overview", icon: BarChart3, label: "Overview" },
                            { value: "students", icon: Users, label: "Students" },
                            { value: "modules", icon: Layers, label: "Modules" },
                            { value: "mentors", icon: Users2, label: "Mentors" },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="group flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#717182] transition-all hover:bg-[#ff9e44]/10 hover:text-[#ff9e44] data-[state=active]:bg-[#ff9e44] data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tab Content Area */}
                <div
                    className="px-8 py-12 min-h-[400px]"
                    style={{
                        background: "linear-gradient(155deg, #fafafa 0%, rgba(245, 245, 245, 0.5) 100%)",
                    }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff9e44] border-t-transparent" />
                        </div>
                    ) : (
                        <>
                            {/* Learning Journey Tab */}
                            <TabsContent value="learning-journey" className="mt-0">
                                {journeyData ? (
                                    <div className="flex flex-col gap-6">
                                        <StatsBanner
                                            totalModules={journeyData.totalModules}
                                            programDuration={journeyData.programDuration}
                                            startDate={journeyData.startDate}
                                            endDate={journeyData.endDate}
                                        />

                                        <ProgressSection
                                            totalSessions={journeyData.totalSessions}
                                            completedSessions={journeyData.completedSessions}
                                            inProgressSessions={journeyData.inProgressSessions}
                                            upcomingSessions={journeyData.upcomingSessions}
                                        />

                                        {journeyData.upNext && (
                                            <UpNextCard
                                                title={journeyData.upNext.title}
                                                date={journeyData.upNext.date}
                                                duration={journeyData.upNext.duration}
                                            />
                                        )}

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
                                ) : (
                                    <EmptyState
                                        icon={BookOpen}
                                        title="Learning Journey"
                                        description="No learning journey data found for this batch."
                                    />
                                )}
                            </TabsContent>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="mt-0">
                                {learningJourneyData ? (
                                    <OverviewCharts data={learningJourneyData} />
                                ) : (
                                    <EmptyState
                                        icon={BarChart3}
                                        title="Overview Statistics"
                                        description="No overview data available for this batch."
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="students" className="mt-0">
                                {students && students.length > 0 ? (
                                    <StudentPerformanceTable
                                        students={students}
                                        batchId={selectedBatch?.id || ""}
                                    />
                                ) : (
                                    <EmptyState
                                        icon={Users}
                                        title="Students"
                                        description="No students found in this batch."
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="modules" className="mt-0">
                                {learningJourneyData?.sequenceList && learningJourneyData.sequenceList.length > 0 ? (
                                    <ModulesTable
                                        learningJourneyItems={learningJourneyData.sequenceList}
                                    />
                                ) : (
                                    <EmptyState
                                        icon={Layers}
                                        title="Modules"
                                        description="No module data available for this batch."
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="mentors" className="mt-0">
                                {learningJourneyData?.mentors && learningJourneyData.mentors.length > 0 ? (
                                    <MentorsTable
                                        mentors={learningJourneyData.mentors.map(m => ({
                                            id: m.id,
                                            fullName: m.fullName,
                                            email: m.email,
                                            phone: m.phone,
                                            specialization: m.specialization,
                                            status: m.status,
                                        }))}
                                    />
                                ) : (
                                    <EmptyState
                                        icon={Users2}
                                        title="Mentors"
                                        description="No mentor data available for this batch."
                                    />
                                )}
                            </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
