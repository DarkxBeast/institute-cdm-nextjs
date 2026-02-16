"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User, Loader2 } from "lucide-react";
import { getStudentReportsByType, type StudentReport } from "@/app/actions/student-reports";
import { DiagnosticInterviewView } from "./diagnostic-interview-view";
import { format, isValid } from "date-fns";

interface StudentReportTabProps {
    studentId: string;
    reportType: string;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isValid(d) ? format(d, "MMM d, yyyy") : "—";
}

export function StudentReportTab({ studentId, reportType }: StudentReportTabProps) {
    const [reports, setReports] = useState<StudentReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        getStudentReportsByType(studentId, reportType).then(({ data, error: err }) => {
            if (cancelled) return;
            setReports(data);
            setError(err);
            setLoading(false);
        });

        return () => { cancelled = true; };
    }, [studentId, reportType]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="ml-2 text-sm text-gray-500">Loading reports…</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="py-8 text-center">
                    <p className="text-sm text-red-600">Failed to load reports: {error}</p>
                </CardContent>
            </Card>
        );
    }

    if (reports.length === 0) {
        return (
            <Card className="border-gray-200">
                <CardContent className="py-12 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No {reportType} reports available yet.</p>
                </CardContent>
            </Card>
        );
    }

    // Use specialized view for diagnostic_interview reports
    // Normalize: lowercase + replace spaces/hyphens with underscores to match any DB format
    const normalizedType = reportType.toLowerCase().replace(/[\s-]/g, "_");
    if (normalizedType === "diagnostic_interview") {
        return <DiagnosticInterviewView reports={reports} />;
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <Card key={report.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-orange-500" />
                                {report.session?.journeyItemTitle ?? report.reportType}
                            </CardTitle>
                            <span className="text-xs text-gray-400">
                                {formatDate(report.createdAt)}
                            </span>
                        </div>
                        {report.session && (
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {report.session.mentorName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(report.session.scheduledDate)}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${report.session.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                    }`}>
                                    {report.session.status}
                                </span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Render report_data fields */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {Object.entries(report.reportData).map(([key, value]) => {
                                // Skip internal/meta fields
                                if (key.startsWith("_")) return null;

                                const label = key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase());

                                return (
                                    <div key={key}>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                                            {label}
                                        </p>
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {typeof value === "object"
                                                ? JSON.stringify(value, null, 2)
                                                : String(value ?? "—")}
                                        </p>
                                    </div>
                                );
                            })}
                            {Object.keys(report.reportData).length === 0 && (
                                <p className="text-sm text-gray-400 italic">No report data available.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
