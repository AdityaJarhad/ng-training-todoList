import React, { useEffect, useState } from 'react';
import todoListService from '../services/service';
import TaskForm from './taskForm';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await todoListService.getList();
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleTaskAdded = (newTask) => {
        setTasks([...tasks, newTask]);
        setShowForm(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
        setShowForm(false);
    };

    const handleDeleteTasks = async () => {
        try {
            await Promise.all(Array.from(selectedTasks).map(id => todoListService.deleteTask(id)));
            setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
            setSelectedTasks(new Set());
        } catch (error) {
            console.error('Error deleting tasks:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedTasks(prev => {
            const newSelectedTasks = new Set(prev);
            if (newSelectedTasks.has(id)) {
                newSelectedTasks.delete(id);
            } else {
                newSelectedTasks.add(id);
            }
            return newSelectedTasks;
        });
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allTaskIds = new Set(tasks.map(task => task.id));
            setSelectedTasks(allTaskIds);
        } else {
            setSelectedTasks(new Set());
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); 
    };

    const filteredTasks = tasks.filter(task =>
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Task List</h1>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="form-control"
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                />
            </div>
            <button className="btn btn-primary mb-3" onClick={handleAddTask}>
                Add Task
            </button>
            <button className="btn btn-danger mb-3" onClick={handleDeleteTasks} disabled={selectedTasks.size === 0}>
                Delete Selected Tasks
            </button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} />
                        </th>
                        <th scope="col">Assigned To</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Comments</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedTasks.has(task.id)}
                                    onChange={() => handleCheckboxChange(task.id)} 
                                />
                            </td>
                            <td>{task.assignedTo}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.priority}</td>
                            <td>{task.comments}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleEditTask(task)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
            {showForm && (
                <TaskForm 
                    onClose={handleCloseForm} 
                    onTaskAdded={handleTaskAdded} 
                    onTaskUpdated={handleTaskUpdated} 
                    task={editingTask} 
                />
            )}
        </div>
    );
};

export default TaskList;
