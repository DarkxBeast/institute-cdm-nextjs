"use client";

import {
    FileText,
    ChevronLeft,
    ChevronRight,
    Eye
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Student } from "@/lib/validations/batch";
import { useNotification } from "@/components/providers/notification-provider";

// Re-export for backward compatibility
export type StudentWithId = Student;

// Pagination constants
const ROWS_PER_PAGE = 10;

interface StudentsTableProps {
    data: StudentWithId[];
    batchId: string;
}

export default function StudentsTable({ data, batchId }: StudentsTableProps) {
    const { showNotification } = useNotification();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination calculations
    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const handleViewFile = (student: StudentWithId) => {
        router.push(`/batches/${batchId}/students/${student.id || student.enrollmentId}?returnTo=batches`);
    };



    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent border-b border-gray-100">
                        <TableHead className="h-12 px-6 font-medium text-gray-600">Student Name</TableHead>
                        <TableHead className="h-12 px-6 font-medium text-gray-600">ID</TableHead>
                        <TableHead className="h-12 px-6 font-medium text-gray-600">Contact</TableHead>

                        <TableHead className="h-12 px-6 font-medium text-gray-600 text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                No students enrolled in this batch.
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((student, index) => {
                            const globalIndex = startIndex + index;
                            const key = `${globalIndex}-${student.id || student.enrollmentId}`;
                            return (
                                <TableRow key={key} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                                        {student.studentName}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-500 font-mono text-xs">
                                        {student.enrollmentId || '-'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">{student.email}</span>
                                            <span className="text-xs text-gray-500">{student.phoneNumber}</span>
                                        </div>
                                    </TableCell>


                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-2 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                                                            onClick={() => handleViewFile(student)}
                                                        >
                                                            <FileText className="size-3.5" />
                                                            <span className="text-xs">File</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>View Student File</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs md:text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} students
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
                            <span className="hidden md:inline">Page</span>
                            <span className="font-medium">{currentPage}</span>
                            <span className="hidden md:inline">of</span>
                            <span className="md:hidden">/</span>
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
        </div>
    );
}
