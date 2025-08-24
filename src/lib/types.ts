
import { z } from "zod";

export type UserProfile = {
    uid: string;
    name: string;
    email: string;
    plan: 'standard' | 'elite';
    age: number | null;
    grade: number | null;
    onboardingCompleted: boolean;
    paymentCompleted: boolean;
};

export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    category: 'Academics' | 'Extracurriculars' | 'Skill Building';
    grade: string;
    completed: boolean;
    relatedResources?: { title: string; url: string }[];
    points?: number;
    dueDate?: string;
};

export type ForumReply = {
    id: string;
    user: string;
    avatar: string;
    hint: string;
    avatarUrl?: string;
    content: string;
    timestamp: string;
}

export type ForumPost = {
    id:string;
    user: string;
    avatar: string;
    hint: string;
    avatarUrl?: string;
    title: string;
    content: string;
    upvotes: number;
    tags: string[];
    replies: ForumReply[];
}

export type PracticeQuestion = {
    question: string;
    options: string[];
    answer: string;
}
    
export type EssayReviewFeedback = {
    clarity: {
        score: number;
        feedback: string;
    };
    grammar: {
        score: number;
        feedback: string;
    };
    structure: {
        score: number;
        feedback: string;
    };
    overall: {
        score: number;
        feedback: string;
    };
}

export const FindMatchingCollegesInputSchema = z.object({
  filterQuery: z.string().describe('The user\'s filter query (e.g., "small colleges", "schools in california").'),
  academicStrengths: z.string().describe('The academic strengths of the student.'),
  academicWeaknesses: z.string().describe('The academic weaknesses of the student.'),
  subjectsOfInterest: z.string().describe('Subjects and topics the student is passionate about.'),
  collegeEnvironment: z.string().describe('The type of college learning environment the student prefers.'),
  preferredLearningStyle: z.string().describe('The preferred learning style of the student.'),
  currentExtracurriculars: z.string().describe('The current extracurricular activities of the student.'),
  weeklyTimeAvailable: z.string().describe('The weekly time available for self-improvement in hours.'),
  grade: z.coerce.number().describe('The current grade level of the student (5-12).'),
});
export type FindMatchingCollegesInput = z.infer<typeof FindMatchingCollegesInputSchema>;

const CollegeSchema = z.object({
    name: z.string().describe("The full name of the college or university."),
    location: z.string().describe("The city and state of the college (e.g., 'Cambridge, MA')."),
    reasoning: z.string().describe("A brief, one-sentence summary of why this college is an excellent match for this specific student, directly referencing their profile."),
});

export const FindMatchingCollegesOutputSchema = z.object({
    reachSchools: z.array(CollegeSchema).describe("A list of 2 'reach' schools that are ambitious but potentially attainable."),
    targetSchools: z.array(CollegeSchema).describe("A list of 2 'target' schools where the student's profile is a strong match."),
    safetySchools: z.array(CollegeSchema).describe("A list of 2 'safety' schools where admission is very likely."),
});

export type FindMatchingCollegesOutput = z.infer<typeof FindMatchingCollegesOutputSchema>;
export type College = z.infer<typeof CollegeSchema>;


export type UserNotification = {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
};

export const FindScholarshipsInputSchema = z.object({
  academicProfile: z.string().describe("The student's academic profile, including GPA, test scores (SAT/ACT), and key subjects."),
  extracurriculars: z.string().describe("The student's main extracurricular activities, achievements, and leadership roles."),
  interests: z.string().describe("The student's personal interests, passions, and intended field of study."),
  background: z.string().describe("The student's background, including any relevant demographic information (e.g., first-generation student, specific heritage) or financial need."),
});
export type FindScholarshipsInput = z.infer<typeof FindScholarshipsInputSchema>;

export const FindScholarshipsOutputSchema = z.object({
    scholarships: z.array(z.object({
        name: z.string().describe("The name of the scholarship."),
        amount: z.string().describe("The scholarship award amount (e.g., '$10,000' or 'Full Tuition')."),
        deadline: z.string().describe("The application deadline for the scholarship."),
        description: z.string().describe("A brief summary of the scholarship and its eligibility requirements."),
        applicationUrl: z.string().url().describe("The direct, valid URL to the scholarship's application or information page."),
    })).describe("A list of 5 to 7 relevant scholarships."),
});
export type FindScholarshipsOutput = z.infer<typeof FindScholarshipsOutputSchema>;

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'human';
  timestamp: any; // Firestore Timestamp
};

export type Chat = {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastUpdatedAt: any; // Firestore Timestamp
  status: 'active' | 'human_requested' | 'resolved';
};
