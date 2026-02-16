"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICards } from "./KPICards";
import { BatchPerformance } from "./BatchPerformance";
import { MentorSummaryCard, ReadinessCard } from "./MentorReadiness";
import { PerformanceChart } from "./PerformanceChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsDashboard() {
    return (
        <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-['Lato']">
            <div className="max-w-[1600px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                        <BarChart3 className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Training Management Portal
                        </h1>
                        <p className="text-[#717182] text-sm">TCC Admin Dashboard</p>
                    </div>
                </div>

                {/* Tabs & Controls */}
                <Tabs defaultValue="batch" className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <TabsList className="bg-transparent p-0 h-auto gap-4">
                            <TabsTrigger
                                value="batch"
                                className="data-[state=active]:bg-[#ff9e44] data-[state=active]:text-white bg-white border border-[#e0e6eb] text-[#717182] px-6 py-3 h-[54px] rounded-t-[10px] rounded-b-[14px] shadow-sm text-base font-semibold data-[state=active]:shadow-md transition-all"
                            >
                                Batch Performance
                            </TabsTrigger>
                            <TabsTrigger
                                value="student"
                                className="data-[state=active]:bg-[#ff9e44] data-[state=active]:text-white bg-white border border-[#e0e6eb] text-[#717182] px-6 py-3 h-[54px] rounded-t-[10px] rounded-b-[14px] shadow-sm text-base font-semibold data-[state=active]:shadow-md transition-all"
                            >
                                Student Performance
                            </TabsTrigger>
                            <TabsTrigger
                                value="tcc"
                                className="data-[state=active]:bg-[#ff9e44] data-[state=active]:text-white bg-white border border-[#e0e6eb] text-[#717182] px-6 py-3 h-[54px] rounded-t-[10px] rounded-b-[14px] shadow-sm text-base font-semibold data-[state=active]:shadow-md transition-all"
                            >
                                TCC Performance
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="batch" className="space-y-6 animate-in fade-in-50 duration-500">
                        {/* Filters Row (Mocked from design "Student Name", "Mentor Name" dropdowns) */}
                        <div className="flex gap-4 mb-6">
                            <div className="w-[280px]">
                                <label className="text-xs font-medium text-[#717182] mb-1.5 block">Student Name</label>
                                <Select>
                                    <SelectTrigger className="bg-white border-[#e0e6eb] h-[45px]">
                                        <SelectValue placeholder="All Students" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Students</SelectItem>
                                        <SelectItem value="student1">Student 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-[280px]">
                                <label className="text-xs font-medium text-[#717182] mb-1.5 block">Mentor Name</label>
                                <Select>
                                    <SelectTrigger className="bg-white border-[#e0e6eb] h-[45px]">
                                        <SelectValue placeholder="All Mentors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Mentors</SelectItem>
                                        <SelectItem value="mentor1">Mentor 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Sub-Tabs (Overview, Details) - Mocked for visual fidelity */}
                        <div className="flex gap-2 mb-6">
                            <button className="bg-[#ff9e44] text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm">
                                Overview
                            </button>
                            <button className="bg-white text-[#4a5565] border border-[#e0e6eb] px-6 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50">
                                Details
                            </button>
                        </div>

                        {/* Top KPI Cards */}
                        <KPICards />

                        {/* Middle Section: Batch Performance */}
                        <div className="w-full">
                            <BatchPerformance />
                        </div>

                        {/* Bottom Section: Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <MentorSummaryCard />
                            <ReadinessCard />
                            <PerformanceChart />
                        </div>
                    </TabsContent>

                    <TabsContent value="student">
                        <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            Student Performance content placeholder
                        </div>
                    </TabsContent>

                    <TabsContent value="tcc">
                        <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            TCC Performance content placeholder
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
