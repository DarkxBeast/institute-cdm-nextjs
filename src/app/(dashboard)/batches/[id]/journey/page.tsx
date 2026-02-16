import { LearningJourneyPage } from "@/components/learning-journey/LearningJourneyPage";
import { getLearningJourneyForBatch } from "@/app/actions/learning-journey";

interface JourneyPageProps {
    params: Promise<{ id: string }>;
}

export default async function JourneyPage({ params }: JourneyPageProps) {
    const { id } = await params;

    const { data, error } = await getLearningJourneyForBatch(id);

    return <LearningJourneyPage batchId={id} data={data} error={error} />;
}
