"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, BookOpen, Users, Loader2 } from "lucide-react";
import { BatchDetailsForm } from "@/app/(dashboard)/batches/add/sections/batch-details-form";
import { StudentsManager } from "@/app/(dashboard)/batches/add/sections/students-manager";
import { updateBatch } from "@/app/actions/batches";
import { validateBatchInfo, type BatchInfo, type Student } from "@/lib/validations/batch";
import { useNotification } from "@/components/providers/notification-provider";

interface EditBatchClientProps {
    batchId: string;
    initialBatchInfo: BatchInfo;
    initialStudents: Student[];
}

export default function EditBatchClient({ batchId, initialBatchInfo, initialStudents }: EditBatchClientProps) {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState<"info" | "students">("info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State
    const [batchInfo, setBatchInfo] = useState<BatchInfo>(initialBatchInfo);
    const [students, setStudents] = useState<Student[]>(initialStudents);

    const handleSubmit = async () => {
        // Validate batch info
        const validation = validateBatchInfo(batchInfo);
        if (!validation.valid) {
            const firstError = Object.values(validation.errors || {})[0];
            showNotification("error", firstError || "Please fill in all required fields", "Validation Error");
            setActiveTab("info");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await updateBatch(batchId, batchInfo, students);

            if (result.success) {
                showNotification("success", "Batch updated successfully!", "Success");
                router.push("/batches");
                router.refresh(); // Refresh to update list
            } else {
                showNotification("error", result.error || "Failed to update batch", "Error");
            }
        } catch (error) {
            console.error("Error updating batch:", error);
            showNotification("error", "An unexpected error occurred", "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/batches");
    };

    return (
        <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Header Section */}
                <div className="space-y-6">
                    {/* Back Button */}
                    <button
                        onClick={handleCancel}
                        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Batches</span>
                    </button>

                    {/* Title and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                Edit Batch
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500">
                                Update batch details and manage student enrollments.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none border-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none bg-[#ff9e44] hover:bg-[#ff8c2e] text-white shadow-sm disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Batch
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="inline-flex w-full sm:w-auto rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "info"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            Batch Info
                        </button>
                        <button
                            onClick={() => setActiveTab("students")}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "students"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            Students <span className="text-xs bg-[#ff9e44] px-1.5 py-0.5 rounded-full ml-1 text-white">{students.length}</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {activeTab === "info" && (
                        <BatchDetailsForm
                            formData={batchInfo}
                            setFormData={setBatchInfo}
                        />
                    )}

                    {activeTab === "students" && (
                        <StudentsManager students={students} setStudents={setStudents} />
                    )}
                </div>
            </div>
        </div>
    );
}
