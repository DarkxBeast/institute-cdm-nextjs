"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StudentSkills() {
    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-gray-500 text-sm">No skills data has been added for this student yet.</p>
                </div>
            </CardContent>
        </Card>
    );
}
