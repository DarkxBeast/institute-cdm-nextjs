"use client";

import { StudentStats } from "./student-stats";
import { StudentSkills } from "./student-skills";
import { StudentDiagnostic } from "./student-diagnostic";
import { StudentFeedback } from "./student-feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentOverviewProps {
    student: any;
}

export function StudentOverview({ student }: StudentOverviewProps) {
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
                    <p className="text-gray-600 leading-relaxed">
                        Passionate software engineer with strong problem-solving skills and experience in full-stack development. Actively seeking opportunities in product development and system design. Proficient in React, Node.js, and cloud technologies. Led multiple hackathon teams to victory.
                    </p>
                </CardContent>
            </Card>

            {/* Stats Row */}
            <StudentStats />

            {/* Skills Section */}
            <StudentSkills />

            {/* Diagnostic & Roadmap */}
            <StudentDiagnostic />

            {/* Mentor Feedback */}
            <StudentFeedback />
        </div>
    );
}
