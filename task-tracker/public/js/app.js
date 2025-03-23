const PORT = 1111;
const HOST = 'localhost';

// Constants
const API_URL = `http://${HOST}:${PORT}/api/tasks`;
const PEOPLE = ['Komal', 'Ankush', 'Animesh', 'Ashvini', 'Nasar', 'Intern1'];
const STATUS_TYPES = ['pending', 'in-progress', 'completed'];

// State
let tasks = [];
let dates = [];
let currentDialogData = {
    person: '',
    date: '',
    description: ''
};

// Format date to YYYY-MM-DD
function formatDateToISO(dateStr) {
    try {
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateStr);
            return null;
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', dateStr, error);
        return null;
    }
}

// Initialize dates (next 7 days)
function generateDates() {
    const today = new Date();
    dates = []; // Clear existing dates
    
    for (let i = -4; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formattedDate = formatDateToISO(date);
        if (formattedDate) {
            dates.push(formattedDate);
        }
    }
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('Invalid date for display:', dateString);
            return dateString;
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });
    } catch (error) {
        console.error('Error formatting date for display:', dateString, error);
        return dateString;
    }
}

// Render status icon
function renderStatusIcon(status) {
    switch (status) {
        case 'completed':
            return '<i class="fas fa-check status-completed"></i>';
        case 'in-progress':
            return '<i class="fas fa-minus status-in-progress"></i>';
        default:
            return '<i class="fas fa-circle-notch"></i>';
    }
}

// Get tasks for a specific cell
function getTasksForCell(person, date) {
    const formattedDate = formatDateToISO(date);
    if (!formattedDate) return [];
    
    const cellTasks = tasks.filter(task => {
        const taskDate = formatDateToISO(task.date);
        const matches = task.person === person && taskDate === formattedDate;
        return matches;
    });
    
    return cellTasks;
}

// Find cell element for a person and date
function findCell(person, date) {
    
    // Normalize the date format
    const normalizedDate = formatDateToISO(date);
    if (!normalizedDate) {
        console.error('Invalid date format:', date);
        return null;
    }
    
    const dateIndex = dates.indexOf(normalizedDate);
    if (dateIndex === -1) {
        console.warn(`Date ${normalizedDate} not in available dates:`, dates);
        return null;
    }

    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.error('Table body not found');
        return null;
    }

    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    const row = rows.find(row => row.cells[0].textContent.trim() === person);
    
    if (!row) {
        console.warn(`Person ${person} not found in table rows`);
        return null;
    }

    if (!row.cells[dateIndex + 1]) {
        console.warn(`Cell index ${dateIndex + 1} not found for ${person}`);
        return null;
    }

    const taskList = row.cells[dateIndex + 1].querySelector('.task-list');
    if (!taskList) {
        console.warn(`Task list container not found in cell for ${person} on ${normalizedDate}`);
        return null;
    }

    console.log(`Found cell for ${person} on ${normalizedDate}`);
    return taskList;
}

// Initialize table
function initializeTable() {
    
    // Add date headers
    const headerRow = document.getElementById('headerRow');
    dates.forEach(date => {
        const th = document.createElement('th');
        th.textContent = formatDate(date);
        headerRow.insertBefore(th, headerRow.lastElementChild);
    });

    // Add rows for each person
    const tableBody = document.getElementById('tableBody');
    PEOPLE.forEach(person => {
        const row = document.createElement('tr');
        
        // Add name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = person;
        row.appendChild(nameCell);

        // Add cells for each date
        dates.forEach(date => {
            const cell = document.createElement('td');
            cell.className = 'task-cell';
            cell.innerHTML = `
                <div class="task-list"></div>
                <button class="add-task-button" onclick="openAddTaskDialog('${person}', '${date}')">
                    + Add Task
                </button>
            `;
            row.appendChild(cell);
        });

        // Add empty cell for the add date column
        row.appendChild(document.createElement('td'));
        
        tableBody.appendChild(row);
    });
    
    console.log('Table initialized');
}

// Clear all tasks from the table
function clearTasks() {
    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(list => {
        list.innerHTML = '';
    });
}

