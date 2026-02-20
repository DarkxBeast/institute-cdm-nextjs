"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { StudentReportSummary } from "@/app/actions/student-reports";
import { toTabValue } from "../student-info-tabs";

interface StudentDiagnosticProps {
    reportTypes?: StudentReportSummary[];
    onTabChange?: (tab: string) => void;
}

export function StudentDiagnostic({ reportTypes = [], onTabChange }: StudentDiagnosticProps) {
    if (reportTypes.length === 0) {
        return (
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Diagnostic & Career Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-gray-500 text-sm">No diagnostic reports or career roadmap items are available for this student yet.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Diagnostic & Career Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {reportTypes.map((item, index) => {
                    // Build a clean title
                    const baseTitle = item.reportType
                        .replace(/[_-]/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());

                    // Same logic as in student-info-tabs to append instance number if needed
                    const sameTypeCount = reportTypes.filter(t => t.reportType === item.reportType).length;
                    const finalTitle = sameTypeCount > 1 ? `${baseTitle} - ${item.instanceNumber}` : baseTitle;

                    return (
                        <div key={`${item.reportType}-${item.journeyItemId}-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full border border-gray-100">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">{finalTitle}</h4>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto text-xs h-8 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                    onTabChange?.(toTabValue(item));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                View Report
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
