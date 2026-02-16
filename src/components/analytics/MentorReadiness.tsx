"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const mentorData = [
    { name: "Gaurav Upadhyay", value: 65.7, color: "#8e51ff" },
    { name: "Ajay Kumar", value: 12.4, color: "#a684ff" },
    { name: "Pratik Ranjan", value: 11.3, color: "#c4b4ff" },
    { name: "Rohit Muralidharan", value: 7.9, color: "#ddd6ff" },
    { name: "Maharshi Vyas", value: 1.1, color: "#ede9fe" },
    { name: "Pulasta Mahapatra", value: 3.4, color: "#f5f3ff" },
];

const readinessData = [
    { name: "Student Readiness", value: 35, color: "#00bc7d" },
    { name: "Moderate Readiness", value: 25, color: "#00d492" },
    { name: "High Readiness", value: 20, color: "#5ee9b5" },
    { name: "Developing Readiness", value: 15, color: "#a4f4cf" },
    { name: "Other", value: 5, color: "#d0fae5" },
];

const PieChartCard = ({
    title,
    data,
}: {
    title: string;
    data: { name: string; value: number; color: string }[];
}) => {
    return (
        <Card className="rounded-[14px] border border-[#e0e6eb] shadow-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-[#1a1a1a] py-4 px-6 shrink-0">
                <CardTitle className="text-white text-base font-medium font-['Lato'] tracking-wide">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="w-full h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text mock - if needed could add absolute div here */}
                </div>

                <div className="space-y-3 mt-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-[#364153] font-['Lato']">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-[#101828] font-semibold font-['Lato']">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export function MentorSummaryCard() {
    return <PieChartCard title="Mentor Summary" data={mentorData} />;
}

export function ReadinessCard() {
    return <PieChartCard title="Readiness" data={readinessData} />;
}
