"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, X } from "lucide-react";

// ── Key → Label mapping ──

const KEY_LABELS: Record<string, string> = {
    // Diagnostic Interview
    overall_experience: "Overall Experience",
    question_clarity: "Question Clarity",
    helpfulness_rating: "Helpfulness Rating",
    confidence_level: "Confidence Level",
    key_takeaways: "Key Takeaways",
    mentor_recommendations: "Mentor Recommendations",
    clarity_comment: "Clarity Comment",
    self_realization: "Self Realization",
    action_plan: "Action Plan",
    comments: "Comments",
    // Resume Review
    feedback_clarity: "Feedback Clarity",
    interview_preparedness: "Interview Preparedness",
    most_helpful_aspects: "Most Helpful Aspects",
    // Sectoral Workshop
    delivery_rating: "Delivery Rating",
    clarity_rating: "Clarity Rating",
    interest_rating: "Interest Rating",
    // Masterclass
    content_quality_rating: "Content Quality Rating",
    relevance_rating: "Relevance Rating",
    valuable_topic: "Most Valuable Topic",
    actionable_insights: "Actionable Insights",
    clarification_needed: "Clarification Needed",
    // Nested info
    name: "Student Name",
    mentor: "Mentor Name",
    // Role consideration (DI2)
    role_consideration: "Role Consideration",
    confidence_rating: "Confidence Rating",
};

