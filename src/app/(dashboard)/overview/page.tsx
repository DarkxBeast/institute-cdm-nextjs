import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getBatchesForUser } from "@/app/actions/batches";
import BatchDataSection from "./batch-data/BatchDataSection";
import { MapPin } from "lucide-react";

// Asset paths
const IMG_INSTITUTE_CAMPUS = "/images/iimk_banner.jpeg";
const IMG_IIM_LOGO = "/images/iimk_logo.jpeg";

export default async function OverviewPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch institute data for the logged-in admin/POC
    const { data: pocData } = await supabase
        .from("cdm_institute_pocs")
        .select("cdm_institutes(name, logo_url, location)")
        .eq("user_id", user.id)
        .single();

    // Extract institute data safely
    const instituteRaw = pocData?.cdm_institutes as any;
    const instituteName = (Array.isArray(instituteRaw) ? instituteRaw[0]?.name : instituteRaw?.name) || "Institute Name";
    const instituteLogo = (Array.isArray(instituteRaw) ? instituteRaw[0]?.logo_url : instituteRaw?.logo_url) || IMG_IIM_LOGO;
    const instituteLocation = (Array.isArray(instituteRaw) ? instituteRaw[0]?.location : instituteRaw?.location) || null;

    // Fetch batches for this user's institute
    const { data: batches } = await getBatchesForUser();

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#fafafa] p-4 md:p-8">
            {/* Main Container matching Figma 'Container' 31:1179 */}
            <div className="w-full max-w-[1519px] mx-auto flex flex-col gap-8">

                {/* Card Container matching Figma 'Container' 31:1180 */}
                <div className="relative flex flex-col w-full overflow-hidden rounded-[16px] border-[0.8px] border-[#e0e6eb] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">

                    {/* Header Image Section */}
                    <div className="relative h-[150px] md:h-[200px] w-full bg-gray-200">
                        <Image
                            src={IMG_INSTITUTE_CAMPUS}
                            alt="Institute Campus"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
                    </div>

                    {/* Content Section */}
                    <div className="relative bg-white px-4 pb-5 md:px-[32px] md:pb-[28px]">

                        {/* Logo Section */}
                        <div className="relative -mt-[55px] mx-auto mb-4 flex h-[110px] w-[110px] md:absolute md:-top-[48px] md:left-[32px] md:mx-0 md:mb-0 md:mt-0 md:h-[160px] md:w-[160px] items-center justify-center overflow-hidden rounded-[14px] border-[4px] border-white bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
                            <div className="relative h-full w-full">
                                <Image
                                    src={instituteLogo}
                                    alt="Institute Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col gap-1.5 text-center md:ml-[200px] md:mt-[16px] md:text-left">
                            {/* Welcome Text */}
                            <p className="text-[12px] md:text-[13px] leading-[20px] text-orange-400 font-medium tracking-wide uppercase">
                                Welcome to Dashboard
                            </p>

                            {/* Main Heading */}
                            <h1 className="text-[24px] md:text-[30px] font-bold leading-tight md:leading-[40px] text-[#1a1a1a]">
                                {instituteName}
                            </h1>

                            {/* Location */}
                            {instituteLocation && (
                                <div className="flex items-center gap-1.5 justify-center md:justify-start">
                                    <MapPin className="h-4 w-4 text-[#717182] shrink-0" />
                                    <p className="text-[14px] md:text-[15px] leading-[20px] text-[#717182]">
                                        {instituteLocation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Batch Data Section */}
                <BatchDataSection batches={batches ?? []} />
            </div>
        </div>
    );
}

