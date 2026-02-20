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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white mt-6">
                <CardContent className="p-4 sm:p-6">
                    <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50/80 rounded-lg">
                            <Calendar className="h-4.5 w-4.5 text-indigo-600" />
                        </div>
                        Session Timeline
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session</th>
                                    <th className="text-left py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Journey Item</th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attendance</th>
                                    <th className="text-center py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Feedback</th>
                                    <th className="text-center py-3.5 px-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionDetails.map((session, idx) => (
                                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors last:border-0">
                                        <td className="py-4 px-5 font-bold text-slate-900">{session.sessionName}</td>
                                        <td className="py-4 px-4 font-medium text-slate-600">{session.journeyItemName}</td>
                                        <td className="py-4 px-4 text-center">
                                            <AttendanceBadge status={session.attendanceStatus} />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <StatusIcon value={session.hasFeedback} />
                                        </td>
                                        <td className="py-4 px-5 text-center">
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
        <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function AttendanceBadge({ status }: { status: string }) {
    const isPresent = status.toLowerCase() === "present";
    return (
        <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${isPresent
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
            }`}>
            {isPresent ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {status}
        </span>
    );
}

function StatusIcon({ value }: { value: boolean }) {
    return value ? (
        <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
    ) : (
        <XCircle className="h-5 w-5 text-slate-200 mx-auto" />
    );
}
