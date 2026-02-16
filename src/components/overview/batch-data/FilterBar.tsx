"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface Batch {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    studentCount: number;
    startDate: string;
    endDate: string;
}

interface FilterBarProps {
    batches: Batch[];
    selectedBatchId: string;
    onBatchChange: (batchId: string) => void;
}

export default function FilterBar({ batches, selectedBatchId, onBatchChange }: FilterBarProps) {
    return (
        <div className="w-full rounded-[16px] border border-[#e0e6eb] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-2 group">
                <label className="text-sm text-[#717182] font-medium transition-colors group-hover:text-[#1a1a1a]">
                    Batch
                </label>
                <Select value={selectedBatchId} onValueChange={onBatchChange} disabled={batches.length <= 1}>
                    <SelectTrigger className={`h-11 rounded-lg border-[#e0e6eb] bg-white transition-all ${batches.length > 1 ? "hover:border-[#ff9e44]/50 focus:ring-[#ff9e44]/20" : "opacity-70 cursor-not-allowed"}`}>
                        <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                        {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                                {batch.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
