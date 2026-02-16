"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Plus, BookOpen, Users, Loader2 } from "lucide-react";
import { BatchDetailsForm } from "./sections/batch-details-form";
import { StudentsManager } from "./sections/students-manager";
import { useBatchDraft } from "@/hooks/use-batch-draft";
import { createBatch } from "@/app/actions/batches";
import { validateBatchInfo } from "@/lib/validations/batch";
import { useNotification } from "@/components/providers/notification-provider";

export default function AddBatchPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"info" | "students">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom hook for persisted state
  const { batchInfo, setBatchInfo, students, setStudents, clearDraft, isLoaded } = useBatchDraft();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const result = await createBatch(batchInfo, students);

      if (result.success) {
        showNotification("success", "Batch created successfully!", "Success");
        clearDraft();
        router.push("/batches");
      } else {
        showNotification("error", result.error || "Failed to create batch", "Error");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      showNotification("error", "An unexpected error occurred", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearDraft();
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
                Add New Batch
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Configure batch details and manage student enrollments.
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Batch
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs defaultValue="info" value={activeTab} onValueChange={(value) => setActiveTab(value as "info" | "students")} className="w-full">
            <TabsList className="mb-8 w-full sm:w-auto justify-center sm:justify-start">
              <TabsTrigger value="info" className="flex-1 sm:flex-none">
                <BookOpen className="h-4 w-4 mr-2" />
                Batch Info
              </TabsTrigger>
              <TabsTrigger value="students" className="flex-1 sm:flex-none">
                <Users className="h-4 w-4 mr-2" />
                Students
                {students.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ml-1 ${activeTab === "students"
                    ? "bg-white/20 text-white"
                    : "bg-orange-100 text-orange-700"
                    }`}>
                    {students.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="info">
                <BatchDetailsForm
                  formData={batchInfo}
                  setFormData={setBatchInfo}
                />
              </TabsContent>

              <TabsContent value="students">
                <StudentsManager students={students} setStudents={setStudents} />
              </TabsContent>
            </div>
          </Tabs>
        </div>


      </div>
    </div>
  );
}
