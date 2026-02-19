"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2,
    MessageSquare,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
} from "lucide-react";
import type { StudentEngagement as StudentEngagementData } from "@/app/actions/student-analytics";

interface StudentEngagementProps {
    data: StudentEngagementData;
    studentName: string;
}

export default function StudentEngagement({ data, studentName }: StudentEngagementProps) {
    const { attendanceRate, feedbackRate, totalSessions, sessionsAttended, sessionDetails } = data;

    if (totalSessions === 0) {
        return (
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No sessions found</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Engagement data will appear once sessions are scheduled.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Session Engagement
                <span className="text-sm font-normal text-gray-500">— {studentName}</span>
            </h3>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={<Calendar className="h-5 w-5 text-blue-500" />}
                    label="Total Sessions"
                    value={totalSessions.toString()}
                    bg="bg-blue-50"
                />
                <MetricCard
                    icon={<CheckCircle2 className="h-5 w-5 text-teal-500" />}
                    label="Attendance Rate"
                    value={`${Math.round(attendanceRate)}%`}
                    subtitle={`${sessionsAttended}/${totalSessions} attended`}
                    bg="bg-teal-50"
                />
                <MetricCard
                    icon={<MessageSquare className="h-5 w-5 text-pink-500" />}
                    label="Feedback Rate"
                    value={`${Math.round(feedbackRate)}%`}
                    bg="bg-pink-50"
                />
                <MetricCard
                    icon={<FileText className="h-5 w-5 text-violet-500" />}
                    label="Reports Generated"
                    value={sessionDetails.filter(s => s.isReportGenerated).length.toString()}
                    subtitle={`of ${totalSessions} sessions`}
                    bg="bg-violet-50"
                />
            </div>

            {/* Session Timeline */}
            <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Session Timeline</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Journey Item</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback</th>
                                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionDetails.map((session, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-2.5 px-3 font-medium text-gray-900">{session.sessionName}</td>
                                        <td className="py-2.5 px-3 text-gray-600">{session.journeyItemName}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <AttendanceBadge status={session.attendanceStatus} />
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            <StatusIcon value={session.hasFeedback} />
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                            <StatusIcon value={session.isReportGenerated} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Subcomponents ──

function MetricCard({
    icon,
    label,
    value,
    subtitle,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle?: string;
    bg: string;
}) {
    return (
        <Card className="border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-[11px] text-gray-400">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function AttendanceBadge({ status }: { status: string }) {
    const isPresent = status.toLowerCase() === "present";
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${isPresent
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
            {isPresent ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {status}
        </span>
    );
}

function StatusIcon({ value }: { value: boolean }) {
    return value ? (
        <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
    ) : (
        <XCircle className="h-4 w-4 text-gray-300 mx-auto" />
    );
}
