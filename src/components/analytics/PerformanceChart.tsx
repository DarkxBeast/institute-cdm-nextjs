"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Topic 1", value: 30 },
    { name: "Topic 2", value: 45 },
    { name: "Topic 3", value: 60 },
    { name: "Topic 4", value: 50 },
    { name: "Topic 5", value: 70 },
    { name: "Topic 6", value: 85 },
];

export function PerformanceChart() {
    return (
        <Card className="rounded-[14px] border border-[#e0e6eb] shadow-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-[#1a1a1a] py-4 px-6 shrink-0">
                <CardTitle className="text-white text-base font-medium font-['Lato'] tracking-wide">
                    Average Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            ticks={[0, 20, 40, 60, 80, 100]}
                        />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#ff9e44" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
