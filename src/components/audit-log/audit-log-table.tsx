"use client";

import { useState } from "react";
import {
    Download,
    Eye,
    FilePlus,
    FileEdit,
    CheckCircle2,
    Search,
    Filter,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AccessLevel = "Full Access" | "Partial Access" | "Read Only";
type ActionType = "VIEW" | "DOWNLOAD" | "CREATE" | "UPDATE" | "APPROVE";

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    accessLevel: AccessLevel;
    action: ActionType;
    resource: string;
    details: string;
    ipAddress: string;
}

const data: AuditLog[] = [
    {
        id: "1",
        timestamp: "Dec 19, 2024 10:30",
        user: "admin@iim.edu",
        accessLevel: "Full Access",
        action: "VIEW",
        resource: "Student Profile",
        details: "Viewed profile of Priya Sharma",
        ipAddress: "192.168.1.100",
    },
    {
        id: "2",
        timestamp: "Dec 19, 2024 10:15",
        user: "admin@iim.edu",
        accessLevel: "Full Access",
        action: "DOWNLOAD",
        resource: "Batch Report",
        details: "Downloaded CSV report for Batch 2024-A",
        ipAddress: "192.168.1.100",
    },
    {
        id: "3",
        timestamp: "Dec 19, 2024 09:45",
        user: "coordinator@iim.edu",
        accessLevel: "Partial Access",
        action: "CREATE",
        resource: "Feedback",
        details: "Submitted feedback for session_1",
        ipAddress: "192.168.1.105",
    },
    {
        id: "4",
        timestamp: "Dec 19, 2024 09:30",
        user: "admin@iim.edu",
        accessLevel: "Full Access",
        action: "UPDATE",
        resource: "Module Assignment",
        details: "Assigned Resume Writing module to Batch 2024 B",
        ipAddress: "192.168.1.100",
    },
    {
        id: "5",
        timestamp: "Dec 19, 2024 09:15",
        user: "rmanager@iim.edu",
        accessLevel: "Partial Access",
        action: "APPROVE",
        resource: "Mentor Request",
        details: "Approved mentor application from David Kumar",
        ipAddress: "192.168.1.108",
    },
    {
        id: "6",
        timestamp: "Dec 19, 2024 09:00",
        user: "viewer@iim.edu",
        accessLevel: "Read Only",
        action: "VIEW",
        resource: "Analytics Dashboard",
        details: "Accessed institution analytics overview",
        ipAddress: "192.168.1.100",
    },
    {
        id: "7",
        timestamp: "Dec 19, 2024 08:45",
        user: "viewer@iim.edu",
        accessLevel: "Read Only",
        action: "DOWNLOAD",
        resource: "Module Certificate",
        details: "Downloaded certificate for JavaScript Fundamentals",
        ipAddress: "192.168.1.112",
    },
    {
        id: "8",
        timestamp: "Dec 19, 2024 08:30",
        user: "admin@iim.edu",
        accessLevel: "Full Access",
        action: "CREATE",
        resource: "Batch",
        details: "Created new batch: Batch 2025-A",
        ipAddress: "192.168.1.100",
    },
    {
        id: "9",
        timestamp: "Dec 19, 2024 08:15",
        user: "coordinator@iim.edu",
        accessLevel: "Partial Access",
        action: "UPDATE",
        resource: "Student Report",
        details: "Updated performance report for Amit Kumar",
        ipAddress: "192.168.1.106",
    },
    {
        id: "10",
        timestamp: "Dec 19, 2024 08:00",
        user: "admin@iim.edu",
        accessLevel: "Full Access",
        action: "APPROVE",
        resource: "Student Application",
        details: "Approved enrollment for 5 new students",
        ipAddress: "192.168.1.100",
    },
];

const getAccessBadge = (level: AccessLevel) => {
    switch (level) {
        case "Full Access":
            return (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                    {level}
                </Badge>
            );
        case "Partial Access":
            return (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
                    {level}
                </Badge>
            );
        case "Read Only":
            return (
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                    {level}
                </Badge>
            );
    }
};

