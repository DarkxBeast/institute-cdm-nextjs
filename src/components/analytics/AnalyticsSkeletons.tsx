import { Card, CardContent } from "@/components/ui/card";

export function InstituteSkeleton() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
            </h2>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-100 animate-pulse h-11 w-11" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:p-6">
                            <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mb-6" />
                            <div className="h-[260px] w-full bg-gray-50 rounded-xl animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Batch Table ── */}
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                        <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-4" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-full bg-gray-50 rounded animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function StudentSkeleton() {
    return (
        <div className="space-y-6 flex flex-col items-center py-[20vh]">
            <div className="p-5 bg-gray-100 rounded-2xl mb-4 animate-pulse h-16 w-16" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
    );
}

export function TccSkeleton() {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Batch Selector Card */}
            <div className="flex justify-center">
                <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white w-full sm:w-auto overflow-hidden">
                    <CardContent className="p-2 sm:p-3">
                        <div className="h-10 w-full sm:w-[320px] bg-gray-100 rounded-lg animate-pulse" />
                    </CardContent>
                </Card>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-100 animate-pulse h-11 w-11" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Per-Type Sections ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                            <div className="flex items-center justify-between mb-4 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-100 rounded-xl" />
                                    <div className="h-5 w-32 bg-gray-200 rounded" />
                                </div>
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-16 w-full bg-gray-50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Middle Chart ── */}
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                <CardContent className="p-4 sm:pt-6 sm:pb-5 sm:px-6">
                    <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-6" />
                    <div className="h-[360px] w-full bg-gray-50 rounded-xl animate-pulse" />
                </CardContent>
            </Card>

            {/* ── Bottom Table ── */}
            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                        <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-4" />
                        {[1, 2, 3, 4].map((i) => (
                            <div className="flex items-center gap-4" key={i}>
                                <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
                                <div className="h-14 flex-1 bg-gray-50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function BatchOverviewSkeleton() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-100 animate-pulse h-11 w-11" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                        <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-4" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-full bg-gray-50 rounded animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
