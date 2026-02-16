"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JourneyHeaderProps {
    batchId: string;
    batchTitle: string;
    batchSubtitle: string;
    batchStatus: string;
}

export function JourneyHeader({
    batchId,
    batchTitle,
    batchSubtitle,
    batchStatus,
}: JourneyHeaderProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Back link */}

            <Link
                href="/batches"
                className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Batches</span>
            </Link>

            {/* Title row */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-[#1a1a1a] leading-8">
                        {batchTitle}
                    </h1>
                    <Badge className="bg-[#ff9e44] text-white text-xs px-3 py-1 rounded-[10px] border-transparent hover:bg-[#ff9e44] capitalize">
                        {batchStatus}
                    </Badge>
                </div>
                <p className="text-base text-[#62748e] leading-6">
                    {batchSubtitle}
                </p>
            </div>
        </div>
    );
}
