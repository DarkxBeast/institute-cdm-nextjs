"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface JourneyItem {
    id: string;
    particulars: string;
    startDate: string;
    status: string;
    category: string;
}

interface StudentJourneyProps {
    items?: JourneyItem[];
}

export function StudentJourney({ items = [] }: StudentJourneyProps) {
    // Map API status to UI styling
    const getStatusConfig = (status: string) => {
        const normalized = status.toLowerCase();
        if (normalized === "completed") {
            return {
                label: "Completed",
                color: "bg-emerald-100 text-emerald-700",
                dotColor: "bg-emerald-500",
                ringColor: "bg-emerald-100",
            };
        }
        if (normalized === "ongoing" || normalized === "in progress") {
            return {
                label: "In Progress",
                color: "bg-amber-100 text-amber-700",
                dotColor: "bg-amber-500",
                ringColor: "bg-amber-100",
            };
        }
        return {
            label: status || "Pending",
            color: "bg-gray-100 text-gray-500",
            dotColor: "bg-white border-2 border-gray-300",
            ringColor: "bg-gray-100",
        };
    };

    const displayItems = items.length > 0 ? items : [];

    return (
        <Card className="h-full border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Student Journey</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-0 max-h-[400px] sm:max-h-[720px] overflow-y-auto pr-2">
                    {displayItems.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No journey items found.</p>
                    ) : (
                        displayItems.map((step, index) => {
                            const config = getStatusConfig(step.status);
                            const isLast = index === displayItems.length - 1;

                            // Format date if valid
                            let dateStr = "";
                            if (step.startDate) {
                                try {
                                    dateStr = new Date(step.startDate).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    });
                                } catch (e) {
                                    dateStr = step.startDate;
                                }
                            }

                            return (
                                <div key={step.id || index} className={`flex gap-3 relative ${!isLast ? "pb-8" : ""}`}>
                                    {/* Vertical Line */}
                                    {!isLast && (
                                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
                                    )}

                                    {/* Icon/Dot */}
                                    <div className="relative z-10 flex-none">
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${config.ringColor}`}>
                                            <div className={`h-3 w-3 rounded-full ${config.dotColor}`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-0.5">
                                        <h4 className="font-medium text-sm text-gray-900">{step.particulars}</h4>
                                        {dateStr && <p className="text-xs text-gray-500 mt-1 mb-2">{dateStr}</p>}
                                        <Badge variant="secondary" className={`mt-1 font-normal text-xs px-2.5 py-0.5 rounded-full ${config.color}`}>
                                            {config.label}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
