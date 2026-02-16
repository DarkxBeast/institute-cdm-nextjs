"use client";

import { Building2, FileText, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ContactDetailsTab from "./tabs/ContactDetailsTab";
import AdminAccessTab from "./tabs/AdminAccessTab";

export default function InstituteProfilePage() {
    const [activeTab, setActiveTab] = useState<'contact' | 'admin'>('contact');

    return (
        <div className="bg-[#fafafa] text-black">
            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Building2 className="w-8 h-8 text-orange-500" />
                    <h1 className="text-3xl font-bold">Institute Profile Builder</h1>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <p className="text-gray-500 text-lg">
                        This is the Institute Profile Builder page.
                    </p>
                </div>
            </div>
        </div>
        /*
        <div className="min-h-screen bg-[#fafafa]">
            <div className="max-w-[1600px] mx-auto p-8">
            (Header)
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Institute Profile Builder</h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your institution&apos;s public profile and settings</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 w-full sm:w-auto justify-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Create Profile for Recruiters
                        </Button>
                        <Button className="bg-[#ff9e44] hover:bg-[#e68a33] text-white w-full sm:w-auto justify-center">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
                
                (Tabs)
                <Tabs defaultValue="contact" value={activeTab} onValueChange={(value) => setActiveTab(value as 'contact' | 'admin')} className="w-full">
                    <TabsList className="mb-8 w-full sm:w-auto justify-center sm:justify-start">
                        <TabsTrigger value="contact" className="flex-1 sm:flex-none">
                            <User className="w-4 h-4 mr-2" />
                            Contact Details
                        </TabsTrigger>
                        <TabsTrigger value="admin" className="flex-1 sm:flex-none">
                            <Building2 className="w-4 h-4 mr-2" />
                            Admin Access
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contact">
                        <ContactDetailsTab />
                    </TabsContent>
                    <TabsContent value="admin">
                        <AdminAccessTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        */
    );
}
