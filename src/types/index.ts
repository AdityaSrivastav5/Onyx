export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
    subtasks?: {
        title: string;
        completed: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
}
