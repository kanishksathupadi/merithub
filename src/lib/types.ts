

import { z } from "zod";

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

export const FindMatchingCollegesOutputSchema = z.array(z.object({
    name: z.string().describe("The full name of the college or university."),
    location: z.string().describe("The city and state of the college (e.g., 'Cambridge, MA')."),
    reasoning: z.string().describe("A brief, one-sentence summary of why this college is an excellent match for this specific student, directly referencing their profile."),
}));
export type FindMatchingCollegesOutput = z.infer<typeof FindMatchingCollegesOutputSchema>;

export type UserNotification = {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
};
