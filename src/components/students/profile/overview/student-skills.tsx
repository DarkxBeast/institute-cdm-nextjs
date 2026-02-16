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
                {/* Career Preferences */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        <h4 className="text-sm font-medium text-gray-900">Career Preferences</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Software Development", "Product Management", "Data Science"].map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-50">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Job Profile */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        <h4 className="text-sm font-medium text-gray-900">Job Profile</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Backend Engineer", "Full Stack Developer", "Product Engineer", "DevOps Engineer"].map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-50">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Technical Skills */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-700" />
                        <h4 className="text-sm font-medium text-gray-900">Technical Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "TypeScript", "System Design"].map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Soft Skills */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                        <h4 className="text-sm font-medium text-gray-900">Soft Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Time Management"].map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-50">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
