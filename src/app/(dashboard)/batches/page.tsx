import { Plus, Users, Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import { getBatchesForUser } from "@/app/actions/batches";
import Link from "next/link";
import { DeleteBatchDialog } from "@/components/batches/delete-batch-dialog";

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString();
};

interface Batch {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  studentCount: number;
  startDate: string;
  endDate: string;
}

export default async function BatchesPage() {
  const { data: batches, error } = await getBatchesForUser();

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5]/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center max-w-md">
          <h3 className="text-red-500 font-medium mb-2">Error Loading Batches</h3>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5]/50">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-[32px] font-bold text-[#1a1a1a] leading-tight sm:leading-[40px]">
              Batch Management
            </h1>
            <p className="text-sm sm:text-base text-[#717182]">
              Manage your institution&apos;s batches and track student enrollment
            </p>
          </div>
          {/*batches && batches.length > 0 && (
            <Link
              href="/batches/add"
              className="flex items-center justify-center gap-2 bg-[#ff9e44] text-white px-4 h-11 rounded-lg shadow-sm hover:bg-[#ff8c2e] transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Batch</span>
            </Link>
          )*/}
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {batches?.map((batch: Batch) => (
            <div
              key={batch.id}
              className="bg-white border border-[#e0e6eb] rounded-[14px] p-5 sm:p-6 space-y-5 sm:space-y-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-medium text-[#1a1a1a] line-clamp-1">
                    {batch.title}
                  </h3>
                  <p className="text-sm text-[#717182] line-clamp-1">{batch.subtitle}</p>
                </div>
                <span className="shrink-0 bg-[#ff9e44]/10 text-[#ff9e44] text-xs font-medium px-2.5 py-1 rounded-md capitalize">
                  {batch.status}
                </span>
              </div>

              {/* Batch Info */}
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Users className="w-4 h-4 text-[#717182]" />
                  </div>
                  <span className="text-sm text-[#5a5a6b] font-medium">
                    {batch.studentCount} Students
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-[#717182]" />
                  </div>
                  <span className="text-sm text-[#5a5a6b]">
                    Start: {formatDate(batch.startDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-[#717182]" />
                  </div>
                  <span className="text-sm text-[#5a5a6b]">
                    End: {formatDate(batch.endDate)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-4 border-t border-[#e0e6eb] mt-auto">
                <Link
                  href={`/batches/${batch.id}/journey`}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white h-10 sm:h-11 rounded-lg hover:bg-[#2a2a2a] transition-all active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium">View Journey</span>
                </Link>
                <Link
                  href={`/batches/${batch.id}/students`}
                  className="w-full flex items-center justify-center gap-2 bg-[#ff9e44] text-white h-10 sm:h-11 rounded-lg hover:bg-[#ff8c2e] transition-all active:scale-[0.98]"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm font-medium">View Students</span>
                </Link>
                <div className="flex gap-2">
                  <Link
                    href={`/batches/${batch.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e0e6eb] text-[#1a1a1a] h-10 sm:h-11 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium">Edit</span>
                  </Link>
                  {/* <DeleteBatchDialog batchId={batch.id} batchName={batch.title} /> */}
                </div>
              </div>
            </div>
          ))}

          {batches && batches.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#e0e6eb] rounded-[14px] bg-white/50">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a1a]">No batches found</h3>
              <p className="text-[#717182] mt-1 mb-4 max-w-xs">
                It looks like you haven&apos;t created any batches for your institution yet.
              </p>
              <Link
                href="/batches/add"
                className="flex items-center gap-2 bg-[#ff9e44] text-white px-4 h-10 rounded-lg shadow-sm hover:bg-[#ff8c2e] transition-colors"
                style={{ appearance: 'none', WebkitAppearance: 'none' }} // Ensure it doesn't look like a default link if styles fail
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Create First Batch</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
