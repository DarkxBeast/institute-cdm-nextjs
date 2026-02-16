"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/providers/notification-provider";
import { deleteBatch } from "@/app/actions/batches";

interface DeleteBatchDialogProps {
    batchId: string;
    batchName: string;
}

export function DeleteBatchDialog({ batchId, batchName }: DeleteBatchDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const { showNotification } = useNotification();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteBatch(batchId);

            if (result.success) {
                showNotification("success", "Batch deleted successfully");
                setOpen(false);
                router.refresh(); // Refresh the list
            } else {
                showNotification("error", result.error || "Failed to delete batch");
            }
        } catch (error) {
            showNotification("error", "An unexpected error occurred");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    className="flex items-center justify-center bg-white border border-[#e0e6eb] text-red-500 w-10 h-10 sm:w-11 sm:h-11 rounded-lg hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-colors active:bg-red-50"
                    aria-label={`Delete ${batchName}`}
                >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Batch?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-medium text-gray-900">"{batchName}"</span>?
                        This action cannot be undone and will permanently delete the batch and all its associated student data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Batch"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
