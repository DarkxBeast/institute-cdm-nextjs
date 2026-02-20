"use client";

import { Building2, GraduationCap, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstitutePerformanceView from "./InstitutePerformanceView";
import StudentPerformanceView from "./StudentPerformanceView";
import TccPerformanceView from "./TccPerformanceView";

export default function AnalyticsDashboard() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50/50 p-4 md:p-8">
            <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8">
                {/* Header & Navigation */}
                <div className="flex flex-col gap-6 w-full">
                    <Tabs defaultValue="institute" className="w-full">
                        <div className="flex items-center justify-center w-full">
                            <TabsList className="h-auto inline-flex w-fit max-w-full overflow-x-auto justify-start sm:justify-center p-1 bg-white/60 border border-slate-200/60 shadow-sm rounded-xl no-scrollbar">
                                <TabsTrigger
                                    value="institute"
                                    className="gap-2.5 whitespace-nowrap rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-[#FF9E44] data-[state=active]:shadow-sm data-[state=active]:text-white transition-all cursor-pointer"
                                >
                                    <Building2 className="w-4 h-4 shrink-0" />
                                    <span className="font-medium text-sm hidden sm:inline">Institute Performance</span>
                                    <span className="font-medium text-sm sm:hidden">Institute</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="student"
                                    className="gap-2.5 whitespace-nowrap rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-[#FF9E44] data-[state=active]:shadow-sm data-[state=active]:text-white transition-all cursor-pointer"
                                >
                                    <GraduationCap className="w-4 h-4 shrink-0" />
                                    <span className="font-medium text-sm hidden sm:inline">Student Performance</span>
                                    <span className="font-medium text-sm sm:hidden">Student</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tcc"
                                    className="gap-2.5 whitespace-nowrap rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 data-[state=active]:bg-[#FF9E44] data-[state=active]:shadow-sm data-[state=active]:text-white transition-all cursor-pointer"
                                >
                                    <Users className="w-4 h-4 shrink-0" />
                                    <span className="font-medium text-sm hidden sm:inline">TCC Performance</span>
                                    <span className="font-medium text-sm sm:hidden">TCC</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="institute" className="mt-6">
                            <InstitutePerformanceView />
                        </TabsContent>

                        <TabsContent value="student" className="mt-6">
                            <StudentPerformanceView />
                        </TabsContent>

                        <TabsContent value="tcc" className="mt-6">
                            <TccPerformanceView />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
