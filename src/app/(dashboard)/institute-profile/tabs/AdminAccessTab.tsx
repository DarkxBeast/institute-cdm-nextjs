"use client";

import { useState } from "react";
import { Shield, User, Edit2, Trash2, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AdminForm, AdminFormData } from "@/components/institute-profile/admin-form";

export default function AdminAccessTab() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminFormData | undefined>(undefined);

    const handleAddClick = () => {
        setEditingAdmin(undefined);
        setIsDialogOpen(true);
    }

    const handleEditClick = (admin: AdminFormData) => {
        setEditingAdmin(admin);
        setIsDialogOpen(true);
    }

    const handleFormSubmit = (data: AdminFormData) => {
        console.log("Form submitted:", data);
        // Here you would typically call an API to save/update the admin
        setIsDialogOpen(false);
    }

    // Mock data for existing admins
    const admins: AdminFormData[] = [
        {
            id: "1",
            name: "Dr. Ramesh Kumar",
            employeeId: "EMP001",
            designation: "Head of Placements",
            department: "Training & Placement",
            email: "ramesh.k@git.edu.in",
            phone: "+91 98765 01234",
            accessLevel: "admin"
        },
        {
            id: "2",
            name: "Mr. Arun Patel",
            employeeId: "EMP002",
            designation: "Training & Placement Officer",
            department: "Computer Science",
            email: "arun.p@git.edu.in",
            phone: "+91 98765 02345",
            accessLevel: "editor"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Info Banner */}
            <div className="rounded-lg border-l-4 border-orange-400 bg-orange-50/50 p-3 sm:p-4 flex items-start sm:items-center gap-3">
                <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-sm text-orange-800/90 leading-relaxed">
                    <span className="font-semibold text-orange-900 mr-1">Access Credentials:</span>
                    Each admin will receive login credentials via email and can access the dashboard based on their permission level.
                </p>
            </div>

            {/* Admin Cards */}
            <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both border-none shadow-none sm:border sm:border-gray-100 sm:shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100/50 pb-6">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                        <div className="space-y-1">
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">Admin Access & Permissions</CardTitle>
                            <CardDescription className="text-sm text-gray-500 max-w-2xl">
                                Manage POCs and assign role-based permissions.
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        onClick={handleAddClick}
                        className="bg-gray-900 hover:bg-black text-white w-full sm:w-auto shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transition-all duration-300 transform hover:-translate-y-0.5 shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Admin
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {admins.map((admin, index) => (
                            <div
                                key={admin.id}
                                className="border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-[#FF9E44] hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white group"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">
                                                {admin.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Admin #{index + 1}</h3>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-gray-600 border-gray-200 h-9 sm:h-8 text-xs sm:text-xs font-medium">
                                            Deactivate
                                        </Button>
                                        <div className="flex items-center border-l border-gray-200 pl-1 ml-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-gray-600 h-9 w-9 sm:h-8 sm:w-8"
                                                onClick={() => handleEditClick(admin)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 h-9 w-9 sm:h-8 sm:w-8">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Name</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1 truncate" title={admin.name}>{admin.name}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Employee ID</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1 truncate" title={admin.employeeId}>{admin.employeeId}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
                                            <p className="text-sm text-gray-700 mt-1 truncate" title={admin.email}>{admin.email}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</p>
                                            <p className="text-sm text-gray-700 mt-1">{admin.phone}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Designation</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1 truncate" title={admin.designation}>{admin.designation}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Department</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1 truncate" title={admin.department}>{admin.department}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 w-full justify-center sm:w-auto sm:justify-start">
                                            <Shield className="w-3.5 h-3.5 mr-2" />
                                            {admin.accessLevel === 'admin' ? 'Full Profile Access' : 'Edit Only Access'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                                    <p className="text-xs text-gray-500 text-center sm:text-left">
                                        {admin.accessLevel === 'admin'
                                            ? "Can view detailed student/batch analytics and download all formats"
                                            : "Can edit student/batch information but cannot view analytics"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Admin Form Dialog */}
            < Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="sm:max-w-[600px] p-0 border-0 bg-transparent shadow-none">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <DialogHeader className="p-6 border-b border-gray-100">
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {editingAdmin ? "Edit Admin" : "Add New Admin"}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 mt-1">
                                {editingAdmin
                                    ? "Update administrator details and permissions"
                                    : "Add a new administrator with specific access permissions"}
                            </DialogDescription>
                        </DialogHeader>

                        <AdminForm
                            initialData={editingAdmin}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog >
        </div >
    );
}
