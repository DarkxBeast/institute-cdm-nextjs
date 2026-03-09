"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentInterestsProps {
    sectorsOfInterest?: string[];
    domainsOfInterest?: string[];
}

export function StudentInterests({
    sectorsOfInterest = [],
    domainsOfInterest = [],
}: StudentInterestsProps) {
    const hasSectors = sectorsOfInterest.length > 0;
    const hasDomains = domainsOfInterest.length > 0;
    const hasAny = hasSectors || hasDomains;

    if (!hasAny) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sectors of Interest */}
            {hasSectors && (
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Sectors of Interest
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {sectorsOfInterest.map((sector, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1 text-sm font-medium"
                                >
                                    {sector}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Domains of Interest */}
            {hasDomains && (
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Domains of Interest
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {domainsOfInterest.map((domain, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 px-3 py-1 text-sm font-medium"
                                >
                                    {domain}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
