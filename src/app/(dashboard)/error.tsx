"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Something went wrong
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ff9e44] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e88d35]"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </button>
            </div>
        </div>
    )
}
