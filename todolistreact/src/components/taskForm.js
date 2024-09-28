import React, { useState, useEffect } from 'react';
import todoListService from '../services/service';

const TaskForm = ({ onClose, onTaskAdded, onTaskUpdated, task }) => {
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (task) {
            setAssignedTo(task.assignedTo);
            setDueDate(task.dueDate);
            setPriority(task.priority);
            setComments(task.comments);
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { assignedTo, dueDate, priority, comments };

        if (task) {
            try {
                const response = await todoListService.updateTask(task.id, newTask);
                onTaskUpdated(response.data); 
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            // If adding, create a new task
            try {
                const response = await todoListService.createTask(newTask);
                onTaskAdded(response.data); // Notify parent to add the new task
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    return (
        <div className="modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
            <div className="modal-content" style={{ margin: '15% auto', padding: '20px', width: '300px', background: 'white' }}>
                <span onClick={onClose} style={{ cursor: 'pointer', float: 'right' }}>&times;</span>
                <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Assigned To</label>
                        <input type="text" className="form-control" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                            <option value="">Select</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Comments</label>
                        <textarea className="form-control" value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">{task ? 'Update Task' : 'Add Task'}</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
