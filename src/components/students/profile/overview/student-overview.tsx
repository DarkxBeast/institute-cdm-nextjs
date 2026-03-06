"use client";

import { StudentStats } from "./student-stats";
import { StudentSkills } from "./student-skills";
import { StudentInterests } from "./student-interests";
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
    const aboutMe = student?.aboutMe || "";
    const skills: string[] = student?.skills || [];
    const sectorsOfInterest: string[] = student?.sectorsOfInterest || [];
    const domainsOfInterest: string[] = student?.domainsOfInterest || [];

    return (
        <div className="space-y-6">
            {/* Summary Section */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-semibold text-gray-900">Summary about Me</CardTitle>
                </CardHeader>
                <CardContent>
                    {aboutMe ? (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{aboutMe}</p>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <p className="text-gray-500 text-sm">No summary is currently available for this student.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats Row */}
            <StudentStats allReports={allReports} />

            {/* Skills Section */}
            <StudentSkills skills={skills} />

            {/* Interests Section */}
            <StudentInterests
                sectorsOfInterest={sectorsOfInterest}
                domainsOfInterest={domainsOfInterest}
            />

            {/* Diagnostic & Roadmap */}
            <StudentDiagnostic reportTypes={reportTypes} onTabChange={onTabChange} />
        </div>
    );
}

