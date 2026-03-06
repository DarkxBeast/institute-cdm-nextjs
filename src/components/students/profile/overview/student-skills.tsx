"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentSkillsProps {
    skills?: string[];
}

export function StudentSkills({ skills = [] }: StudentSkillsProps) {
    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold text-gray-900">Skills</CardTitle>
            </CardHeader>
            <CardContent>
                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1 text-sm font-medium"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-gray-500 text-sm">No skills data has been added for this student yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
