"use strict";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PerformanceMetric {
    label: string;
    value: number; // 0-5
    color: string;
}

const metrics: PerformanceMetric[] = [
    { label: "Clarity of Thoughts", value: 3.8, color: "#155dfc" },
    { label: "Domain Knowledge", value: 3.6, color: "#ff6900" },
    { label: "Relevance of Content", value: 3.5, color: "#fb2c36" },
    { label: "Role Realism", value: 3.9, color: "#9810fa" },
    { label: "Soft Skills", value: 4, color: "#f6339a" },
    { label: "Confidence & Emotional Readiness", value: 4.2, color: "#00a63e" },
];

export function BatchPerformance() {
    return (
        <Card className="rounded-[14px] border border-[#e0e6eb] shadow-sm overflow-hidden h-full">
            <CardHeader className="bg-[#1a1a1a] py-4 px-6">
                <CardTitle className="text-white text-base font-medium font-['Lato'] tracking-wide">
                    Batch Performance Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: metric.color }}
                                    />
                                    <span className="text-[#1e2939] text-xs font-medium font-['Lato']">
                                        {metric.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-4 bg-[#f3f4f6] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(metric.value / 5) * 100}%`,
                                                backgroundColor: metric.color,
                                            }}
                                        />
                                    </div>
                                    <span className="bg-[#f3f4f6] px-2 py-1 rounded text-[#101828] text-xs font-semibold font-['Lato'] min-w-[32px] text-center">
                                        {metric.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Scale ticks */}
                    <div className="mt-8 pt-2 border-t border-[#e5e7eb] flex justify-between text-[#6a7282] text-[10px] font-['Lato']">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
