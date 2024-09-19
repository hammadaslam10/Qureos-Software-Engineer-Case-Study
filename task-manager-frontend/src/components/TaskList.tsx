import React, { useEffect, useState } from 'react';
import { Task } from '../types/Task';
import { getTasks, archiveTask, updateTask } from '../services/TaskService.ts'; 
import { Button, ListGroup, Pagination, Form } from 'react-bootstrap';
import TaskForm from './TaskForm.tsx'; 
import EditTaskModal from './EditTaskModal.tsx'; 

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [priority, setPriority] = useState<string | undefined>(undefined);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks(page, 10, sortOrder, priority);
                setTasks(response.tasks);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [page, sortOrder, priority]);

    const handleArchiveTask = async (id: string) => {
        try {
            await archiveTask(id);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error archiving task:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSortOrderChange = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPriority(event.target.value);
        setPage(1);
    };

    const handleTaskAdded = (newTask: Task) => {
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleCloseEditModal = () => {
        setEditingTask(null);
    };

    const handleSaveTask = async (updatedTask: Partial<Task>, taskId: string) => {
        try {
            await updateTask(taskId, updatedTask);
            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === taskId ? { ...task, ...updatedTask } : task))
            );
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div>
            <TaskForm onTaskAdded={handleTaskAdded} />

            <div className="d-flex justify-content-between mb-4">
                <div className="d-flex" style={{ width: '100%', maxWidth: '400px' }}>
                    <Button onClick={handleSortOrderChange} style={{ flex: 1, marginRight: '10px' }}>
                        Sort by Priority {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                    </Button>

                    <Form.Group controlId="priorityFilter" className="ml-3" style={{ flex: 1 }}>
                        <Form.Control as="select" value={priority} onChange={handlePriorityChange}>
                            <option value="">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </Form.Control>
                    </Form.Group>
                </div>
            </div>

            <ListGroup className="mt-3">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <ListGroup.Item key={task._id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{task.title}</h5>
                                <p>{task.description}</p>
                                <p className={`text-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                                    Priority: {task.priority}
                                </p>
                            </div>
                            <div className='buttons'>
                                <Button variant="warning" onClick={() => handleEditTask(task)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleArchiveTask(task._id)} className="ml-2">
                                    Archive
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p>No tasks available.</p>
                )}
            </ListGroup>

            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === page}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                </Pagination>
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onSave={handleSaveTask}
                    onClose={handleCloseEditModal}
                />
            )}
        </div>
    );
};

export default TaskList;
