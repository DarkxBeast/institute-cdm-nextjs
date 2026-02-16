import { LearningJourneyItem } from "@/app/actions/learning-journey";
import { ModuleSequenceCard } from "./ModuleSequenceCard";

interface ModuleSequenceListProps {
    items: LearningJourneyItem[];
}

export function ModuleSequenceList({ items }: ModuleSequenceListProps) {
    return (
        <div className="bg-white border-[0.8px] border-[#e0e6eb] rounded-[16px] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 w-full">
            {/* Header Section */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <h2 className="text-[#171717] text-xl sm:text-2xl md:text-[28px] font-bold leading-tight sm:leading-[42px]">
                    Module Sequence
                </h2>
                <p className="text-[#62748e] text-sm sm:text-base font-normal leading-5 sm:leading-6">
                    Complete list of modules and activities in chronological order
                </p>
            </div>

            {/* Column Headers — hidden on mobile, cards are self-describing */}
            <div className="hidden md:flex items-center text-xs font-bold text-[#62748e] uppercase tracking-[0.6px] px-4">
                <div className="flex-1">Activity Name & Schedule</div>
                <div className="w-[140px] text-center">Status</div>
                <div className="w-[80px] text-right">Rating</div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <ModuleSequenceCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}
