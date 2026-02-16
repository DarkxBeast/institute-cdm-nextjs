import { getBatch } from '@/app/actions/batches';
import { notFound } from 'next/navigation';
import { BatchHeader } from './sections/batch-header';
import StudentsTable from './sections/students-table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BatchStudentsPage({ params }: PageProps) {
    const { id } = await params;
    const { data, error } = await getBatch(id);

    if (error || !data) {
        if (error === 'Batch not found') {
            notFound();
        }
        return (
            <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center max-w-md">
                    <h3 className="text-red-500 font-medium mb-2">Error Loading Batch</h3>
                    <p className="text-gray-600 text-sm">{error || "Could not fetch batch details."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Navigation */}
                <div>
                    <Link
                        href="/batches"
                        className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Batches</span>
                    </Link>
                </div>

                {/* Batch Header */}
                <BatchHeader
                    batchInfo={data.batchInfo}
                    studentCount={data.students.length}
                />

                {/* Students Table Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Enrolled Students</h2>
                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                            Total: <strong className="text-gray-900">{data.students.length}</strong>
                        </span>
                    </div>

                    <StudentsTable data={data.students} batchId={id} />
                </div>
            </div>
        </div>
    );
}
