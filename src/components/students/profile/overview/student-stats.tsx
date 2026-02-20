"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { AnalyticsReport } from "@/app/actions/student-analytics";

interface StudentStatsProps {
    allReports?: AnalyticsReport[];
}

export function StudentStats({ allReports = [] }: StudentStatsProps) {
    // 1. Calculate Average Rating
    let averageRating = 0;
    let ratingCount = 0;

    allReports.forEach((report) => {
        const data = report.reportData || {};
        let rating: number | null = null;

        if (data.meta && typeof data.meta === 'object' && typeof data.meta.overall_rating === 'number') {
            rating = data.meta.overall_rating;
        } else if (typeof data.overall_rating === 'number') {
            rating = data.overall_rating;
        } else if (typeof data.overall_experience === 'number') {
            rating = data.overall_experience; // Fallback for some interview types
        }

        if (rating !== null) {
            averageRating += rating;
            ratingCount++;
        }
    });

    const finalRating = ratingCount > 0 ? (averageRating / ratingCount).toFixed(1) : "N/A";
    const numRating = parseFloat(finalRating);

    // 2. Calculate Learner's Readiness
    let readiness = "N/A";
    let readinessColorClass = "bg-gray-200";
    let readinessWidth = "w-0";

    if (!isNaN(numRating)) {
        if (numRating >= 4.0) {
            readiness = "High";
            readinessColorClass = "bg-emerald-500";
            readinessWidth = "w-[85%]";
        } else if (numRating >= 3.0) {
            readiness = "Medium";
            readinessColorClass = "bg-yellow-500";
            readinessWidth = "w-[50%]";
        } else {
            readiness = "Low";
            readinessColorClass = "bg-red-500";
            readinessWidth = "w-[25%]";
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Average Rating of Learner</p>
                <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-3xl font-bold text-gray-900">{finalRating}</span>
                </div>
                <p className="text-xs text-gray-400">out of 5.0</p>
            </Card>

            <Card className="p-6 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Learner's Readiness</p>
                <span className="text-3xl font-bold text-gray-900">{readiness}</span>
                {readiness !== "N/A" && (
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1 max-w-[120px]">
                        <div className={`h-full ${readinessColorClass} ${readinessWidth}`} />
                    </div>
                )}
            </Card>
        </div >
    );
}
