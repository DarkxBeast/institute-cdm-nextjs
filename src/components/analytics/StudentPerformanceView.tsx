"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    GraduationCap,
    Loader2,
    AlertCircle,
    Users,
    ChevronRight,
    FileText,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getBatchesForUser } from "@/app/actions/batches";
import { getStudentsForBatch, getStudentAllReports, getStudentEngagement } from "@/app/actions/student-analytics";
import { getBatchAnalytics } from "@/app/actions/batch-analytics";
import type { StudentOption, AnalyticsReport, StudentEngagement as StudentEngagementType } from "@/app/actions/student-analytics";
import type { BatchAnalyticsData } from "@/app/actions/batch-analytics";
import OverallPerformance from "./student-analytics/OverallPerformance";
import DiagnosticInterviewAnalytics from "./student-analytics/DiagnosticInterviewAnalytics";
import ResumeReviewAnalytics from "./student-analytics/ResumeReviewAnalytics";
import PracticeInterviewAnalytics from "./student-analytics/PracticeInterviewAnalytics";
import BatchOverview from "./batch-analytics/BatchOverview";
import StudentEngagement from "./student-analytics/StudentEngagement";

// ── Types ──

interface Batch {
    id: string;
    title: string;
}

// ── Component ──

export default function StudentPerformanceView() {
    // Selection state
    const [batches, setBatches] = useState<Batch[]>([]);
    const [batchesLoading, setBatchesLoading] = useState(true);
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");

    const [students, setStudents] = useState<StudentOption[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");

    const [reports, setReports] = useState<AnalyticsReport[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [batchAnalytics, setBatchAnalytics] = useState<BatchAnalyticsData | null>(null);
    const [batchAnalyticsLoading, setBatchAnalyticsLoading] = useState(false);

    const [engagement, setEngagement] = useState<StudentEngagementType | null>(null);
    const [engagementLoading, setEngagementLoading] = useState(false);

    // ── Load Batches ──
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setBatchesLoading(true);
            try {
                const result = await getBatchesForUser();
                if (!cancelled && result.data) {
                    const mapped = result.data.map((b: any) => ({ id: b.id, title: b.title }));
                    setBatches(mapped);
                    // Auto-select if only one batch
                    if (mapped.length === 1) {
                        setSelectedBatchId(mapped[0].id);
                    }
                }
            } catch {
                if (!cancelled) setError("Failed to load batches");
            } finally {
                if (!cancelled) setBatchesLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Load Students + Batch Analytics when batch changes ──
    const loadStudents = useCallback(async (batchId: string) => {
        setStudentsLoading(true);
        setStudents([]);
        setSelectedStudentId("");
        setReports([]);
        try {
            const result = await getStudentsForBatch(batchId);
            if (result.data) setStudents(result.data);
            if (result.error) setError(result.error);
        } catch {
            setError("Failed to load students");
        } finally {
            setStudentsLoading(false);
        }
    }, []);

    const loadBatchAnalytics = useCallback(async (batchId: string) => {
        setBatchAnalyticsLoading(true);
        setBatchAnalytics(null);
        try {
            const result = await getBatchAnalytics(batchId);
            if (result.data) setBatchAnalytics(result.data);
            if (result.error) setError(result.error);
        } catch {
            setError("Failed to load batch analytics");
        } finally {
            setBatchAnalyticsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedBatchId) {
            loadStudents(selectedBatchId);
            loadBatchAnalytics(selectedBatchId);
        }
    }, [selectedBatchId, loadStudents, loadBatchAnalytics]);

    // ── Load Reports when student changes ──
    const loadReports = useCallback(async (studentId: string) => {
        setReportsLoading(true);
        setReports([]);
        setError(null);
        try {
            const result = await getStudentAllReports(studentId);
            if (result.data) setReports(result.data);
            if (result.error) setError(result.error);
        } catch {
            setError("Failed to load reports");
        } finally {
            setReportsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            loadReports(selectedStudentId);
            // Load engagement data
            setEngagementLoading(true);
            setEngagement(null);
            getStudentEngagement(selectedStudentId)
                .then((result) => {
                    if (result.data) setEngagement(result.data);
                })
                .catch(() => { })
                .finally(() => setEngagementLoading(false));
        }
    }, [selectedStudentId, loadReports]);

    // ── Group reports by type ──
    const reportsByType = useMemo(() => {
        const map: Record<string, AnalyticsReport[]> = {};
        for (const r of reports) {
            if (!map[r.reportType]) map[r.reportType] = [];
            map[r.reportType].push(r);
        }
        return map;
    }, [reports]);

    const selectedStudentName = students.find((s) => s.id === selectedStudentId)?.studentName;

    // ── Render ──

    const selectedBatchName = batches.find((b) => b.id === selectedBatchId)?.title;

    return (
        <div className="space-y-6">
            {/* ── Selection Bar ── */}
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        {/* Left: Dropdowns */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Batch Selector */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-orange-50 rounded-xl shrink-0">
                                    <Users className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Batch</p>
                                    {batchesLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                                        </div>
                                    ) : (
                                        <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={batches.length <= 1}>
                                            <SelectTrigger className={`w-[220px] h-9 text-sm ${batches.length <= 1 ? "opacity-70 cursor-default" : ""}`}>
                                                <SelectValue placeholder="Select a batch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {batches.map((b) => (
                                                    <SelectItem key={b.id} value={b.id}>
                                                        {b.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>

                            {/* Chevron */}
                            {selectedBatchId && (
                                <ChevronRight className="hidden sm:block h-4 w-4 text-gray-300 shrink-0" />
                            )}

                            {/* Student Selector */}
                            {selectedBatchId && (
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-violet-50 rounded-xl shrink-0">
                                        <GraduationCap className="h-4 w-4 text-violet-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Student</p>
                                        {studentsLoading ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                                            </div>
                                        ) : students.length === 0 ? (
                                            <p className="text-sm text-gray-400">No students in this batch</p>
                                        ) : (
                                            <Select value={selectedStudentId} onValueChange={(val) => setSelectedStudentId(val === "__none__" ? "" : val)}>
                                                <SelectTrigger className="w-[220px] h-9 text-sm">
                                                    <SelectValue placeholder="Select a student" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__" className="text-gray-500 italic">
                                                        All Students (Batch View)
                                                    </SelectItem>
                                                    {students.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.studentName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Student Info Card */}
                        {selectedStudentId && selectedStudentName && !reportsLoading && (
                            <div className="ml-auto flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {selectedStudentName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedStudentName}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        {selectedBatchName && (
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {selectedBatchName}
                                            </span>
                                        )}
                                        {reports.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" /> {reports.length} report{reports.length > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Error State ── */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* ── Loading State ── */}
            {reportsLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 text-orange-400 animate-spin mb-3" />
                    <p className="text-sm text-gray-500">Loading analytics…</p>
                </div>
            )}

            {/* ── Empty State ── */}
            {!reportsLoading && selectedStudentId && reports.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-center px-6 py-12">
                    <div className="p-5 bg-gray-50 rounded-2xl mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 mb-1">No Reports Yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        {selectedStudentName ?? "This student"} doesn&apos;t have any reports.
                        Analytics will appear once reports are available.
                    </p>
                </div>
            )}

            {/* ── Batch Overview (after batch selected, before student selected) ── */}
            {selectedBatchId && !selectedStudentId && !reportsLoading && (
                batchAnalyticsLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-orange-400 animate-spin mb-3" />
                        <p className="text-sm text-gray-500">Loading batch analytics…</p>
                    </div>
                ) : batchAnalytics ? (
                    <BatchOverview
                        data={batchAnalytics}
                        batchName={batches.find((b) => b.id === selectedBatchId)?.title ?? ""}
                    />
                ) : null
            )}

            {/* ── Prompt State (no batch selected) ── */}
            {!selectedBatchId && !reportsLoading && (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-center px-6 py-12">
                    <div className="p-5 bg-orange-50 rounded-2xl mb-4 border border-orange-100">
                        <GraduationCap className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 mb-1">
                        Student Performance Analytics
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Select a batch to get started.
                    </p>
                </div>
            )}

            {/* ── Analytics Content ── */}
            {!reportsLoading && selectedStudentId && reports.length > 0 && (
                <div className="space-y-10">

                    {/* Overall Performance */}
                    <OverallPerformance reports={reports} />

                    {/* Student Engagement */}
                    {engagementLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 text-orange-400 animate-spin mb-2" />
                            <p className="text-sm text-gray-500">Loading engagement data…</p>
                        </div>
                    ) : engagement ? (
                        <>
                            <hr className="border-gray-100" />
                            <StudentEngagement
                                data={engagement}
                                studentName={selectedStudentName ?? ""}
                            />
                        </>
                    ) : null}

                    {/* Per-Type Sections */}
                    {reportsByType["Diagnostic Interview"] && (
                        <>
                            <hr className="border-gray-100" />
                            <DiagnosticInterviewAnalytics reports={reportsByType["Diagnostic Interview"]} />
                        </>
                    )}

                    {reportsByType["Resume Review"] && (
                        <>
                            <hr className="border-gray-100" />
                            <ResumeReviewAnalytics reports={reportsByType["Resume Review"]} />
                        </>
                    )}

                    {reportsByType["Practice Interview"] && (
                        <>
                            <hr className="border-gray-100" />
                            <PracticeInterviewAnalytics reports={reportsByType["Practice Interview"]} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
