"use client";

import {
  Edit2Icon,
  Loader2,
  Trash2Icon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Student } from "@/lib/validations/batch";

// Re-export for backward compatibility
export type StudentWithId = Student;

// Pagination constants
const ROWS_PER_PAGE = 10;

interface TableWithActionsProps {
  data: StudentWithId[];
  onEdit: (student: StudentWithId) => void;
  onDelete: (student: StudentWithId) => void;
}

export default function TableWithActions({ data, onEdit, onDelete }: TableWithActionsProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentWithId | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages (e.g., after deletion)
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    // Use enrollmentId as fallback key
    const id = studentToDelete.id || studentToDelete.enrollmentId;
    setBusyId(id ?? null);
    setStudentToDelete(null); // Close dialog immediately

    // Simulate async or just wait a tick for UI feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    onDelete(studentToDelete);
    setBusyId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">Inactive</Badge>;
      case "graduated":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Graduated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="h-12 px-6 font-medium text-gray-600">Student Name</TableHead>
            <TableHead className="h-12 px-6 font-medium text-gray-600">ID</TableHead>
            <TableHead className="h-12 px-6 font-medium text-gray-600">Contact</TableHead>
            <TableHead className="h-12 px-6 font-medium text-gray-600 w-[100px]">Gender</TableHead>
            <TableHead className="h-12 px-6 font-medium text-gray-600 text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No students added yet.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((student, index) => {
              // Use startIndex + index for globally unique keys
              const globalIndex = startIndex + index;
              const key = `${globalIndex}-${student.id || student.enrollmentId}`;
              return (
                <TableRow key={key} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                  <TableCell className="px-6 py-4 font-medium text-gray-900">
                    {student.studentName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {student.enrollmentId}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{student.email}</span>
                      <span className="text-xs text-gray-500">{student.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-900 text-sm capitalize">
                    {student.gender || '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => onEdit(student)}
                            >
                              <Edit2Icon className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Student</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setStudentToDelete(student)}
                              disabled={busyId === key}
                            >
                              {busyId === key ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2Icon className="size-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Student</TooltipContent>
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

      {/* Pagination Controls - only show if more than one page */}
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

      <AlertDialog open={!!studentToDelete} onOpenChange={(open: boolean) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Student?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{studentToDelete?.studentName}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
