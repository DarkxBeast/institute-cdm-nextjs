"use client";

import { FileText } from "lucide-react";

export default function ProposalsPage() {
    return (
        <div className="bg-[#fafafa] text-black">
            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-8 h-8 text-orange-500" />
                    <h1 className="text-3xl font-bold">Proposals</h1>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <p className="text-gray-500 text-lg">
                        This is the Proposals page. Proposal submissions and management will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    );
}
