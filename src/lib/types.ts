

export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    category: 'Academics' | 'Extracurriculars' | 'Skill Building';
    grade: string;
    completed: boolean;
    relatedResources?: { title: string; url: string }[];
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
    id: string;
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
    
