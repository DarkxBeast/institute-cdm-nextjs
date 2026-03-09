"use client";

import {
    FileText,
    ChevronLeft,
    ChevronRight,
    Search,
    Eye
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface StudentsTableProps {
    data: StudentWithId[];
    batchId: string;
}

export default function StudentsTable({ data, batchId }: StudentsTableProps) {
    const { showNotification } = useNotification();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter students based on search query
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return data;

        const query = searchQuery.toLowerCase();
        return data.filter(student =>
            (student.studentName && student.studentName.toLowerCase().includes(query)) ||
            (student.email && student.email.toLowerCase().includes(query))
        );
    }, [data, searchQuery]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredStudents.slice(startIndex, endIndex);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const handleViewFile = (student: StudentWithId) => {
        router.push(`/batches/${batchId}/students/${student.id || student.enrollmentId}?returnTo=batches`);
    };



    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex justify-end">
                <div className="relative w-full sm:w-64 md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-9 bg-white border-gray-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on new search
                        }}
                    />
                </div>
            </div>
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
                    {filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                No students found.
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
                    <div className="flex items-center gap-4">
                        <div className="text-xs md:text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500">Rows per page:</span>
                            <Select
                                value={rowsPerPage.toString()}
                                onValueChange={(val) => {
                                    setRowsPerPage(Number(val));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px] text-xs">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
