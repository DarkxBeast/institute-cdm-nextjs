"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MessageSquare,
    Loader2,
    AlertCircle,
    Eye,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    getJourneyItemsForBatch,
    getSessionFeedbacks,
} from "@/app/actions/session-feedbacks";
import type {
    JourneyItemOption,
    StudentFeedbackRow,
} from "@/app/actions/session-feedbacks";
import { FeedbackDetailDialog } from "./FeedbackDetailDialog";

const ROWS_PER_PAGE = 10;

interface StudentFeedbacksSectionProps {
    batches: { id: string; name: string }[];
    selectedBatchId: string;
}

export default function StudentFeedbacksSection({
    batches,
    selectedBatchId,
}: StudentFeedbacksSectionProps) {
    // "all" means fetch across all batches
    const batchId = selectedBatchId === "all" ? undefined : selectedBatchId;

    const [journeyItems, setJourneyItems] = useState<JourneyItemOption[]>([]);
    const [selectedJourneyItem, setSelectedJourneyItem] = useState<string>("");
    const [feedbackRows, setFeedbackRows] = useState<StudentFeedbackRow[]>([]);

    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] =
        useState<StudentFeedbackRow | null>(null);

    // Pagination calculations
    const totalPages = Math.ceil(feedbackRows.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedRows = feedbackRows.slice(startIndex, startIndex + ROWS_PER_PAGE);

    // When batch changes, fetch journey items
    useEffect(() => {
        setJourneyItems([]);
        setSelectedJourneyItem("");
        setFeedbackRows([]);
        setError(null);
        setCurrentPage(1);

        async function loadJourneyItems() {
            setLoadingItems(true);
            const result = await getJourneyItemsForBatch(batchId);
            if (result.error) {
                setError(result.error);
            } else {
                setJourneyItems(result.data || []);
            }
            setLoadingItems(false);
        }
        loadJourneyItems();
    }, [batchId]);

    // When journey item changes, fetch feedbacks
    useEffect(() => {
        setFeedbackRows([]);
        setError(null);
        setCurrentPage(1);

        if (!selectedJourneyItem) return;

        async function loadFeedbacks() {
            setLoadingFeedbacks(true);
            const result = await getSessionFeedbacks(selectedJourneyItem);
            if (result.error) {
                setError(result.error);
            } else {
                setFeedbackRows(result.data || []);
            }
            setLoadingFeedbacks(false);
        }
        loadFeedbacks();
    }, [selectedJourneyItem]);

    const handleViewFeedback = (row: StudentFeedbackRow) => {
        setSelectedFeedback(row);
        setDialogOpen(true);
    };

    return (
        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-0">
                {/* Section Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-50/80 rounded-xl">
                            <MessageSquare className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Student Feedbacks
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                View individual student feedback for each session
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Session Filter */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3 mb-6">
                        {/* Journey Item dropdown */}
                        <Select
                            value={selectedJourneyItem}
                            onValueChange={setSelectedJourneyItem}
                            disabled={loadingItems}
                        >
                            <SelectTrigger className="!w-full sm:!w-[420px] h-10 text-sm bg-slate-50 border-slate-200 focus:ring-orange-500">
                                <SelectValue
                                    placeholder={
                                        loadingItems
                                            ? "Loading sessions…"
                                            : journeyItems.length === 0
                                                ? "No sessions with feedback"
                                                : "Select a session"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="w-[calc(100vw-3rem)] sm:w-[420px]">
                                {journeyItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id} className="w-full">
                                        <div className="flex flex-row items-center w-full min-w-0 overflow-hidden pr-2">
                                            <span className="truncate font-medium flex-1 text-left mr-2">
                                                {item.particulars}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium shrink-0">
                                                ({item.feedbackCount})
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6 border border-red-100">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="break-words font-medium">{error}</span>
                        </div>
                    )}

                    {/* Loading feedbacks */}
                    {loadingFeedbacks && (
                        <div className="flex items-center justify-center py-12 gap-3">
                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                            <span className="text-sm font-medium text-slate-500">
                                Loading feedbacks…
                            </span>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loadingFeedbacks &&
                        selectedJourneyItem &&
                        feedbackRows.length === 0 &&
                        !error && (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <div className="p-3.5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                                    <Users className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-600 mb-1">
                                    No feedbacks found for this session.
                                </p>
                            </div>
                        )}

                    {!selectedJourneyItem && !loadingItems && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <div className="p-3.5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                                <MessageSquare className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-600 mb-1">
                                {journeyItems.length > 0
                                    ? "Select a session to view feedbacks."
                                    : "No sessions with feedback found."}
                            </p>
                        </div>
                    )}

                    {/* Feedbacks Table */}
                    {feedbackRows.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="text-left py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-12">
                                            #
                                        </th>
                                        <th className="text-left py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="text-left py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                            Batch
                                        </th>
                                        <th className="text-right py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-28">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRows.map((row, index) => (
                                        <tr
                                            key={row.attendeeId}
                                            className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-slate-500 font-medium">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-900 max-w-[140px] sm:max-w-none truncate">
                                                {row.studentName}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 font-medium hidden md:table-cell">
                                                {row.batchName}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs font-semibold gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors cursor-pointer h-8 px-3"
                                                    onClick={() => handleViewFeedback(row)}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">View Feedback</span>
                                                    <span className="sm:hidden">View</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white">
                                <p className="text-xs font-medium text-slate-500">
                                    Showing {startIndex + 1}–{Math.min(startIndex + ROWS_PER_PAGE, feedbackRows.length)} of {feedbackRows.length}
                                </p>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => p - 1)}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xs font-semibold text-slate-700 min-w-[3.5rem] text-center">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => p + 1)}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Feedback Detail Dialog */}
            {selectedFeedback && (
                <FeedbackDetailDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    studentName={selectedFeedback.studentName}
                    sessionName={selectedFeedback.sessionName}
                    feedbackData={selectedFeedback.feedbackData}
                />
            )}
        </Card>
    );
}

