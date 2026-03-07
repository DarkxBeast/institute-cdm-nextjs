"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentOverview } from "./overview/student-overview";
import { StudentJourney } from "./overview/student-journey";
import { StudentReportTab } from "./student-report-tab";
import type { StudentReportSummary } from "@/app/actions/student-reports";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface StudentInfoTabsProps {
    student: any;
    journeyItems?: any[];
    reportTypes?: StudentReportSummary[];
    allReports?: AnalyticsReport[];
}

/**
 * Convert a raw report_type string (e.g. "diagnostic_interview") into a
 * human-readable tab label (e.g. "Diagnostic Interview").
 */
function formatReportTypeLabel(reportType: string): string {
    return reportType
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Build the display label for a tab.
 * If there are multiple instances of the same report type, append the instance number.
 * e.g. "Diagnostic Interview - 1", "Diagnostic Interview - 2"
 * If only one instance, just "Diagnostic Interview".
 */
function buildTabLabel(rt: StudentReportSummary, allTypes: StudentReportSummary[]): string {
    const base = formatReportTypeLabel(rt.reportType);
    const sameTypeCount = allTypes.filter(t => t.reportType === rt.reportType).length;
    return sameTypeCount > 1 ? `${base} - ${rt.instanceNumber}` : base;
}

/**
 * Turn a report summary into a unique, safe tab value.
 */
export function toTabValue(rt: StudentReportSummary): string {
    let val = `report_${rt.reportType.toLowerCase().replace(/\s+/g, "_")}_${rt.journeyItemId}`;
    if (rt.reportId) {
        val += `_${rt.reportId}`;
    }
    return val;
}

export function StudentInfoTabs({
    student,
    journeyItems = [],
    reportTypes = [],
    allReports = [],
}: StudentInfoTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");

    // Sort tabs by journey item sequence order
    const sortedReportTypes = [...reportTypes].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap justify-start w-fit max-w-full h-auto gap-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>

                {/* Dynamic report type tabs — one per journey item, ordered by sequence */}
                {sortedReportTypes.map((rt) => (
                    <TabsTrigger key={toTabValue(rt)} value={toTabValue(rt)}>
                        {buildTabLabel(rt, sortedReportTypes)}
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* 2-column layout: Journey sidebar (always visible) + Tab content */}
            <div className="mt-6 flex flex-col xl:flex-row gap-6 items-start">
                {/* Left Column - Journey Timeline (persists across all tabs) */}
                <div className="w-full xl:w-[320px] flex-none">
                    <StudentJourney items={journeyItems} />
                </div>

                {/* Right Column - Active Tab Content */}
                <div className="flex-1 w-full min-w-0">
                    <TabsContent value="overview" className="mt-0">
                        <StudentOverview
                            student={student}
                            reportTypes={reportTypes}
                            allReports={allReports}
                            onTabChange={setActiveTab}
                        />
                    </TabsContent>

                    {/* Dynamic report type tab contents */}
                    {sortedReportTypes.map((rt) => (
                        <TabsContent
                            key={toTabValue(rt)}
                            value={toTabValue(rt)}
                            className="mt-0"
                        >
                            <StudentReportTab
                                studentId={student.id}
                                reportType={rt.reportType}
                                journeyItemId={rt.journeyItemId}
                                instanceLabel={buildTabLabel(rt, sortedReportTypes)}
                                reportId={rt.reportId}
                            />
                        </TabsContent>
                    ))}
                </div>
            </div>
        </Tabs>
    );
}
