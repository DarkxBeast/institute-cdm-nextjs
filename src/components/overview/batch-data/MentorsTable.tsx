"use client";

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
import { Button } from "@/components/ui/button";

interface Mentor {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    specialization: string[];
    status: string;
}

const ROWS_PER_PAGE = 10;

interface MentorsTableProps {
    mentors?: Mentor[];
}

export default function MentorsTable({ mentors = [] }: MentorsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination calculations
    const totalPages = Math.ceil(mentors.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const paginatedData = mentors.slice(startIndex, endIndex);

    const getStatusBadge = (status: string) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${status === 'active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
            {status}
        </span>
    );

    return (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">Mentor Management</h3>
                <p className="text-sm text-gray-500">Admin shortlisted mentors for institution review</p>
            </div>

            {/* ===== DESKTOP TABLE (hidden below md) ===== */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="h-12 px-6 font-medium text-gray-600">Mentor Name</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600">Email</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600">Specialization</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600 text-center">Status</TableHead>
                            <TableHead className="h-12 px-6 font-medium text-gray-600 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No mentors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((mentor) => (
                                <TableRow key={mentor.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                                        {mentor.fullName}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-900 text-sm">
                                        {mentor.email || '—'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {mentor.specialization && mentor.specialization.length > 0
                                                ? mentor.specialization.map((s, i) => (
                                                    <span key={i} className="inline-block bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 text-xs">{s}</span>
                                                ))
                                                : <span className="text-gray-400 text-sm">—</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center">
                                        {getStatusBadge(mentor.status)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center">
                                        <Button
                                            variant="default"
                                            className="bg-[#ff9e44] hover:bg-[#e88d35] text-white text-xs h-8 px-3"
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ===== MOBILE / TABLET CARD LAYOUT (visible below md) ===== */}
            <div className="md:hidden">
                {mentors.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No mentors found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {paginatedData.map((mentor) => (
                            <div key={mentor.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                {/* Row 1: Name + Status */}
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                    <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1 truncate">
                                        {mentor.fullName}
                                    </h4>
                                    <div className="shrink-0">
                                        {getStatusBadge(mentor.status)}
                                    </div>
                                </div>

                                {/* Row 2: Email */}
                                {mentor.email && (
                                    <p className="text-xs text-gray-500 mb-2 truncate">{mentor.email}</p>
                                )}

                                {/* Row 3: Specialization pills */}
                                {mentor.specialization && mentor.specialization.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {mentor.specialization.map((s, i) => (
                                            <span key={i} className="inline-block bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 text-xs">{s}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Row 4: Action */}
                                <Button
                                    variant="default"
                                    className="bg-[#ff9e44] hover:bg-[#e88d35] text-white text-xs h-8 px-3 w-full sm:w-auto"
                                >
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                    <div className="text-xs sm:text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, mentors.length)} of {mentors.length} mentors
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
