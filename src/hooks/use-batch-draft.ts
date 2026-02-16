"use client";

import { useState, useEffect, useCallback } from "react";
import {
    batchDraftSchema,
    type BatchInfo,
    type Student,
    type BatchDraft
} from "@/lib/validations/batch";

// Storage key for batch creation draft
const STORAGE_KEY = "batch-creation-draft";

// Re-export types for convenience
export type { BatchInfo as BatchFormData, Student as StudentData };

const defaultBatchInfo: BatchInfo = {
    batchName: "",

    startDate: "",
    endDate: "",
    status: "",
    description: "",
    department: "",
};

/**
 * Custom hook that persists batch creation data to localStorage.
 * Data is automatically saved on changes and restored on mount.
 */
export function useBatchDraft() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [batchInfo, setBatchInfoState] = useState<BatchInfo>(defaultBatchInfo);
    const [students, setStudentsState] = useState<Student[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const draft: BatchDraft = JSON.parse(stored);
                // Merge with defaults to ensure all fields exist
                if (draft.batchInfo) {
                    setBatchInfoState({ ...defaultBatchInfo, ...draft.batchInfo });
                }
                if (draft.students) setStudentsState(draft.students);
            }
        } catch (error) {
            console.error("Failed to load batch draft from localStorage:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever data changes (after initial load)
    useEffect(() => {
        if (!isLoaded) return;

        try {
            const draft: BatchDraft = { batchInfo, students };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch (error) {
            console.error("Failed to save batch draft to localStorage:", error);
        }
    }, [batchInfo, students, isLoaded]);

    // Wrapper for setBatchInfo
    const setBatchInfo = useCallback((data: BatchInfo | ((prev: BatchInfo) => BatchInfo)) => {
        setBatchInfoState(data);
    }, []);

    // Wrapper for setStudents
    const setStudents = useCallback((data: Student[] | ((prev: Student[]) => Student[])) => {
        setStudentsState(data);
    }, []);

    // Clear all draft data from localStorage
    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setBatchInfoState(defaultBatchInfo);
            setStudentsState([]);
        } catch (error) {
            console.error("Failed to clear batch draft from localStorage:", error);
        }
    }, []);

    return {
        batchInfo,
        setBatchInfo,
        students,
        setStudents,
        clearDraft,
        isLoaded,
    };
}
