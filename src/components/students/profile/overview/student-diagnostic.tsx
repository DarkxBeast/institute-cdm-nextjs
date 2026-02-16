"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function StudentDiagnostic() {
    const diagnosticItems = [
        {
            title: "Diagnostic Interview",
            score: "4.5",
        },
        {
            title: "Resume Review",
            score: "4.5",
        },
        {
            title: "Practice Interview",
            score: "4.5",
        },
        {
            title: "AI Interview Report",
            score: null, // No score shown for this one in design
        },
    ];

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Diagnostic & Career Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {diagnosticItems.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full border border-gray-100">
                                <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                                {item.score && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-xs font-semibold text-gray-900">{item.score}</span>
                                        <span className="text-[10px] text-gray-500">/ 5.0</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs h-8 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                            View Report
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
