import { z } from "zod";

// ============================================
// Student Schema
// ============================================

export const studentSchema = z.object({
    id: z.string().optional(),
    studentName: z
        .string()
        .min(2, "Student name must be at least 2 characters"),
    enrollmentId: z.string().optional().or(z.literal("")),
    email: z
        .string()
        .email("Invalid email format"),
    phoneNumber: z.string().optional().default(""),
    gender: z
        .enum(["", "male", "female", "other"])
        .optional()
        .default(""),
    overallScore: z.string().optional(),
    aboutMe: z.string().optional().default(""),
    skills: z.array(z.string()).optional().default([]),
    sectorsOfInterest: z.array(z.string()).optional().default([]),
    domainsOfInterest: z.array(z.string()).optional().default([]),
});

// Schema for form input (before adding id)
export const studentFormSchema = studentSchema.omit({ id: true });

// Type definitions
export type Student = z.infer<typeof studentSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;

// ============================================
// Batch Info Schema
// ============================================

export const batchInfoBaseSchema = z.object({
    batchName: z
        .string()
        .min(2, "Batch name must be at least 2 characters"),

    startDate: z
        .string()
        .min(1, "Start date is required"),
    endDate: z
        .string()
        .min(1, "End date is required"),
    status: z
        .enum(["", "upcoming", "active", "completed"])
        .optional()
        .default(""),
    description: z.string().optional().default(""),
    department: z.string().min(1, "Department is required"),
});

export const batchInfoSchema = batchInfoBaseSchema.refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export type BatchInfo = z.infer<typeof batchInfoSchema>;

// ============================================
// Batch Draft Schema (for localStorage)
// ============================================

export const batchDraftSchema = z.object({
    // Use base schema for partial to avoid validaton errors on draft load
    batchInfo: batchInfoBaseSchema.partial(),
    students: z.array(studentSchema),
});

export type BatchDraft = z.infer<typeof batchDraftSchema>;

// ============================================
// Validation Helpers
// ============================================

/**
 * Safely parse data with a Zod schema, returning null on failure
 */
export function safeParse<T>(schema: z.ZodType<T>, data: unknown): T | null {
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Validate student data and return errors
 */
export function validateStudent(data: unknown): {
    valid: boolean;
    data?: StudentFormData;
    errors?: Record<string, string>;
} {
    const result = studentFormSchema.safeParse(data);

    if (result.success) {
        return { valid: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() || "unknown";
        errors[field] = issue.message;
    });

    return { valid: false, errors };
}

/**
 * Validate batch info and return errors
 */
export function validateBatchInfo(data: unknown): {
    valid: boolean;
    data?: BatchInfo;
    errors?: Record<string, string>;
} {
    const result = batchInfoSchema.safeParse(data);

    if (result.success) {
        return { valid: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() || "unknown";
        errors[field] = issue.message;
    });

    return { valid: false, errors };
}