// Render tasks
function renderTasks() {
    
    // Clear existing tasks first
    clearTasks();
    
    // Render each task
    tasks.forEach(task => {
        
        const taskDate = formatDateToISO(task.date);
        if (!taskDate) {
            console.error('Invalid task date:', task.date);
            return;
        }
        
        const cell = findCell(task.person, taskDate);
        if (cell) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.dataset.taskId = task.id;
            taskElement.innerHTML = `
                <button class="task-checkbox" onclick="cycleTaskStatus('${task.id}')">
                    ${renderStatusIcon(task.status)}
                </button>
                <span class="task-text">${task.description}</span>
            `;
            cell.appendChild(taskElement);
            console.log(`Successfully rendered task for ${task.person} on ${taskDate}`);
        } else {
            console.warn(`Could not find cell for task:`, {
                person: task.person,
                date: taskDate,
                originalDate: task.date
            });
        }
    });
}

// Add new date column
function addNewDate() {
    const lastDate = new Date(dates[dates.length - 1]);
    lastDate.setDate(lastDate.getDate() + 1);
    const newDate = formatDateToISO(lastDate);
    dates.push(newDate);
    console.log('Added new date:', newDate);

    // Add new header
    const headerRow = document.getElementById('headerRow');
    const th = document.createElement('th');
    th.textContent = formatDate(newDate);
    headerRow.insertBefore(th, headerRow.lastElementChild);

    // Add new cell to each row
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const person = row.cells[0].textContent;
        const cell = document.createElement('td');
        cell.className = 'task-cell';
        cell.innerHTML = `
            <div class="task-list"></div>
            <button class="add-task-button" onclick="openAddTaskDialog('${person}', '${newDate}')">
                + Add Task
            </button>
        `;
        row.insertBefore(cell, row.lastElementChild);
    });
}

// Dialog functions
function openAddTaskDialog(person, date) {
    currentDialogData = { person, date, description: '' };
    const dialog = document.getElementById('addTaskDialog');
    const taskInput = document.getElementById('taskDescription');
    taskInput.value = '';
    dialog.classList.add('open');
    console.log('Opened dialog for:', { person, date });
    // Focus the input field
    setTimeout(() => taskInput.focus(), 100);
}

function closeAddTaskDialog() {
    const dialog = document.getElementById('addTaskDialog');
    dialog.classList.remove('open');
    document.getElementById('taskDescription').value = '';
}

// Task status management
function cycleTaskStatus(taskId) {
    console.log('Cycling status for task:', taskId);
    console.log(tasks[taskId-1]);
    const task = tasks[taskId-1];

    console.log(task,taskId);
    if (!task) {
        console.error('Task not found:', taskId);
        console.log(task);
        return;
    }

    const currentIndex = STATUS_TYPES.indexOf(task.status);
    if (currentIndex === -1) {
        console.error('Invalid current status:', task.status);
        return;
    }

    const nextIndex = (currentIndex + 1) % STATUS_TYPES.length;
    const newStatus = STATUS_TYPES[nextIndex];
    console.log(`Updating task ${taskId} status from ${task.status} to ${newStatus}`);
    
    updateTaskStatus(taskId, newStatus);
}

// API functions
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Normalize dates in tasks
        tasks = data.map(task => ({
            ...task,
            date: formatDateToISO(task.date) || task.date,
            status: task.status || 'pending'
        }));
        
        renderTasks();
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        alert('Failed to load tasks. Please try refreshing the page.');
    }
}

async function addTask() {
    const description = document.getElementById('taskDescription').value.trim();
    if (!description) return;

    const taskData = {
        person: currentDialogData.person,
        date: formatDateToISO(currentDialogData.date),
        description,
        status: 'pending'
    };

    try {
        console.log('Adding new task:', taskData);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTask = await response.json();
        console.log('Task added successfully:', newTask);
        tasks.push(newTask);
        renderTasks();
        closeAddTaskDialog();
    } catch (error) {
        console.error('Failed to add task:', error);
        alert('Failed to add task. Please try again.');
    }
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        console.log(`Updating task ${taskId} to status:`, newStatus);
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTask = await response.json();
        console.log('Task updated successfully:', updatedTask);
        // Update the task in our local state

        const taskIndex = tasks;
        console.log(taskIndex);
        if (taskIndex !== null) {
            tasks[taskIndex] = updatedTask;
            renderTasks();
            window.location.reload();
        }
    } catch (error) {
        console.error('Failed to update task status:', error);
        alert('Failed to update task status. Please try again.');
    }
}

// Initialize app
function initializeApp() {
    console.log('Initializing app...');
    generateDates();
    initializeTable();
    fetchTasks();

    // Event listeners
    document.getElementById('addDateBtn').addEventListener('click', addNewDate);
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.querySelector('.close-button').addEventListener('click', closeAddTaskDialog);
    
    // Add keyboard support for the dialog
    document.getElementById('taskDescription').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    console.log('App initialized');
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 