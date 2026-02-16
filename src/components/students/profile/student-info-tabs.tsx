"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentOverview } from "./overview/student-overview";
import { StudentJourney } from "./overview/student-journey";
import { StudentReportTab } from "./student-report-tab";
import type { StudentReportSummary } from "@/app/actions/student-reports";

interface StudentInfoTabsProps {
    student: any;
    journeyItems?: any[];
    reportTypes?: StudentReportSummary[];
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
 * Turn the report_type string into a safe tab value (lowercase, underscored).
 */
function toTabValue(reportType: string): string {
    return `report_${reportType.toLowerCase().replace(/\s+/g, "_")}`;
}

export function StudentInfoTabs({
    student,
    journeyItems = [],
    reportTypes = [],
}: StudentInfoTabsProps) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap justify-start w-fit max-w-full h-auto gap-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>

                {/* Dynamic report type tabs */}
                {reportTypes.map((rt) => (
                    <TabsTrigger key={toTabValue(rt.reportType)} value={toTabValue(rt.reportType)}>
                        {formatReportTypeLabel(rt.reportType)}
                        {rt.count > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-semibold">
                                {rt.count}
                            </span>
                        )}
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
                        <StudentOverview student={student} />
                    </TabsContent>

                    {/* Dynamic report type tab contents */}
                    {reportTypes.map((rt) => (
                        <TabsContent
                            key={toTabValue(rt.reportType)}
                            value={toTabValue(rt.reportType)}
                            className="mt-0"
                        >
                            <StudentReportTab studentId={student.id} reportType={rt.reportType} />
                        </TabsContent>
                    ))}
                </div>
            </div>
        </Tabs>
    );
}
