export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
  }