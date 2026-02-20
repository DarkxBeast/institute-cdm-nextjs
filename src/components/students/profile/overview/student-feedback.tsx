"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Award, Target } from "lucide-react";
import type { AnalyticsReport } from "@/app/actions/student-analytics";
import { format } from "date-fns";

interface StudentFeedbackProps {
    allReports?: AnalyticsReport[]; // Changed from 'any' to specific array type if you have it
}

export function StudentFeedback({ allReports = [] }: StudentFeedbackProps) {
    // Look for any text comments in the report data
    // Different reports use different keys for mentor comments/feedback
    const feedbacks = allReports
        .map((report) => {
            const data = report.reportData || {};
            // Keys where we usually find feedback
            const feedbackText =
                data.overall_impression ||
                data.key_remarks ||
                data.comments ||
                data.recommendations ||
                "";

            return {
                id: report.id,
                date: report.createdAt ? format(new Date(report.createdAt), 'MMM dd, yyyy') : 'Unknown Date',
                role: "Mentor", // Or whatever we can glean from the report type
                author: report.mentorName || "Unknown Mentor",
                content: feedbackText,
                highlights: [
                    report.journeyItemName || report.reportType.replace(/[_-]/g, " "),
                ]
            };
        })
        .filter((fb) => fb.content.trim().length > 0);

    if (feedbacks.length === 0) {
        return (
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Mentor Feedback</CardTitle>
                    <CardDescription>Recent feedback and reviews from mentors</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-gray-500 text-sm">No mentor feedback is currently available for this student.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Mentor Feedback</CardTitle>
                <CardDescription>Recent feedback and reviews from mentors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {feedbacks.map((feedback, index) => (
                    <div key={feedback.id || index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-gray-900">{feedback.author}</h4>
                                <p className="text-xs text-gray-500">{feedback.role} • {feedback.date}</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-full border border-orange-100 mt-1 sm:mt-0">
                                <MessageSquare className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed italic">
                            "{feedback.content}"
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {feedback.highlights.map((highlight, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <ThumbsUp className="h-3 w-3" />
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
