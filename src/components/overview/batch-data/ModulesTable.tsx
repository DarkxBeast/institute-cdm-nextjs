"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, LayoutList } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import type { MentorInfo } from "@/app/actions/learning-journey";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Module interface used by the table
interface Module {
    id: string;
    name: string;
    mentors: string;
    startDate: string;
    endDate: string;
    duration: string;
    format: string;
    mode: "Offline" | "Online";
    avgScore: number | string;
    status: "Completed" | "In Progress" | "Scheduled" | "Yet to Schedule";
}

// Learning journey item shape (matches server action output)
interface LearningJourneyItem {
    id: string;
    particulars: string;
    startDate: string;
    endDate: string;
    status: string;
    deliveryMode: string;
    format: string;
    totalHours: number;
    averageRating: number | null;
    sequenceOrder: number;
    category: string;
    mentors?: MentorInfo[];
}

const ROWS_PER_PAGE = 10;

interface ModulesTableProps {
    learningJourneyItems?: LearningJourneyItem[] | null;
}

function mapStatusToModule(status: string): "Completed" | "In Progress" | "Scheduled" | "Yet to Schedule" {
    switch (status) {
        case "Completed": return "Completed";
        case "Ongoing": return "In Progress";
        case "Yet to Schedule": return "Yet to Schedule";
        default: return "Scheduled";
    }
}

function formatModuleDate(dateStr: string): string {
    try {
        return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
        return dateStr;
    }
}

function calculateDurationDays(start: string, end: string): string {
    try {
        const s = new Date(start);
        const e = new Date(end);
        const diffDays = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
        return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } catch {
        return "N/A";
    }
}

export default function ModulesTable({ learningJourneyItems }: ModulesTableProps) {
    const [currentPage, setCurrentPage] = useState(1);


    // Map learning journey items to Module interface when available
    const modules: Module[] = useMemo(() => {
        if (learningJourneyItems && learningJourneyItems.length > 0) {
            return learningJourneyItems.map((item) => {
                // Build mentor display string
                const sortedMentors = [...(item.mentors ?? [])];
                const mentorStr = sortedMentors.length > 0
                    ? sortedMentors.map(m => m.fullName).join(', ')
                    : '—';

                return {
                    id: item.id,
                    name: item.particulars,
                    mentors: mentorStr,
                    startDate: formatModuleDate(item.startDate),
                    endDate: formatModuleDate(item.endDate),
                    duration: item.totalHours > 0 ? `${item.totalHours}h` : calculateDurationDays(item.startDate, item.endDate),
                    format: item.format || "Session",
                    mode: (item.deliveryMode === "Online" ? "Online" : "Offline") as "Online" | "Offline",
                    avgScore: item.averageRating ?? "—",
                    status: mapStatusToModule(item.status),
                };
            });
        }
        return [];
    }, [learningJourneyItems]);

    // Pagination calculations
    const totalPages = Math.ceil(modules.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const paginatedData = modules.slice(startIndex, endIndex);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 shadow-none font-normal"><span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></span>Completed</Badge>;
            case "In Progress":
                return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200 shadow-none font-normal"><span className="w-1.5 h-1.5 rounded-full bg-yellow-600 mr-2"></span>In Progress</Badge>;
            case "Scheduled":
                return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 shadow-none font-normal"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>Scheduled</Badge>;
            case "Yet to Schedule":
                return <Badge className="bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200 shadow-none font-normal"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>Yet to Schedule</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getModeBadge = (mode: string) => {
        return <Badge variant="secondary" className={`${mode === 'Online' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'} hover:bg-opacity-100 shadow-none font-normal border`}>{mode}</Badge>;
    };

    return (
        <TooltipProvider>
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header — stacks on small screens */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Module Timeline & Schedule</h3>
                        <p className="text-sm text-gray-500">Detailed schedule for selected batch</p>
                    </div>
                </div>

                <>
                    {/* ===== DESKTOP TABLE (hidden below lg) ===== */}
                    <div className="hidden lg:block">
                        <Table className="table-fixed">
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="hover:bg-transparent border-b border-gray-100">
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 w-[19%]">Module Name</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 w-[14%]">Mentor(s)</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[10%]">Start Date</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[10%]">End Date</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[8%]">Duration</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[8%]">Format</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[9%]">Mode</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[8%]">Avg Score</TableHead>
                                    <TableHead className="h-12 px-6 font-medium text-gray-600 text-center w-[13%]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                                            No modules found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedData.map((module) => (
                                        <TableRow key={module.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <TableCell className="px-6 py-4 font-medium text-gray-900">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="block truncate max-w-full cursor-default">{module.name}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>{module.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-500 text-sm">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="block truncate max-w-full cursor-default">{module.mentors}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>{module.mentors}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-900 text-sm text-center">
                                                {module.startDate}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-900 text-sm text-center">
                                                {module.endDate}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5 text-gray-900 text-sm">
                                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                    {module.duration}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-900 text-sm text-center font-mono bg-gray-50/50 rounded-sm">
                                                {module.format}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                {getModeBadge(module.mode)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-900 text-sm text-center font-medium">
                                                {module.avgScore}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {getStatusBadge(module.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ===== MOBILE / TABLET CARD LAYOUT (visible below lg) ===== */}
                    <div className="lg:hidden">
                        {modules.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">No modules found.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {paginatedData.map((module) => (
                                    <div key={module.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                        {/* Row 1: Name + Status */}
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h4 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
                                                {module.name}
                                            </h4>
                                            <div className="shrink-0">
                                                {getStatusBadge(module.status)}
                                            </div>
                                        </div>

                                        {/* Row 2: Mentor */}
                                        {module.mentors !== "—" && (
                                            <p className="text-xs text-gray-500 mb-3 truncate">
                                                Mentor: {module.mentors}
                                            </p>
                                        )}

                                        {/* Row 3: Key details grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                                            <div>
                                                <span className="text-gray-400 block">Start</span>
                                                <span className="text-gray-700 font-medium">{module.startDate}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">End</span>
                                                <span className="text-gray-700 font-medium">{module.endDate}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">Duration</span>
                                                <span className="text-gray-700 font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                    {module.duration}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block">Format</span>
                                                <span className="text-gray-700 font-medium font-mono">{module.format}</span>
                                            </div>
                                        </div>

                                        {/* Row 4: Mode + Avg Score */}
                                        <div className="flex items-center gap-3 mt-3">
                                            {getModeBadge(module.mode)}
                                            {module.avgScore !== "—" && (
                                                <span className="text-xs text-gray-500">
                                                    Avg Score: <span className="font-medium text-gray-700">{module.avgScore}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                            <div className="text-xs sm:text-sm text-gray-500">
                                Showing {startIndex + 1} to {Math.min(endIndex, modules.length)} of {modules.length} modules
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 px-2 md:px-3"
                                >
                                    <ChevronLeft className="h-4 w-4 md:mr-1" />
                                    <span className="hidden md:inline">Previous</span>
                                </Button>
                                <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                                    <span className="font-medium">{currentPage}</span>
                                    <span>/</span>
                                    <span className="font-medium">{totalPages}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 px-2 md:px-3"
                                >
                                    <span className="hidden md:inline">Next</span>
                                    <ChevronRight className="h-4 w-4 md:ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            </div>
        </TooltipProvider>
    );
}
