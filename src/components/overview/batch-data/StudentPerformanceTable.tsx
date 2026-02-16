import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { type Student } from "@/lib/validations/batch";


interface StudentPerformanceTableProps {
    students: Student[];
    batchId: string;
}

const ROWS_PER_PAGE = 10;

export default function StudentPerformanceTable({ students, batchId }: StudentPerformanceTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination calculations
    const totalPages = Math.ceil(students.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const paginatedData = students.slice(startIndex, endIndex);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }



    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">Student Performance Report</h3>
                <p className="text-sm text-gray-500">All students in active batch</p>
            </div>

            {/* ===== DESKTOP TABLE (hidden below md) ===== */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="h-12 px-6 font-medium text-gray-600">Student Name</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600">Email</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600 text-center">Overall Score</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((student, index) => (
                                <TableRow key={student.id || index} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                                        {student.studentName}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-500 text-sm">
                                        {student.email}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm font-semibold bg-gray-50 text-gray-500">
                                            -
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center">
                                        <Link href={`/batches/${batchId}/students/${student.id || ""}?returnTo=overview`}>
                                            <Button
                                                variant="default"
                                                className="bg-[#ff9e44] hover:bg-[#e88d35] text-white text-xs h-8 px-3"
                                            >
                                                View Report
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ===== MOBILE / TABLET CARD LAYOUT (visible below md) ===== */}
            <div className="md:hidden">
                {students.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No students found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {paginatedData.map((student, index) => (
                            <div key={student.id || index} className="p-4 hover:bg-gray-50/50 transition-colors">
                                {/* Row 1: Name + Status */}
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                    <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1 truncate">
                                        {student.studentName}
                                    </h4>
                                    <div className="shrink-0">
                                    </div>
                                </div>

                                {/* Row 2: Email */}
                                <p className="text-xs text-gray-500 mb-2 truncate">{student.email}</p>

                                {/* Row 3: Details grid */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">

                                    <div>
                                        <span className="text-gray-400 block">Enrollment ID</span>
                                        <span className="text-gray-700 font-medium font-mono">{student.enrollmentId || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block">Overall Score</span>
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-50 text-gray-500">
                                            -
                                        </span>
                                    </div>
                                </div>

                                {/* Row 4: Action */}
                                <Link href={`/batches/${batchId}/students/${student.id || ""}?returnTo=overview`} className="w-full sm:w-auto">
                                    <Button
                                        variant="default"
                                        className="bg-[#ff9e44] hover:bg-[#e88d35] text-white text-xs h-8 px-3 w-full"
                                    >
                                        View Report
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs sm:text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, students.length)} of {students.length} students
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="h-8 px-3"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span className="font-medium">{currentPage}</span>
                            <span>/</span>
                            <span className="font-medium">{totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 px-3"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
