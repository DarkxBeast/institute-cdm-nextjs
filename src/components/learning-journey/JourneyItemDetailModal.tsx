"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Monitor,
    CheckCircle2,
    AlertCircle,
    FileText,
    ChevronRight,
    User,
    Loader2,
} from "lucide-react";
import { format, isValid, isSameDay } from "date-fns";
import {
    getJourneyItemDetails,
    type JourneyItemDetails,
} from "@/app/actions/journey-item-details";

interface JourneyItemDetailModalProps {
    itemId: string;
    itemName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function JourneyItemDetailModal({
    itemId,
    itemName,
    open,
    onOpenChange,
}: JourneyItemDetailModalProps) {
    const [data, setData] = useState<JourneyItemDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!itemId) return;
        setLoading(true);
        setError(null);
        const result = await getJourneyItemDetails(itemId);
        if (result.error) {
            setError(result.error);
        } else {
            setData(result.data);
        }
        setLoading(false);
    }, [itemId]);

    useEffect(() => {
        if (open) {
            fetchDetails();
        }
    }, [open, fetchDetails]);

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startOk = isValid(start);
        const endOk = isValid(end);
        if (startOk && endOk) {
            return isSameDay(start, end)
                ? format(start, "MMMM d, yyyy")
                : `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
        }
        if (startOk) return format(start, "MMMM d, yyyy");
        if (endOk) return format(end, "MMMM d, yyyy");
        return "TBD";
    };

    const formatDuration = (hours: number) => {
        if (hours <= 0) return "TBD";
        if (hours === 1) return "1 hour";
        if (hours % 1 === 0) return `${hours} hours`;
        return `${hours}h`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[880px] max-h-[90vh] overflow-hidden p-0 gap-0 rounded-2xl flex flex-col"
            >
                {/* ── Header ── */}
                <DialogHeader className="p-6 pb-4 border-b border-[#e0e6eb]">
                    <DialogTitle className="text-2xl font-semibold text-[#1a1a1a]">
                        {itemName}
                    </DialogTitle>
                    <DialogDescription className="text-[#62748e] text-sm">
                        Session Details
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FF9E44]" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                        <p className="text-sm text-[#62748e]">{error}</p>
                    </div>
                ) : data ? (
                    <div className="flex flex-col gap-6 p-8 pt-8 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
                        {/* ── Metadata Bar ── */}
                        <div className="bg-[#f5f7fa] border border-[#e0e6eb] rounded-[14px] p-6">
                            <div className="grid grid-cols-3 gap-6">
                                <MetadataItem
                                    icon={<Calendar className="w-4 h-4 text-[#717182]" />}
                                    label="Date"
                                    value={formatDateRange(data.startDate, data.endDate)}
                                />
                                <MetadataItem
                                    icon={<Clock className="w-4 h-4 text-[#717182]" />}
                                    label="Duration"
                                    value={formatDuration(data.totalHours)}
                                />
                                <MetadataItem
                                    icon={<Monitor className="w-4 h-4 text-[#717182]" />}
                                    label="Mode"
                                    value={`${data.format} ${data.deliveryMode}`}
                                />
                            </div>
                        </div>

                        {/* ── Module Description ── */}
                        {data.moduleDescription && (
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xl font-medium text-[#1a1a1a]">
                                    Module Description
                                </h3>
                                <p className="text-[#62748e] text-base leading-6">
                                    {data.moduleDescription}
                                </p>
                            </div>
                        )}

                        {/* ── Assigned Mentors ── */}
                        {data.mentors.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-medium text-[#1a1a1a]">
                                    Assigned Mentors
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {data.mentors.map((mentor) => (
                                        <div
                                            key={mentor.id}
                                            className="bg-white border border-[#e0e6eb] rounded-[14px] px-4 py-4 flex items-center gap-4"
                                        >
                                            <div className="bg-[#FF9E44] rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <p className="text-base font-medium text-[#1a1a1a] truncate">
                                                    {mentor.fullName}
                                                </p>
                                                <p className="text-sm text-[#62748e] truncate">
                                                    {[
                                                        mentor.expertise?.length > 0
                                                            ? mentor.expertise.slice(0, 2).join(", ")
                                                            : null,
                                                        mentor.experienceYears
                                                            ? `${mentor.experienceYears} experience`
                                                            : null,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ") || "Industry Mentor"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Session Completion Status ── */}
                        {data.totalStudents > 0 && (() => {
                            const completedPct = Math.round((data.completedStudents / data.totalStudents) * 100);
                            const pendingPct = Math.round((data.pendingStudents / data.totalStudents) * 100);
                            const radius = 54;
                            const stroke = 10;
                            const circumference = 2 * Math.PI * radius;

                            return (
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-xl font-medium text-[#1a1a1a]">
                                        Session Completion Status
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Completed */}
                                        <div className="bg-[#dcfce7] border border-[#7bf1a8] rounded-[14px] p-6 flex items-center gap-6">
                                            <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
                                                <svg width="128" height="128" viewBox="0 0 128 128">
                                                    <circle cx="64" cy="64" r={radius} fill="none" stroke="#7bf1a8" strokeWidth={stroke} opacity={0.4} />
                                                    <circle
                                                        cx="64" cy="64" r={radius} fill="none"
                                                        stroke="#008236" strokeWidth={stroke}
                                                        strokeLinecap="round"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={circumference - (circumference * completedPct / 100)}
                                                        transform="rotate(-90 64 64)"
                                                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-semibold text-[#008236]">{completedPct}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-[#008236] uppercase tracking-wider">
                                                    Completed
                                                </span>
                                                {data.completedStudents === 0 ? (
                                                    <p className="text-sm text-[#008236]/70">No completions yet</p>
                                                ) : (
                                                    <>
                                                        <p className="text-2xl font-semibold text-[#008236]">
                                                            {data.completedStudents}<span className="text-base font-normal text-[#008236]/60">/{data.totalStudents}</span>
                                                        </p>
                                                        <p className="text-xs text-[#008236]/80">students completed</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {/* Pending */}
                                        <div className="bg-[#fef3c7] border border-[#fde68a] rounded-[14px] p-6 flex items-center gap-6">
                                            <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
                                                <svg width="128" height="128" viewBox="0 0 128 128">
                                                    <circle cx="64" cy="64" r={radius} fill="none" stroke="#fde68a" strokeWidth={stroke} opacity={0.5} />
                                                    <circle
                                                        cx="64" cy="64" r={radius} fill="none"
                                                        stroke="#d97706" strokeWidth={stroke}
                                                        strokeLinecap="round"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={circumference - (circumference * pendingPct / 100)}
                                                        transform="rotate(-90 64 64)"
                                                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-semibold text-[#d97706]">{pendingPct}%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-[#d97706] uppercase tracking-wider">
                                                    Pending
                                                </span>
                                                {data.pendingStudents === 0 ? (
                                                    <p className="text-sm text-[#d97706]/70">All students completed ✓</p>
                                                ) : (
                                                    <>
                                                        <p className="text-2xl font-semibold text-[#d97706]">
                                                            {data.pendingStudents}<span className="text-base font-normal text-[#d97706]/60">/{data.totalStudents}</span>
                                                        </p>
                                                        <p className="text-xs text-[#d97706]/80">yet to complete</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ── Students Pending Completion Table ── */}
                        {data.pendingStudentsList.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-medium text-[#1a1a1a]">
                                    Students Pending Completion
                                </h3>
                                <div className="bg-white border border-[#e0e6eb] rounded-[14px] overflow-hidden">
                                    <div className="max-h-[256px] overflow-y-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#f5f7fa] border-b border-[#e0e6eb] sticky top-0">
                                                <tr>
                                                    <th className="text-left px-4 py-4 text-xs font-bold text-[#717182] uppercase tracking-wider">
                                                        Student Name
                                                    </th>
                                                    <th className="text-left px-4 py-4 text-xs font-bold text-[#717182] uppercase tracking-wider">
                                                        Enrollment ID
                                                    </th>
                                                    <th className="text-left px-4 py-4 text-xs font-bold text-[#717182] uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.pendingStudentsList.map((student) => (
                                                    <tr
                                                        key={student.studentId}
                                                        className="border-b border-[#e0e6eb] last:border-b-0"
                                                    >
                                                        <td className="px-4 py-4 text-sm text-[#1a1a1a]">
                                                            {student.studentName}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-[#62748e]">
                                                            {student.enrollmentId ?? "—"}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <StatusBadge status={student.status} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                ) : null}

                {/* ── Footer ── */}
                <DialogFooter className="border-t border-[#e0e6eb] p-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="px-6"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ── Sub-components ──

function MetadataItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs text-[#717182] uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-base text-[#1a1a1a]">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isScheduled = status.toLowerCase().startsWith("scheduled");
    const isAbsent = status.toLowerCase() === "absent";

    const bgColor = isAbsent
        ? "bg-red-50 text-red-700"
        : isScheduled
            ? "bg-[#dcfce7] text-[#008236]"
            : "bg-[#dcfce7] text-[#008236]";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}
        >
            {status}
        </span>
    );
}

function ReportCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white border border-[#e0e6eb] rounded-[14px] px-4 py-4 flex items-center gap-4 cursor-pointer hover:border-[#FF9E44]/40 hover:shadow-sm transition-all">
            <div className="bg-[#fff7ed] rounded-[10px] w-12 h-12 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#FF9E44]" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-base font-medium text-[#1a1a1a]">{title}</p>
                <p className="text-sm text-[#62748e]">{description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#62748e] shrink-0" />
        </div>
    );
}
