"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Upload, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FileUploader, { ParsedStudent } from "@/components/batches/file-uploader";
import StudentForm, { StudentFormData } from "@/components/batches/student-form";
import TableWithActions from "@/components/batches/table-with-actions";
import { type Student } from "@/lib/validations/batch";
import { useNotification } from "@/components/providers/notification-provider";

interface StudentsManagerProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export function StudentsManager({ students, setStudents }: StudentsManagerProps) {
    const { showNotification } = useNotification();
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);

    // State for editing
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const handleSaveStudent = (data: StudentFormData) => {
        if (editingStudent) {
            // Update existing student
            setStudents(prev => prev.map(s =>
                s.id === editingStudent.id
                    ? { ...data, id: editingStudent.id }
                    : s
            ));
            setEditingStudent(null);
            showNotification("warning", `${data.studentName} has been updated`, "Student Updated");
        } else {
            // Check for duplicate enrollmentId (only if not empty)
            if (data.enrollmentId) {
                const isDuplicate = students.some(s => s.enrollmentId === data.enrollmentId);
                if (isDuplicate) {
                    showNotification("error", `A student with enrollment ID "${data.enrollmentId}" already exists`, "Duplicate Student");
                    return;
                }
            }

            // Add new student
            const newStudent: Student = {
                ...data,
                id: crypto.randomUUID() // Generate a temporary ID
            };
            setStudents(prev => [...prev, newStudent]);
            showNotification("success", `${data.studentName} has been added to the batch`, "Student Added");
        }
        setShowAddStudentForm(false);
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
        setShowAddStudentForm(true);
    };

    const handleDeleteClick = (student: Student) => {
        setStudents(prev => prev.filter(s => s.id !== student.id));
        showNotification("info", `${student.studentName} has been removed from the batch`, "Student Removed");
    };

    const handleImportStudents = (importedStudents: ParsedStudent[]) => {
        // Get existing enrollmentIds
        const existingIds = new Set(students.map(s => s.enrollmentId));

        // Filter out duplicates and track them
        const duplicates: string[] = [];
        const newStudents: Student[] = [];

        importedStudents.forEach(student => {
            // Check for duplicate only if enrollmentId is present
            if (student.enrollmentId && existingIds.has(student.enrollmentId)) {
                duplicates.push(student.enrollmentId);
            } else {
                if (student.enrollmentId) {
                    existingIds.add(student.enrollmentId); // Track new IDs to prevent duplicates within import
                }
                newStudents.push({
                    ...student,
                    id: crypto.randomUUID()
                });
            }
        });

        // Add non-duplicate students
        if (newStudents.length > 0) {
            setStudents(prev => [...prev, ...newStudents]);
            showNotification("success", `Successfully imported ${newStudents.length} student(s)`, "Import Complete");
        }

        // Show warning for duplicates
        if (duplicates.length > 0) {
            showNotification(
                "warning",
                `${duplicates.length} student(s) skipped due to duplicate enrollment IDs: ${duplicates.slice(0, 3).join(", ")}${duplicates.length > 3 ? "..." : ""}`,
                "Duplicates Skipped"
            );
        }

        setShowImportDialog(false);
    };

    const handleDialogChange = (open: boolean) => {
        setShowAddStudentForm(open);
        if (!open) {
            // Reset editing state when dialog closes
            setTimeout(() => setEditingStudent(null), 300); // Small delay to avoid flicker
        }
    };

    return (
        <Card className="border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden">
            {/* Card Header with Actions */}
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 space-y-4 sm:space-y-0 gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                        <Users className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">Students</CardTitle>
                        <p className="text-xs text-gray-500 font-normal">Manage students for this batch</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-gray-200 h-9 text-xs sm:text-sm"
                        onClick={() => setShowImportDialog(true)}
                    >
                        <Upload className="mr-1.5 h-4 w-4" />
                        <span className="hidden xs:inline">Import</span> CSV
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 sm:flex-none bg-[#ff9e44] hover:bg-[#ff8c2e] text-white h-9 text-xs sm:text-sm"
                        onClick={() => {
                            setEditingStudent(null);
                            setShowAddStudentForm(true);
                        }}
                    >
                        <UserPlus className="mr-1.5 h-4 w-4" />
                        <span className="hidden xs:inline">Add</span> Student
                    </Button>
                </div>
            </CardHeader>

            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="sm:max-w-[600px] p-0 border-0 bg-transparent shadow-none">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <DialogHeader className="p-6 border-b border-gray-100">
                            <DialogTitle>Import Students</DialogTitle>
                        </DialogHeader>
                        <div className="p-0">
                            <FileUploader onClose={() => setShowImportDialog(false)} onImport={handleImportStudents} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Content */}
            <div className="p-6">
                {students.length > 0 ? (
                    <TableWithActions
                        data={students}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No students added yet</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-l mx-auto">
                            You can import students from a CSV file or add them manually one by one.
                        </p>
                    </div>
                )}
            </div>

            <Dialog open={showAddStudentForm} onOpenChange={handleDialogChange}>
                <DialogContent className="sm:max-w-[700px] p-0 border-0 bg-transparent shadow-none">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <DialogHeader className="p-6 border-b border-gray-100">
                            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                        </DialogHeader>

                        <div className="p-6">
                            <StudentForm
                                initialData={editingStudent || undefined}
                                key={editingStudent ? editingStudent.id : 'new'} // Force re-render on switch
                                onSubmit={handleSaveStudent}
                                onCancel={() => handleDialogChange(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card >
    );
}
