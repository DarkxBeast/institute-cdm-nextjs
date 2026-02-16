import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getBatchesForUser } from "@/app/actions/batches";
import BatchDataSection from "./batch-data/BatchDataSection";

// Asset paths
const IMG_INSTITUTE_CAMPUS = "/assets/figma/3958b6d0686fcd6b2c03c19c7bdaddf373a39a8a.png";
const IMG_IIM_LOGO = "/assets/figma/0a50307d3243111127f8fe41200e167adf0f3cad.png";

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
        .select("cdm_institutes(name, logo_url)")
        .eq("user_id", user.id)
        .single();

    // Extract institute name safely
    const instituteRaw = pocData?.cdm_institutes as any;
    const instituteName = (Array.isArray(instituteRaw) ? instituteRaw[0]?.name : instituteRaw?.name) || "Institute Name";
    const instituteLogo = (Array.isArray(instituteRaw) ? instituteRaw[0]?.logo_url : instituteRaw?.logo_url) || IMG_IIM_LOGO;

    // Fetch batches for this user's institute
    const { data: batches } = await getBatchesForUser();

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#fafafa] p-4 md:p-8">
            {/* Main Container matching Figma 'Container' 31:1179 */}
            <div className="w-full max-w-[1519px] mx-auto flex flex-col gap-6">

                {/* Card Container matching Figma 'Container' 31:1180 */}
                <div className="relative flex flex-col w-full overflow-hidden rounded-[16px] border-[0.8px] border-[#e0e6eb] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">

                    {/* Header Image Section matching 31:1181 */}
                    <div className="relative h-[150px] md:h-[200px] w-full bg-gray-200">
                        <Image
                            src={IMG_INSTITUTE_CAMPUS}
                            alt="Institute Campus"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient Overlay matching 31:1183 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    </div>

                    {/* Content Section matching 31:1184 */}
                    <div className="relative bg-white px-4 pb-6 md:px-[32px] md:pb-[32px]">

                        {/* Logo Section matching 31:1192 */}
                        {/* Mobile: Relative positioning with negative margin to overlap. Center aligned. */}
                        {/* Desktop: Absolute positioning to specific coordinates. Left aligned. */}
                        <div className="relative -mt-[40px] mx-auto mb-4 flex h-[80px] w-[80px] md:absolute md:-top-[48px] md:left-[32px] md:mx-0 md:mb-0 md:mt-0 md:h-[96px] md:w-[96px] items-center justify-center overflow-hidden rounded-[14px] border-[4px] border-white bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
                            <div className="relative h-full w-full">
                                <Image
                                    src={instituteLogo}
                                    alt="IIM Logo"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Text Content matching 31:1185 */}
                        {/* Mobile: Center text, no left margin. */}
                        {/* Desktop: Left margin to clear logo, text left aligned. */}
                        <div className="flex flex-col gap-1 text-center md:ml-[128px] md:mt-[40px] md:text-left">
                            {/* Welcome Text matching 31:1187 */}
                            <p className="text-[12px] md:text-[14px] leading-[20px] text-[#717182]">
                                Welcome to Dashboard
                            </p>

                            {/* Main Heading matching 31:1189 */}
                            <h1 className="text-[24px] md:text-[30px] font-bold leading-tight md:leading-[40px] text-[#1a1a1a]">
                                {instituteName}
                            </h1>

                            {/* Subtitle matching 31:1191 */}
                            <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#717182]">
                                Executive Education &amp; Leadership Development Program
                            </p>
                        </div>
                    </div>

                </div>

                {/* Batch Data Section */}
                <BatchDataSection batches={batches ?? []} />
            </div>
        </div>
    );
}

