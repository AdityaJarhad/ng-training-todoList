const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let tasks = []; 

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).json(task); 
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;
    tasks = tasks.map((val, index) => (id === index ? updatedTask : val));
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter((val, index) => index !== id);
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
