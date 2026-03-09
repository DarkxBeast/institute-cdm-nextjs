"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentSkillsProps {
    skills?: string[];
}

export function StudentSkills({ skills = [] }: StudentSkillsProps) {
    if (!skills || skills.length === 0) return null;

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold text-gray-900">Skills</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