const getActionIcon = (action: ActionType) => {
    switch (action) {
        case "VIEW": return <Eye className="w-4 h-4" />;
        case "DOWNLOAD": return <Download className="w-4 h-4" />;
        case "CREATE": return <FilePlus className="w-4 h-4" />;
        case "UPDATE": return <FileEdit className="w-4 h-4" />;
        case "APPROVE": return <CheckCircle2 className="w-4 h-4" />;
    }
};

const getActionColor = (action: ActionType) => {
    switch (action) {
        case "VIEW": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
        case "DOWNLOAD": return "text-orange-400 bg-orange-500/10 border-orange-500/20"; // Keeping orange theme consistent or varying? Reference suggests uniform orange icons mostly
        case "CREATE": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
        case "UPDATE": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
        case "APPROVE": return "text-orange-400 bg-orange-500/10 border-orange-500/20 text-green-400 bg-green-500/10 border-green-500/20"; // Maybe verify this later, used green for approve usually
    }
    return "text-orange-500";
};


const ActionBadge = ({ action }: { action: ActionType }) => {
    // Custom styling to match the reference image's action badges
    // They look like: [Icon] ACTION_NAME
    // With a specific color per action or uniform.
    // The image shows orange for most. Let's use orange as primary accent.

    return (
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20`}>
                {getActionIcon(action)}
            </div>
            <span className="font-semibold text-sm">{action}</span>
        </div>
    )
}

export default function AuditLogTable() {
    const [filterAction, setFilterAction] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredData = data.filter((item) => {
        const matchesAction = filterAction === "all" || item.action === filterAction;
        const matchesSearch =
            item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesAction && matchesSearch;
    });

    const handleExport = () => {
        const headers = ["Timestamp", "User", "Access Level", "Action", "Resource", "Details", "IP Address"];
        const csvContent = [
            headers.join(","),
            ...filteredData.map(item => [
                item.timestamp,
                item.user,
                item.accessLevel,
                item.action,
                item.resource,
                `"${item.details}"`, // Wrap details in quotes to handle commas
                item.ipAddress
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "audit_logs.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search logs..."
                        className="pl-9 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-10 text-gray-900 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Select value={filterAction} onValueChange={setFilterAction}>
                        <SelectTrigger className="w-[140px] bg-white border-gray-200 text-gray-700">
                            <SelectValue placeholder="All Actions" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-700">
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="VIEW">View</SelectItem>
                            <SelectItem value="DOWNLOAD">Download</SelectItem>
                            <SelectItem value="CREATE">Create</SelectItem>
                            <SelectItem value="UPDATE">Update</SelectItem>
                            <SelectItem value="APPROVE">Approve</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm"
                        onClick={handleExport}
                    >
                        <Download className="w-4 h-4" />
                        Export Logs
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-b border-gray-200 hover:bg-transparent">
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">Timestamp</TableHead>
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">User</TableHead>
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">Access Level</TableHead>
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">Action</TableHead>
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">Resource</TableHead>
                            <TableHead className="h-12 px-6 font-semibold text-gray-500">Details</TableHead>
                            <TableHead className="h-12 px-6 text-right font-semibold text-gray-500">IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-orange-50/30 transition-colors">
                                    <TableCell className="h-16 px-6 text-sm text-gray-600 font-medium">{item.timestamp}</TableCell>
                                    <TableCell className="h-16 px-6 text-sm text-gray-900 font-medium">{item.user}</TableCell>
                                    <TableCell className="h-16 px-6">
                                        {getAccessBadge(item.accessLevel)}
                                    </TableCell>
                                    <TableCell className="h-16 px-6">
                                        <ActionBadge action={item.action} />
                                    </TableCell>
                                    <TableCell className="h-16 px-6 text-sm text-gray-600">{item.resource}</TableCell>
                                    <TableCell className="h-16 px-6 text-sm text-gray-500">{item.details}</TableCell>
                                    <TableCell className="h-16 px-6 text-right text-sm text-gray-500 font-mono">
                                        {item.ipAddress}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 px-2">
                <span>Showing {filteredData.length} of {data.length} total logs</span>
                <span>Last updated: Today at 10:30 AM</span>
            </div>
        </div>
    );
}
