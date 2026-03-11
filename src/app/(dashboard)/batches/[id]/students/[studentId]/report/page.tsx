import { getStudentReportsByType } from "@/app/actions/student-reports";
import { DiagnosticInterviewFullReport } from "@/components/students/profile/diagnostic-interview-full-report";
import { ResumeReviewFullReport } from "@/components/students/profile/resume-review-full-report";
import { PracticeInterviewFullReport } from "@/components/students/profile/practice-interview-full-report";
import { getBatch } from "@/app/actions/batches";

interface PageProps {
    params: Promise<{ id: string; studentId: string }>;
    searchParams: Promise<{ type?: string; journeyItemId?: string }>;
}

export default async function FullReportPage({ params, searchParams }: PageProps) {
    const { id, studentId } = await params;
    const { type: reportType, journeyItemId } = await searchParams;

    // The URL studentId might be enrollmentId – resolve the real DB id
    const { data: batchData } = await getBatch(id);
    const student = batchData?.students.find(
        (s) => s.id === studentId || s.enrollmentId === studentId
    );
    const realStudentId = student?.id || studentId;

    const resolvedType = reportType || "Diagnostic Interview";

    const { data: reports, error } = await getStudentReportsByType(
        realStudentId,
        resolvedType,
        journeyItemId
    );

    if (error || !reports || reports.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                        No {resolvedType} Report Found
                    </h2>
                    <p className="text-sm text-gray-500">
                        {error || `There are no ${resolvedType.toLowerCase()} reports for this student yet.`}
                    </p>
                </div>
            </div>
        );
    }

    const report = reports[0];
    const backUrl = `/batches/${id}/students/${studentId}`;
    const enrollmentId = student?.enrollmentId || "";

    // Route to the correct full report component
    switch (resolvedType) {
        case "Resume Review":
            return <ResumeReviewFullReport report={report} backUrl={backUrl} enrollmentId={enrollmentId} />;

        case "Practice Interview":
            return <PracticeInterviewFullReport report={report} backUrl={backUrl} enrollmentId={enrollmentId} />;

        case "Diagnostic Interview":
        default:
            return <DiagnosticInterviewFullReport report={report} backUrl={backUrl} enrollmentId={enrollmentId} />;
    }
}
