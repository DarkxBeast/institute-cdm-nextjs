"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export function StudentStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Average Rating of Learner</p>
                <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-3xl font-bold text-gray-900">4.2</span>
                </div>
                <p className="text-xs text-gray-400">out of 5.0</p>
            </Card>

            <Card className="p-6 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Learner's Readiness</p>
                <span className="text-3xl font-bold text-gray-900">High</span>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1 max-w-[120px]">
                    <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
            </Card>

            <Card className="p-6 border-gray-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-gray-500 font-medium">Batch Standing</p>
                <span className="text-3xl font-bold text-gray-900">Top 15%</span>
                <p className="text-xs text-gray-400">in the batch</p>
            </Card>
        </div>
    );
}
