"use client";

import { useState, useEffect } from "react";
import { getBatch } from "@/app/actions/batches";
import { getLearningJourneyForBatch, type LearningJourneyViewData } from "@/app/actions/learning-journey";
import { type BatchInfo, type Student } from "@/lib/validations/batch";
import FilterBar from "@/components/overview/batch-data/FilterBar";
import StatsGrid from "@/components/overview/batch-data/StatsGrid";
import ContentTabsPanel from "@/components/overview/batch-data/ContentTabsPanel";

// Types
interface Batch {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    studentCount: number;
    startDate: string;
    endDate: string;
}

interface BatchDetails {
    batchInfo: BatchInfo;
    students: Student[];
}

interface BatchDataSectionProps {
    batches: Batch[];
}

export default function BatchDataSection({ batches }: BatchDataSectionProps) {
    const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || "");
    const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
    const [learningJourneyData, setLearningJourneyData] = useState<LearningJourneyViewData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Find selected batch from the list
    const selectedBatch = batches.find(b => b.id === selectedBatchId);

    // Fetch detailed batch data + learning journey when selection changes
    useEffect(() => {
        if (!selectedBatchId) return;

        async function fetchBatchData() {
            setIsLoading(true);
            try {
                const [batchResult, journeyResult] = await Promise.all([
                    getBatch(selectedBatchId),
                    getLearningJourneyForBatch(selectedBatchId),
                ]);

                if (batchResult.data) {
                    setBatchDetails(batchResult.data);
                }
                setLearningJourneyData(journeyResult.data);
            } catch (error) {
                console.error("Error fetching batch data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBatchData();
    }, [selectedBatchId]);

    // Derive real stats from learning journey data and student data
    const totalStudents = selectedBatch?.studentCount || 0;

    // Calculate average performance (out of 5) from student overall scores
    const displayAvgPerformance = batchDetails?.students 
        ? (() => {
            let total = 0;
            let count = 0;
            batchDetails.students.forEach(s => {
                if (s.overallScore && s.overallScore !== "-") {
                    total += parseFloat(s.overallScore);
                    count++;
                }
            });
            return count > 0 ? `${(total / count).toFixed(1)} / 5.0` : "—";
        })()
        : "—";

    const stats = {
        totalStudents: totalStudents,
        avgPerformance: displayAvgPerformance,
        completionRate: learningJourneyData
            ? learningJourneyData.progress.percentage
            : 0,
        activeMentors: learningJourneyData?.mentors?.length ?? 0,
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Filter Bar */}
            <FilterBar
                batches={batches}
                selectedBatchId={selectedBatchId}
                onBatchChange={setSelectedBatchId}
            />

            {/* Stats Grid */}
            <StatsGrid
                totalStudents={stats.totalStudents}
                avgPerformance={stats.avgPerformance}
                completionRate={stats.completionRate}
                activeMentors={stats.activeMentors}
            />

            {/* Content Tabs Panel */}
            <ContentTabsPanel
                batchDetails={batchDetails}
                selectedBatch={selectedBatch}
                learningJourneyData={learningJourneyData}
                isLoading={isLoading}
            />
        </div>
    );
}
