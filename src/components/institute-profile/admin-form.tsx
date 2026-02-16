"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminFormData {
    id?: string;
    name: string;
    designation: string;
    department: string;
    employeeId: string;
    email: string;
    phone: string;
    accessLevel: AdminRole;
}

interface AdminFormProps {
    initialData?: AdminFormData;
    onSubmit: (data: AdminFormData) => void;
    onCancel: () => void;
}

export function AdminForm({ initialData, onSubmit, onCancel }: AdminFormProps) {
    const [formData, setFormData] = useState<AdminFormData>(
        initialData || {
            name: "",
            designation: "",
            department: "",
            employeeId: "",
            email: "",
            phone: "",
            accessLevel: "viewer",
        }
    );

    // Update form when initialData changes (e.g. switching between Add/Edit)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: "",
                designation: "",
                department: "",
                employeeId: "",
                email: "",
                phone: "",
                accessLevel: "viewer",
            });
        }
    }, [initialData]);


    const accessDescriptions = {
        admin: "Can view detailed student/batch analytics and download all formats",
        editor: "Can edit student/batch information but cannot view analytics",
        viewer: "Can only view student/batch data without editing or downloading",
    };

    const handleChange = (field: keyof AdminFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
                {/* Name & Employee ID Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Full name"
                            className="bg-white"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-sm font-medium text-gray-900">
                            Employee ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="employeeId"
                            placeholder="e.g., EMP001"
                            className="bg-white"
                            value={formData.employeeId}
                            onChange={(e) => handleChange("employeeId", e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Designation & Department Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="designation" className="text-sm font-medium text-gray-900">
                            Designation <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="designation"
                            placeholder="e.g., TPO"
                            className="bg-white"
                            value={formData.designation}
                            onChange={(e) => handleChange("designation", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium text-gray-900">
                            Department <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="department"
                            placeholder="e.g., CSE"
                            className="bg-white"
                            value={formData.department}
                            onChange={(e) => handleChange("department", e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            className="bg-white"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                            Phone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+91XXXXXXXXXX"
                            className="bg-white"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Access Level */}
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-900">
                        Access Level <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-1">
                        <Select
                            value={formData.accessLevel}
                            onValueChange={(value) => handleChange("accessLevel", value)}
                        >
                            <SelectTrigger className="bg-white w-full">
                                <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1.5">
                            {accessDescriptions[formData.accessLevel]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-gray-100 bg-gray-50/50">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-200 text-gray-700 hover:bg-white hover:text-gray-900"
                >
                    Cancel
                </Button>
                <Button type="submit" className="bg-[#ff9e44] hover:bg-[#ff8c2e] text-white">
                    {initialData ? "Save Changes" : "Add Admin"}
                </Button>
            </div>
        </form>
    );
}
