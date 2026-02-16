"use strict";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
    title: string;
    value: string | number;
}

const KPICard = ({ title, value }: KPICardProps) => {
    return (
        <Card className="rounded-[14px] border border-[#e0e6eb] shadow-sm overflow-hidden">
            <CardHeader className="bg-[#1a1a1a] py-3 px-6">
                <CardTitle className="text-white text-base font-medium font-['Lato'] tracking-wide">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[100px] flex items-center justify-center bg-white">
                <span className="text-[#101828] text-4xl font-medium font-['Lato']">
                    {value}
                </span>
            </CardContent>
        </Card>
    );
};

export function KPICards() {
    const kpis = [
        { title: "Count", value: 63 },
        { title: "Average", value: 3.71 },
        { title: "Median", value: 3.88 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi) => (
                <KPICard key={kpi.title} title={kpi.title} value={kpi.value} />
            ))}
        </div>
    );
}
