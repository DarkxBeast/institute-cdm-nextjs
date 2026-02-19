"use client";

import { Users } from "lucide-react";

export default function TccPerformanceView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
            <div className="p-5 bg-orange-50 rounded-2xl mb-6 border border-orange-100">
                <Users className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                TCC Performance
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
                TCC team performance analytics and metrics will appear here.
            </p>
        </div>
    );
}
