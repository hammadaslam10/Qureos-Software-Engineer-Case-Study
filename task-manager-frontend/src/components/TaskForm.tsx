import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTask } from '../services/TaskService.ts'; 
import { Task } from '../types/Task.ts'; 

interface TaskFormProps {
    onTaskAdded: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTask: Partial<Task> = { title, description, priority };

        try {
            const createdTask = await createTask(newTask);
            onTaskAdded(createdTask); 
            setTitle(''); 
            setDescription('');
            setPriority('Low');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4" >
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" >
                Add Task
            </Button>
        </Form>
    );
};

export default TaskForm;
