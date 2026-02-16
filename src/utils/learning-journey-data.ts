export type SessionStatus = "completed" | "in_progress" | "upcoming" | "yet_to_schedule";

export interface SessionData {
    id: string;
    title: string;
    date: string;
    duration: string;
    status: SessionStatus;
}

export interface ModuleData {
    id: string;
    name: string;
    totalSessions: number;
    completedSessions: number;
    sessions: SessionData[];
}

export interface LearningJourneyData {
    batchTitle: string;
    batchSubtitle: string;
    batchStatus: string;
    programLabel: string;
    moduleName: string;
    totalModules: number;
    programDuration: string;
    startDate: string;
    endDate: string;
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    upcomingSessions: number;
    upNext: {
        title: string;
        date: string;
        duration: string;
    };
    modules: ModuleData[];
}

export const dummyLearningJourney: LearningJourneyData = {
    batchTitle: "PGP 2024-26 Batch A",
    batchSubtitle: "Learning Journey Visualization",
    batchStatus: "active",
    programLabel: "PGP - 1st Year",
    moduleName: "Career Development Module",
    totalModules: 10,
    programDuration: "12 weeks",
    startDate: "Nov 1, 2025",
    endDate: "Jan 20, 2026",
    totalSessions: 19,
    completedSessions: 3,
    inProgressSessions: 1,
    upcomingSessions: 15,
    upNext: {
        title: "Diagnostic Interview with Industry Mentor",
        date: "Nov 26",
        duration: "1h",
    },
    modules: [
        {
            id: "clarity",
            name: "Clarity",
            totalSessions: 7,
            completedSessions: 3,
            sessions: [
                {
                    id: "s1",
                    title: "Orientation",
                    date: "Nov 1",
                    duration: "2h",
                    status: "completed",
                },
                {
                    id: "s2",
                    title: "Know Yourself Test",
                    date: "Nov 5",
                    duration: "1h",
                    status: "completed",
                },
                {
                    id: "s3",
                    title: "Domain Skill Assessment by AI",
                    date: "Nov 8",
                    duration: "1.5h",
                    status: "completed",
                },
                {
                    id: "s4",
                    title: "Career Compass Workshop",
                    date: "Nov 12",
                    duration: "2h",
                    status: "in_progress",
                },
                {
                    id: "s5",
                    title: "Industry Insights Panel",
                    date: "Nov 15",
                    duration: "1.5h",
                    status: "upcoming",
                },
                {
                    id: "s6",
                    title: "Goal Setting Session",
                    date: "Nov 18",
                    duration: "1h",
                    status: "upcoming",
                },
                {
                    id: "s7",
                    title: "Mentor Matching",
                    date: "Nov 22",
                    duration: "1h",
                    status: "upcoming",
                },
            ],
        },
        {
            id: "preparation",
            name: "Preparation",
            totalSessions: 6,
            completedSessions: 0,
            sessions: [
                {
                    id: "s8",
                    title: "Resume Building Workshop",
                    date: "Nov 26",
                    duration: "2h",
                    status: "upcoming",
                },
                {
                    id: "s9",
                    title: "LinkedIn Profile Optimization",
                    date: "Nov 29",
                    duration: "1h",
                    status: "upcoming",
                },
                {
                    id: "s10",
                    title: "Portfolio Development",
                    date: "Dec 3",
                    duration: "2h",
                    status: "upcoming",
                },
                {
                    id: "s11",
                    title: "Communication Skills",
                    date: "Dec 6",
                    duration: "1.5h",
                    status: "upcoming",
                },
                {
                    id: "s12",
                    title: "Networking Strategies",
                    date: "Dec 10",
                    duration: "1h",
                    status: "upcoming",
                },
                {
                    id: "s13",
                    title: "Personal Branding",
                    date: "Dec 13",
                    duration: "1.5h",
                    status: "upcoming",
                },
            ],
        },
        {
            id: "last-mile-prep",
            name: "Last-Mile Prep",
            totalSessions: 6,
            completedSessions: 0,
            sessions: [
                {
                    id: "s14",
                    title: "Mock Interview Round 1",
                    date: "Dec 17",
                    duration: "2h",
                    status: "upcoming",
                },
                {
                    id: "s15",
                    title: "Group Discussion Practice",
                    date: "Dec 20",
                    duration: "1.5h",
                    status: "upcoming",
                },
                {
                    id: "s16",
                    title: "Case Study Workshop",
                    date: "Jan 3",
                    duration: "2h",
                    status: "upcoming",
                },
                {
                    id: "s17",
                    title: "Mock Interview Round 2",
                    date: "Jan 7",
                    duration: "2h",
                    status: "upcoming",
                },
                {
                    id: "s18",
                    title: "Final Assessment",
                    date: "Jan 13",
                    duration: "1.5h",
                    status: "upcoming",
                },
                {
                    id: "s19",
                    title: "Placement Readiness Review",
                    date: "Jan 17",
                    duration: "1h",
                    status: "upcoming",
                },
            ],
        },
    ],
};
