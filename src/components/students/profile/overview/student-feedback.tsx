"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentFeedback() {
    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <CardTitle className="text-lg font-semibold text-gray-900">Mentor Feedback</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 border-l-4 border-orange-400 pl-4 py-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-900">Divya Sharma</span>
                        <span className="text-gray-400 text-xs">2024-11-20</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Technical Mentor</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Excellent progress! Keep focusing on system design. Practice more behavioral questions. Your technical skills are improving significantly.
                    </p>
                </div>

                <div className="space-y-2 border-l-4 border-orange-400 pl-4 py-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-900">Rahul Verma</span>
                        <span className="text-gray-400 text-xs">2024-11-22</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Career Coach</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Resume looks great. Updated work experience section as discussed. Added quantifiable achievements to make it more impactful.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
