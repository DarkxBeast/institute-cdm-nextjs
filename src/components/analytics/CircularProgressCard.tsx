"use client";

import { Card, CardContent } from "@/components/ui/card";

interface CircularProgressCardProps {
    /** 0-100 percentage value to fill the ring */
    percentage: number;
    /** Display text inside the ring, e.g. "75%" or "3.7/5" */
    centerLabel: string;
    /** Card label text */
    label: string;
    /** Optional subtitle beneath the label */
    subtitle?: string;
    /** Stroke colour for the filled arc */
    color: string;
    /** Background ring colour (defaults to color at 20% opacity) */
    trackColor?: string;
    /** Icon element rendered next to the label */
    icon?: React.ReactNode;
    /** Background class for the icon wrapper */
    iconBg?: string;
}

export default function CircularProgressCard({
    percentage,
    centerLabel,
    label,
    subtitle,
    color,
    trackColor,
    icon,
    iconBg = "bg-slate-50",
}: CircularProgressCardProps) {
    const size = 64;
    const stroke = 6; // Thinner stroke for smaller size
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * Math.min(percentage, 100)) / 100;

    return (
        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
            <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
                <div className="flex items-center sm:items-start justify-between">
                    {/* Label + subtitle */}
                    <div className="min-w-0 pr-2 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {icon && <div className={`p-1.5 rounded-lg ${iconBg} shrink-0`}>{icon}</div>}
                            <p className="text-[13px] sm:text-sm text-slate-500 font-medium leading-tight">{label}</p>
                        </div>
                        {subtitle && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
                        )}
                    </div>

                    {/* Circular chart */}
                    <div className="relative shrink-0 flex items-center justify-center filter drop-shadow-sm" style={{ width: size, height: size }}>
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                            {/* Track Circle */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={trackColor ?? color}
                                strokeWidth={stroke}
                                opacity={trackColor ? 1 : 0.1}
                            />
                            {/* Progress Circle */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth={stroke}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className="font-bold text-slate-900 tracking-tight"
                                style={{ fontSize: centerLabel.length > 4 ? 14 : 18 }}
                            >
                                {centerLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
