"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";

interface StudentProfileHeaderProps {
    student: {
        id: string;
        name: string;
        enrollmentId: string;
        email: string;
        phone?: string;
        avatar?: string;
        batchName: string;
    };
}

export function StudentProfileHeader({ student }: StudentProfileHeaderProps) {


    return (
        <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm ring-1 ring-gray-100">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                        {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                                ID: <span className="font-mono text-gray-700">{student.enrollmentId}</span> • {student.batchName}
                            </p>
                        </div>


                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{student.email}</span>
                        </div>
                        {student.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{student.phone}</span>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Card>
    );
}
