const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const { person, date, description, status = 'not-started' } = req.body;
    
    const task = new Task({
        id: uuidv4(),
        name: `${person}'s task`,
        person,
        date,
        description,
        status
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task status
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    
    try {
        const task = await Task.findOne({ id: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 