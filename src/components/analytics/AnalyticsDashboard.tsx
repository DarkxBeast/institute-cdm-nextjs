"use client";

import { Building2, GraduationCap, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstitutePerformanceView from "./InstitutePerformanceView";
import StudentPerformanceView from "./StudentPerformanceView";
import TccPerformanceView from "./TccPerformanceView";

export default function AnalyticsDashboard() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[#fafafa] p-4 md:p-8">
            <div className="w-full max-w-[1519px] mx-auto flex flex-col gap-6">
                {/* Tab Bar + Content */}
                <Tabs defaultValue="institute" className="w-full">
                    <div className="flex justify-center">
                        <TabsList className="gap-1">
                            <TabsTrigger
                                value="institute"
                                className="gap-2 cursor-pointer"
                            >
                                <Building2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Institute Performance</span>
                                <span className="sm:hidden">Institute</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="student"
                                className="gap-2 cursor-pointer"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">Student Performance</span>
                                <span className="sm:hidden">Student</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tcc"
                                className="gap-2 cursor-pointer"
                            >
                                <Users className="w-4 h-4" />
                                <span className="hidden sm:inline">TCC Performance</span>
                                <span className="sm:hidden">TCC</span>
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
    );
}
