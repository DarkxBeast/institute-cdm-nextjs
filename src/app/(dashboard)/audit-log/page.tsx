"use client";

import AuditLogTable from "@/components/audit-log/audit-log-table";
import { BarChart3 } from "lucide-react";

export default function AuditLogPage() {
    return (
        <div className="bg-[#fafafa] text-black">
            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                    <h1 className="text-3xl font-bold">Audit Logs</h1>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <p className="text-gray-500 text-lg">
                        This is the Audit Logs page.
                    </p>
                </div>
            </div>
        </div>
        /* We will implement this in later phase.
        
        <div className="bg-[#fafafa] text-black">
            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
                    <p className="text-gray-400">Track all system activities for compliance and transparency</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Activity Log</h2>
                    </div>
                    <AuditLogTable />
                </div>
            </div>
        </div>
        */
    );
}
