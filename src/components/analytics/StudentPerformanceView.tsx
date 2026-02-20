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
import { StudentSkeleton, BatchOverviewSkeleton } from "./AnalyticsSkeletons";

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
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        {/* Left: Dropdowns */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Batch Selector */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 bg-orange-50/80 rounded-xl shrink-0">
                                    <Users className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Batch</p>
                                    {batchesLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium pt-1">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                                        </div>
                                    ) : (
                                        <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={batches.length <= 1}>
                                            <SelectTrigger className={`w-[220px] h-9 text-sm font-medium border-slate-200 shadow-sm rounded-lg ${batches.length <= 1 ? "opacity-70 cursor-default" : ""}`}>
                                                <SelectValue placeholder="Select a batch" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                {batches.map((b) => (
                                                    <SelectItem key={b.id} value={b.id} className="rounded-lg cursor-pointer">
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
                                <ChevronRight className="hidden sm:block h-5 w-5 text-slate-300 shrink-0" />
                            )}

                            {/* Student Selector */}
                            {selectedBatchId && (
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2.5 bg-violet-50/80 rounded-xl shrink-0">
                                        <GraduationCap className="h-5 w-5 text-violet-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Student</p>
                                        {studentsLoading ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium pt-1">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                                            </div>
                                        ) : students.length === 0 ? (
                                            <p className="text-sm text-slate-400 font-medium pt-1">No students in this batch</p>
                                        ) : (
                                            <Select value={selectedStudentId} onValueChange={(val) => setSelectedStudentId(val === "__none__" ? "" : val)}>
                                                <SelectTrigger className="w-[220px] h-9 text-sm font-medium border-slate-200 shadow-sm rounded-lg">
                                                    <SelectValue placeholder="Select a student" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[300px]">
                                                    <SelectItem value="__none__" className="text-slate-500 italic rounded-lg cursor-pointer font-medium">
                                                        Overview (Batch Level)
                                                    </SelectItem>
                                                    {students.map((s) => (
                                                        <SelectItem key={s.id} value={s.id} className="rounded-lg cursor-pointer">
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
                            <div className="mt-2 lg:mt-0 lg:ml-auto flex w-full sm:w-fit items-center gap-3.5 bg-slate-50/80 rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold tracking-wider shadow-sm shrink-0">
                                    {selectedStudentName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{selectedStudentName}</p>
                                    <div className="flex items-center gap-3.5 text-[11px] font-medium text-slate-500 mt-0.5">
                                        {selectedBatchName && (
                                            <span className="flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5 text-slate-400" /> <span className="truncate max-w-[120px]">{selectedBatchName}</span>
                                            </span>
                                        )}
                                        {reports.length > 0 && (
                                            <span className="flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5 text-slate-400" /> {reports.length} report{reports.length > 1 ? "s" : ""}
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
            {reportsLoading && <StudentSkeleton />}

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
                    <BatchOverviewSkeleton />
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
