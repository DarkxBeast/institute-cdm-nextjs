"use client";

import { Calendar, BookOpen, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type BatchInfo } from "@/lib/validations/batch";

interface BatchHeaderProps {
    batchInfo: BatchInfo;
    studentCount: number;
}

export function BatchHeader({ batchInfo, studentCount }: BatchHeaderProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return "TBD";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "active": return "default"; // or a specific green variant if available
            case "completed": return "secondary";
            case "upcoming": return "outline";
            default: return "outline";
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* Title Section */}
                <div className="space-y-1 min-w-fit">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                            {batchInfo.batchName}
                        </CardTitle>
                        <Badge variant={getStatusVariant(batchInfo.status) as any} className="capitalize">
                            {batchInfo.status}
                        </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-500 font-medium">
                        {batchInfo.department}
                    </CardDescription>
                </div>

                {/* Details Section */}
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                    <div className="flex items-start gap-3 min-w-fit">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">
                                {formatDate(batchInfo.startDate)} - {formatDate(batchInfo.endDate)}
                            </p>
                        </div>
                    </div>



                    {batchInfo.description && (
                        <>
                            <div className="hidden lg:block w-px h-10 bg-gray-200" />
                            <div className="flex items-start gap-3 flex-1">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</p>
                                    <p className="text-sm text-gray-700 mt-0.5 line-clamp-2 lg:line-clamp-1" title={batchInfo.description}>
                                        {batchInfo.description}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
