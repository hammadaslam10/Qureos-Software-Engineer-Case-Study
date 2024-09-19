import React from 'react';
import TaskForm from '../components/TaskForm.tsx';
import TaskList from '../components/TaskList.tsx';

const TaskPage: React.FC = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Qureos Task Manager</h1>

            <TaskList />
        </div>
    );
};

export default TaskPage;
