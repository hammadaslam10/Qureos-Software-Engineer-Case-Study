import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:4000/tasks';

export const getTasks = async (page: number, limit: number, sortOrder: 'asc' | 'desc', priority?: string) => {
    const params = { page, limit, sort: sortOrder, priority };
    const response = await axios.get<{ tasks: Task[], totalPages: number }>(`${API_URL}`, { params });
    return response.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
    const response = await axios.put(`${API_URL}/${id}`, task);
    return response.data;
};

export const archiveTask = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error archiving task:', error);
        throw error;
    }
};