import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#fafafa] p-4 md:p-8">
            <div className="w-full max-w-[1519px] mx-auto flex flex-col gap-8">
                {/* Header skeleton */}
                <div className="relative flex flex-col w-full overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-sm">
                    <div className="h-[150px] md:h-[200px] w-full bg-gray-100 animate-pulse" />
                    <div className="p-6 md:px-8 md:pb-7">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                            <div className="h-[110px] w-[110px] md:h-[130px] md:w-[130px] rounded-[14px] bg-gray-100 animate-pulse -mt-[55px] md:-mt-[60px] border-4 border-white shadow-sm" />
                            <div className="flex flex-col gap-2 flex-1 text-center md:text-left pb-2">
                                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mx-auto md:mx-0" />
                                <div className="h-7 w-56 bg-gray-100 rounded animate-pulse mx-auto md:mx-0" />
                                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mx-auto md:mx-0" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mb-3" />
                            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-2" />
                            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Table skeleton */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
                    <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
