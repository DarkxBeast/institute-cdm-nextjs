"use client";

interface ModuleTitleProps {
    programLabel: string;
    moduleName: string;
}

export function ModuleTitle({ programLabel, moduleName }: ModuleTitleProps) {
    return (
        <div className="bg-white border-x border-b border-[#e0e6eb] rounded-b-2xl px-4 md:px-8 pt-6 md:pt-8 pb-4 flex flex-col gap-4 items-center">
            <span className="text-sm font-normal text-[#62748e] uppercase tracking-wider text-center">
                {programLabel}
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-[#0f172b] text-center leading-tight">
                {moduleName}
            </h2>
        </div>
    );
}
