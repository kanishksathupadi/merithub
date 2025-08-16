export type RoadmapTask = {
    id: string;
    title: string;
    description: string;
    category: 'Academics' | 'Extracurriculars' | 'Competitions & Events' | 'Skill Building';
    dueDate: string;
    completed: boolean;
    relatedResources?: { title: string; url: string }[];
};