function keyToLabel(key: string): string {
    return KEY_LABELS[key] || key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Normalize feedback — handle nested .feedback wrapper */
function normalizeFeedback(fd: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    // Pull out nested student_details / interview_details
    if (fd.student_details && typeof fd.student_details === "object") {
        for (const [k, v] of Object.entries(fd.student_details)) {
            if (v && String(v).trim()) result[`student_${k}`] = v;
        }
    }
    if (fd.interview_details && typeof fd.interview_details === "object") {
        for (const [k, v] of Object.entries(fd.interview_details)) {
            if (v && String(v).trim()) result[`interview_${k}`] = v;
        }
    }

    // If there's a nested .feedback object, use it; else use top-level
    const core = fd.feedback && typeof fd.feedback === "object" ? fd.feedback : fd;

    for (const [key, value] of Object.entries(core)) {
        if (key === "student_details" || key === "interview_details" || key === "feedback") continue;
        if (value === null || value === undefined) continue;
        if (typeof value === "string" && value.trim() === "") continue;
        result[key] = value;
    }

    return result;
}

/** Render a single feedback value */
function FeedbackValue({ label, value }: { label: string; value: any }) {
    // Numeric ratings (1–5 scale)
    if (typeof value === "number") {
        const isRating = label.toLowerCase().includes("rating") ||
            label.toLowerCase().includes("experience") ||
            label.toLowerCase().includes("clarity") ||
            label.toLowerCase().includes("confidence") ||
            label.toLowerCase().includes("quality") ||
            label.toLowerCase().includes("relevance") ||
            label.toLowerCase().includes("helpfulness");

        if (isRating && value >= 1 && value <= 5) {
            return (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${s <= value
                                    ? "text-orange-400 fill-orange-400"
                                    : "text-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {value}/5
                    </span>
                </div>
            );
        }

        return <span className="text-sm font-semibold text-gray-800">{value}</span>;
    }

    // Yes/No strings
    if (typeof value === "string") {
        const lower = value.trim().toLowerCase();
        if (lower === "yes" || lower === "no") {
            return (
                <Badge
                    className={`text-xs font-medium border-0 ${lower === "yes"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                        }`}
                >
                    {lower === "yes" ? "✓ Yes" : "✗ No"}
                </Badge>
            );
        }

        // Multiline text
        return (
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
                {value}
            </p>
        );
    }

    // Fallback
    return (
        <span className="text-sm text-gray-600">{JSON.stringify(value)}</span>
    );
}

// ── Main Dialog ──

interface FeedbackDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentName: string;
    sessionName: string;
    feedbackData: Record<string, any>;
}

/** Keys that are "info" fields (name, mentor) — shown inline in the Details section */
const INFO_KEYS = new Set([
    "name", "student_name", "mentor", "interview_mentor",
    "student_mentor", "interview_name",
]);

export function FeedbackDetailDialog({
    open,
    onOpenChange,
    studentName,
    sessionName,
    feedbackData,
}: FeedbackDetailDialogProps) {
    const normalized = normalizeFeedback(feedbackData);
    const entries = Object.entries(normalized);

    // Separate into categories
    const ratings: [string, any][] = [];
    const yesNos: [string, any][] = [];
    const infoFields: [string, any][] = [];
    const contentFields: [string, any][] = [];

    for (const [key, value] of entries) {
        const keyLower = key.toLowerCase();
        const isRatingKey = keyLower.includes("rating") ||
            keyLower.includes("experience") ||
            keyLower.includes("clarity") ||
            keyLower.includes("confidence") ||
            keyLower.includes("quality") ||
            keyLower.includes("relevance") ||
            keyLower.includes("helpfulness");

        if (typeof value === "number") {
            ratings.push([key, value]);
        } else if (
            typeof value === "string" &&
            ["yes", "no"].includes(value.trim().toLowerCase()) &&
            !isRatingKey
        ) {
            yesNos.push([key, value]);
        } else if (INFO_KEYS.has(key)) {
            infoFields.push([key, value]);
        } else {
            contentFields.push([key, value]);
        }
    }

    // Build sections array to render separators between them
    const sections: { key: string; content: React.ReactNode }[] = [];

    if (ratings.length > 0) {
        sections.push({
            key: "ratings",
            content: (
                <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Ratings
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {ratings.map(([key, value]) => (
                            <div
                                key={key}
                                className="bg-orange-50/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 space-y-1 sm:space-y-1.5"
                            >
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-tight">
                                    {keyToLabel(key)}
                                </p>
                                <FeedbackValue label={keyToLabel(key)} value={value} />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        });
    }

    if (infoFields.length > 0 || yesNos.length > 0) {
        sections.push({
            key: "details",
            content: (
                <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Details
                    </h4>
                    {/* Info fields shown inline in a row */}
                    {infoFields.length > 0 && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                            {infoFields.map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                                        {keyToLabel(key)}:
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-800">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Yes/No quick responses */}
                    {yesNos.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {yesNos.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 gap-2"
                                >
                                    <p className="text-[10px] sm:text-xs font-medium text-gray-600 leading-tight">
                                        {keyToLabel(key)}
                                    </p>
                                    <FeedbackValue label={keyToLabel(key)} value={value} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ),
        });
    }

    if (contentFields.length > 0) {
        sections.push({
            key: "responses",
            content: (
                <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Responses
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                        {contentFields.map(([key, value]) => (
                            <div
                                key={key}
                                className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 space-y-1 sm:space-y-1.5"
                            >
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-tight">
                                    {keyToLabel(key)}
                                </p>
                                <FeedbackValue label={keyToLabel(key)} value={value} />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="w-[calc(100vw-2rem)] sm:w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] overflow-hidden p-0 rounded-xl flex flex-col">
                {/* ── Sticky Header ── */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 rounded-t-xl">
                    <DialogClose className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg pr-8">
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 shrink-0" />
                            Student Feedback
                        </DialogTitle>
                        <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs sm:text-sm font-medium text-gray-800">
                                {studentName}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-[11px] sm:text-xs text-gray-500">{sessionName}</p>
                        </div>
                    </DialogHeader>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="space-y-0">
                        {sections.map((section, index) => (
                            <div key={section.key}>
                                {index > 0 && (
                                    <hr className="border-gray-200 my-4 sm:my-5" />
                                )}
                                {section.content}
                            </div>
                        ))}

                        {entries.length === 0 && (
                            <p className="text-sm text-gray-400 italic text-center py-6">
                                No feedback data available.
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
