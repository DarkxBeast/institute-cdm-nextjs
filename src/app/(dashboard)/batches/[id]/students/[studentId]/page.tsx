import { notFound } from "next/navigation";
import { StudentProfileHeader } from "@/components/students/profile/student-profile-header";
import { StudentInfoTabs } from "@/components/students/profile/student-info-tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getBatch } from "@/app/actions/batches";
import { getLearningJourneyForBatch } from "@/app/actions/learning-journey";
import { getStudentReportTypes } from "@/app/actions/student-reports";

interface PageProps {
    params: Promise<{ id: string; studentId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StudentFilePage({ params, searchParams }: PageProps) {
    const { id, studentId } = await params;
    const { returnTo } = await searchParams;
    const { data: batchData } = await getBatch(id);

    // In a real app, we would fetch the specific student details here.
    // For now, we'll find the student within the batch data or mock it if needed.
    const student = batchData?.students.find(s =>
        (s.id === studentId) || (s.enrollmentId === studentId) // Fallback for ID matching
    );

    if (!student) {
        // If not found in batch list (maybe fetching full details API is needed), 
        // fallback to notFound or mock for development if needed.
        // For this task, assuming data structure matches what's available.
        // We'll mock extended data for now since the schema is simple.

        // return notFound(); // Uncomment when real data is ready
    }

    // Mocking extended data for display
    const extendedStudent = student ? {
        ...student,
        id: student.id || studentId,
        enrollmentId: student.enrollmentId || "",
        avatar: "", // Placeholder
        batchName: batchData?.batchInfo.batchName || "Unknown Batch",
        phone: student.phoneNumber,
        name: student.studentName,
    } : {
        // Fallback mock for development/visualization if student not found in list
        id: studentId,
        name: "Mock Student",
        enrollmentId: "STU-001",
        email: "student@example.com",
        phone: "+91 98765 43210",
        batchName: "Batch 2024",
    };

    const { data: journeyData } = await getLearningJourneyForBatch(id);

    // Fetch available report types for this student
    const { data: reportTypes } = await getStudentReportTypes(extendedStudent.id);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Navigation */}
                <div>
                    <Link
                        href={returnTo === 'overview' ? '/overview' : `/batches/${id}/students`}
                        className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{returnTo === 'overview' ? 'Back to Overview' : 'Back to Students'}</span>
                    </Link>
                </div>

                <StudentProfileHeader student={extendedStudent} />

                <StudentInfoTabs
                    student={extendedStudent}
                    journeyItems={journeyData?.sequenceList || []}
                    reportTypes={reportTypes || []}
                />
            </div>
        </div>
    );
}
