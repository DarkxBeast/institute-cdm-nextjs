"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from "lucide-react";
import { type BatchInfo } from "@/lib/validations/batch";

interface BatchDetailsFormProps {
    formData: BatchInfo;
    setFormData: (data: BatchInfo) => void;
}

export function BatchDetailsForm({ formData, setFormData }: BatchDetailsFormProps) {
    const handleChange = (field: keyof BatchInfo, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Batch Information Card */}
            <Card className="border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4 space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-full">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">Batch Information</CardTitle>
                            <CardDescription className="text-xs text-gray-500 font-normal">Enter the core details for this new batch</CardDescription>
                        </div>
                    </div>
                    {/* Spacer to match button height in StudentsManager */}
                    <div className="h-9" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Row 1: Batch Name and Program */}
                    {/* Row 1: Batch Name and Department */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="batchName">
                                Batch Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="batchName"
                                placeholder="e.g., PGP 2025-27 Batch A"
                                value={formData.batchName}
                                onChange={(e) => handleChange("batchName", e.target.value)}
                                className="bg-white"
                            />
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="department">
                                Department <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="department"
                                placeholder="e.g., Computer Science"
                                value={formData.department}
                                onChange={(e) => handleChange("department", e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </div>

                    {/* Row 2: Dates and Status */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">
                                Start Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                className="bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">
                                End Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 86400000).toISOString().split('T')[0] : undefined}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                                className="bg-white"
                                disabled={!formData.startDate}
                                title={!formData.startDate ? "Please select a start date first" : ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange("status", value)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 3: Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the batch, program details, or any additional notes..."
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="bg-white resize-none min-h-[80px]"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
