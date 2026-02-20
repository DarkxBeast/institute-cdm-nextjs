import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function NotFound() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const isAuthenticated = !!session

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                    <FileQuestion className="h-6 w-6 text-orange-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Page not found
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href={isAuthenticated ? "/overview" : "/login"}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ff9e44] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e88d35]"
                >
                    {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                </Link>
            </div>
        </div>
    )
}
