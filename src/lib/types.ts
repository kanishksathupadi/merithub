
export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    category: 'Academics' | 'Extracurriculars' | 'Competitions & Events' | 'Skill Building';
    grade: string;
    completed: boolean;
    relatedResources?: { title: string; url: string }[];
};
