"use client";

import { StudentStats } from "./student-stats";
import { StudentSkills } from "./student-skills";
import { StudentDiagnostic } from "./student-diagnostic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsReport } from "@/app/actions/student-analytics";
import type { StudentReportSummary } from "@/app/actions/student-reports";

interface StudentOverviewProps {
    student: any;
    reportTypes?: StudentReportSummary[];
    allReports?: AnalyticsReport[];
    onTabChange?: (tab: string) => void;
}

export function StudentOverview({ student, reportTypes = [], allReports = [], onTabChange }: StudentOverviewProps) {
    return (
        <div className="space-y-6">
            {/* Summary Section */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xl font-semibold text-gray-900">Summary</CardTitle>
                    <span className="text-xs font-medium px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                        Summary about Me
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-gray-500 text-sm">No summary is currently available for this student.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Row */}
            <StudentStats allReports={allReports} />

            {/* Skills Section */}
            <StudentSkills />

            {/* Diagnostic & Roadmap */}
            <StudentDiagnostic reportTypes={reportTypes} onTabChange={onTabChange} />
        </div>
    );
}
