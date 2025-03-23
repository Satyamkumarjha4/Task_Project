# Task Tracker Application

This repository contains two different implementations of a task management application:

1. Card-based Task Tracker (Original)
2. Grid-based Task Tracker (New)

## 1. Card-based Task Tracker

A task management application with a card-based interface built using vanilla JavaScript for the frontend and Node.js/Express/MongoDB for the backend.

### Features

- Create, read, update, and delete tasks
- Set task priority (low, medium, high)
- Responsive card layout
- MongoDB database storage

### Location
```
task-tracker/frontend/index.html
```

## 2. Grid-based Task Tracker

A task management application with a grid-based interface that shows tasks by user and date.

### Features

- User-based task assignment
- Date-based task tracking
- Task status management (Completed, In Progress, Not Done)
- Status indicators with icons
- Add new date columns dynamically
- Local storage for task data
- Responsive grid layout with sticky headers and first column

### Location
```
task-tracker/frontend/grid-view/index.html
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection string)

## Setup

### Backend Setup (for Card-based implementation)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB connection string (optional):
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

### Frontend Setup

Both implementations use static HTML/CSS/JS, so you can serve them using any web server.
For development, you can use the Live Server extension in VS Code or any similar tool.

1. For the card-based implementation:
   - Open `frontend/index.html` in your browser

2. For the grid-based implementation:
   - Open `frontend/grid-view/index.html` in your browser

## API Endpoints (Card-based implementation)

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Project Structure

```
task-tracker/
├── frontend/
│   ├── index.html         # Card-based implementation
│   ├── grid-view/
│   │   └── index.html     # Grid-based implementation
│   ├── css/
│   │   └── styles.css     # Styling for card-based implementation
│   └── js/
│       └── app.js         # Frontend JavaScript for card-based implementation
├── backend/
│   ├── server.js          # Express server and API setup
│   ├── models/
│   │   └── Task.js        # Mongoose model for tasks
│   ├── routes/
│   │   └── tasks.js       # API route handlers
│   └── package.json       # Node.js dependencies
└── README.md              # This file
``` 