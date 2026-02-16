"use client";

interface JourneyViewToggleProps {
    activeView: "overview" | "calendar";
    onViewChange: (view: "overview" | "calendar") => void;
}

export function JourneyViewToggle({
    activeView,
    onViewChange,
}: JourneyViewToggleProps) {
    return (
        <div className="inline-flex items-center bg-[#ececf0] rounded-[14px] p-1 gap-0">
            <button
                onClick={() => onViewChange("overview")}
                className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer ${activeView === "overview"
                        ? "bg-[#ff9e44] text-white shadow-sm"
                        : "text-[#1a1a1a] hover:text-[#0f172b]"
                    }`}
            >
                Overview
            </button>
            <button
                onClick={() => onViewChange("calendar")}
                className={`px-5 py-2 rounded-[10px] text-sm font-medium transition-all border cursor-pointer ${activeView === "calendar"
                        ? "bg-[#ff9e44] text-white shadow-sm border-transparent"
                        : "border-[#e2e8f0] text-[#1a1a1a] hover:text-[#0f172b]"
                    }`}
            >
                Calendar
            </button>
        </div>
    );
}
