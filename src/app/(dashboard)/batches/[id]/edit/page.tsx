import { getBatch } from '@/app/actions/batches';
import EditBatchClient from './sections/edit-batch-client';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBatchPage({ params }: PageProps) {
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
        <EditBatchClient
            batchId={id}
            initialBatchInfo={data.batchInfo}
            initialStudents={data.students}
        />
    );
}
