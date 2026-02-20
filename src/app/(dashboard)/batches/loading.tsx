import { Plus } from "lucide-react";

export default function BatchesLoading() {
    return (
        <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5]/50 min-h-screen">
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-2">
                        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-5 w-80 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-gray-100 text-transparent px-4 h-11 rounded-lg w-full sm:w-[130px] animate-pulse">
                        <Plus className="w-5 h-5 text-gray-300" />
                        <span className="font-medium bg-gray-300 rounded h-4 w-20" />
                    </div>
                </div>

                {/* Batch Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white border border-[#e0e6eb] rounded-[14px] p-5 sm:p-6 space-y-5 flex flex-col h-full shadow-sm"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2 flex-1">
                                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                                </div>
                                <div className="h-6 w-16 bg-gray-100 rounded-md animate-pulse shrink-0" />
                            </div>

                            {/* Batch Info */}
                            <div className="space-y-3 flex-grow py-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center gap-2.5">
                                        <div className="h-7 w-7 bg-gray-50 rounded-md animate-pulse shrink-0" />
                                        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="space-y-2.5 pt-4 border-t border-[#e0e6eb] mt-auto">
                                <div className="w-full h-10 sm:h-11 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="w-full h-10 sm:h-11 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="flex-1 h-10 sm:h-11 bg-gray-50 rounded-lg animate-pulse border border-[#e0e6eb]" />
                                    <div className="w-10 sm:w-11 h-10 sm:h-11 bg-red-50 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
