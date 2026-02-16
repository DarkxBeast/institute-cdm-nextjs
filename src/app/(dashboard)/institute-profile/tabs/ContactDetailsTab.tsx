"use client";

import { Building2, Globe, Mail, MapPin, Phone, User, Monitor } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactDetailsTab() {
    return (
        <Card className="hover:shadow-md transition-all duration-300 border-gray-200 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Column: Institute Information */}
                    <div className="p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff9e44]">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Institute Details</CardTitle>
                                <p className="text-sm text-gray-500 font-normal">General contact information</p>
                            </div>
                        </div>

                        {/* Communication Channels */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Website
                                    </Label>
                                    <Input defaultValue="https://www.git.edu.in" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700">
                                            Primary Email <span className="text-orange-500">*</span>
                                        </Label>
                                        <Input defaultValue="info@git.edu.in" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-gray-700">
                                            Support Email
                                        </Label>
                                        <Input defaultValue="support@git.edu.in" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-4">
                            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Phone Numbers
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Primary Phone <span className="text-orange-500">*</span>
                                    </Label>
                                    <Input defaultValue="+91 80-12345678" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Alternate Phone
                                    </Label>
                                    <Input defaultValue="+91 80-87654321" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="border-t border-gray-100 pt-4 space-y-4">
                            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Location
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">Address Line 1 <span className="text-orange-500">*</span></Label>
                                    <Input placeholder="House/Flat No., Building Name" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Address Line 2</Label>
                                    <Input placeholder="Street, Colony, Area" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Landmark</Label>
                                    <Input placeholder="E.g. Near Central Bank" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">City</Label>
                                        <Input defaultValue="Bangalore" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">State</Label>
                                        <Input defaultValue="Karnataka" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">Pincode</Label>
                                        <Input defaultValue="560100" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Point of Contact */}
                    <div className="p-6 space-y-6 lg:pl-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Primary Point of Contact</CardTitle>
                                <p className="text-sm text-gray-500 font-normal">Main liaison details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    Full Name <span className="text-orange-500">*</span>
                                </Label>
                                <Input defaultValue="Dr. Ramesh Kumar" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    Designation
                                </Label>
                                <Input defaultValue="Dean - Student Affairs" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    Department
                                </Label>
                                <Input defaultValue="Administration" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    Employee ID
                                </Label>
                                <Input defaultValue="EMP-2001" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-4">
                            <h4 className="text-sm font-medium text-gray-900">Direct Contact</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Official Email <span className="text-orange-500">*</span>
                                    </Label>
                                    <Input defaultValue="ramesh.kumar@git.edu.in" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Mobile Number <span className="text-orange-500">*</span>
                                    </Label>
                                    <Input defaultValue="+91 98765-43210" className="bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all hover:border-orange-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
