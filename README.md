## Live Demo

You can try out StudManage live at  
[![StudManage Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-blue?style=for-the-badge&logo=vercel)](https://tlesees.vercel.app/)

---

## Video Demo

[![Watch Video Demo](https://img.shields.io/badge/Watch%20Video-Demo-red?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1tyskw-Nc9F5cUxXKBh3O8Sx1Ecpj1vJQ/view?usp=sharing)


# StudManage

StudManage is a full-stack web application for managing student information. This project is organized into two main parts: a backend (Node.js/Express) and a frontend (Next.js/React).

---
---



## Project Structure

```
.
backend/
├── config/
│   ├── models/
│   │   ├── Student.js
│   │   └── db.js
│   └── cron/
│       └── cfSync.js
├── routes/
│   ├── exportRoutes.js
│   ├── leaderboardRoutes.js
│   └── studentRoutes.js
├── utils/
│   └── inactivityEmail.js
|
└── frontend/
    ├── app/
    │   ├── layout.js
    │   ├── page.js
    │   └── globals.css
    ├── public/
    ├── package.json
    ├── next.config.mjs
    ├── tailwindcss/
    └── .next/
```

---
---

## Backend

- **Tech Stack:** Node.js, Express
- **Location:** `backend/`
- **Main Files:**
  - `app.js`: Express app setup.
  - `server.js`: Server entry point.
  - `config/db.js`: Database configuration.
- **Environment:** Configure environment variables in `backend/.env`.

### Getting Started (Backend)

```sh
cd backend
npm install
npm start
```

---
---

## Frontend

- **Tech Stack:** Next.js, React, Tailwind CSS
- **Location:** `frontend/`
- **Main Files:**
  - `app/layout.js`: Root layout.
  - `app/page.js`: Main page.
  - `globals.css`: Global styles.
  - `next.config.mjs`: Next.js configuration.
- **Static Assets:** Place images and other static files in `public/`.

### Getting Started (Frontend)

```sh
cd frontend
npm install
npm run dev
```

---
---

## API Documentation

### Base URL

```
http://localhost:5000/api/
```

---

### Student Management

#### Add Student

- **Endpoint:** `POST /api/add-student`
- **Description:** Add a new student to the database.
- **Request Body (JSON):**
  ```json
  {
    "name": "Aman Mishra",
    "email": "aman@example.com",
    "phone": "1234567890",
    "cf_handle": "aman13nitp"
  }
  ```
- **Response:**  
  `✅ Student added`

---

#### Edit Student by Codeforces Handle

- **Endpoint:** `PUT /api/edit-student-by-handle/:cf_handle`
- **Description:** Edit an existing student’s details using their Codeforces handle.
- **Request Params:**  
  `cf_handle` — The student’s Codeforces handle.
- **Request Body (JSON):**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "phone": "9876543210"
  }
  ```
- **Response:**  
  `✅ Student updated`

---

#### Delete Student by Codeforces Handle

- **Endpoint:** `DELETE /api/delete-student-by-handle/:cf_handle`
- **Description:** Delete a student using their Codeforces handle.
- **Request Params:**  
  `cf_handle` — The student’s Codeforces handle.
- **Response:**  
  `✅ Student deleted`

---

#### Download All Students as CSV

- **Endpoint:** `GET /api/download-students-csv`
- **Description:** Download the entire student dataset as a CSV file.
- **Response:**  
  Returns a file named `students.csv`.

---

#### Get List of Students

- **Endpoint:** `GET /api/get-students`
- **Description:** Retrieve a list of all students.
- **Response:**  
  Returns an array of student objects:
  ```json
  [
    {
      "_id": "68519771566b8401efb60ff1",
      "name": "Aman Kumar",
      "email": "aman.kumar@example.com",
      "phone": "9998887777",
      "cf_handle": "aman13nitp",
      "cf_contests": 24,
      "cf_problems_solved": 245,
      "current_rank": "pupil",
      "current_rating": 1253,
      "max_rating": 1253
    }
    
  ]
  ```

---

#### Get Student Profile

- **Endpoint:** `GET /api/:cf_handle`
- **Description:** Fetch the basic profile of a student by their Codeforces handle.
- **Response:**
  ```json
  {
    "name": "Aman Mishra",
    "cf_handle": "aman13nitp",
    "current_rating": 958
  }
  ```

---

#### Get Complete Student Details by ID

- **Endpoint:** `GET /api/get-student/:id`
- **Description:** Fetch complete details of a student by their unique ID.

---

### Leaderboard & Analytics

#### Get Top Students by Rating Gain (Last 30 Days)

- **Endpoint:** `GET /api/leaderboard/rating-gain`
- **Description:** Returns the top 10 students who gained the most Codeforces rating in the last 30 days.
- **Response:**
  ```json
  [
    {
      "_id": "68519771566b8401efb60ff1",
      "name": "Aman Kumar",
      "email": "aman.kumar@example.com",
      "phone": "9998887777",
      "cf_handle": "aman13nitp",
      "cf_contests": 24,
      "cf_problems_solved": 245,
      "current_rank": "pupil",
      "current_rating": 1253,
      "max_rating": 1253
    }
    
  ]
  ```

---

#### Get Students by Average Problems Solved per Day

- **Endpoint:** `GET /api/leaderboard/problems-per-day`
- **Description:** Returns top 10 students based on their average number of unique problems solved per day over the last 30 days.
- **Response:**
  ```json
  [
    {
      "name": "Aman",
      "cf_handle": "aman13nitp",
      "perDay": 1.7
    }
    
  ]
  ```

---

### Codeforces Data

#### Get Contest History

- **Endpoint:** `GET /api/contests/:cf_handle`
- **Description:** Returns the complete Codeforces contest history of the user.
- **Response:**
  ```json
  {
    "handle": "aman13nitp",
    "contests": [
      {
        "contestId": 1980,
        "contestName": "Codeforces Round 950 (Div. 3)",
        "rank": 26241,
        "oldRating": 0,
        "newRating": 351,
        "ratingChange": 351,
        "time": "2024-06-03T15:00:00.000Z"
      }
      
    ]
  }
  ```

---

#### Get Problem Solving Analytics

- **Endpoint:** `GET /api/problems/:cf_handle?days=30`
- **Description:** Provides analytics about a user's problem-solving activity on Codeforces.
- **Query Params:**  
  `days` (optional): Number of days to filter (allowed: 7, 30 [default], or 90)
- **Response:**
  ```json
  {
    "handle": "aman13nitp",
    "range": 30,
    "totalSolved": 45,
    "averageRating": "1423.55",
    "averagePerDay": "1.50",
    "mostDifficult": {
      "name": "Hardest Problem",
      "contestId": 1234,
      "index": "F",
      "rating": 1900
    },
    "ratingBuckets": {
      "800": 5,
      "900": 10,
      "1100": 7
    },
    "submissionHeatmap": {
      "2024-06-01": 3,
      "2024-06-02": 1
      
    }
  }
  ```

---

#### Get Unsolved Problems

- **Endpoint:** `GET /api/unsolved/:cf_handle`
- **Description:** Returns a list of unsolved problems for the given Codeforces handle.

---

### Cron Job Management

#### List Cron Jobs

- **Endpoint:** `GET /api/cron/list-cf-cron`
- **Description:** Retrieve a list of scheduled cron jobs.
- **Response:**
  ```json
  {
    "schedules": ["2:30 PM", "5:00 PM"]
  }
  ```

---

#### Add Cron Job

- **Endpoint:** `POST /api/cron/add-cf-cron`
- **Description:** Add a new cron job.
- **Request Body (JSON):**
  ```json
  { "time": "9:30 PM" }
  ```

---

#### Remove Cron Job

- **Endpoint:** `POST /api/cron/remove-cf-cron`
- **Description:** Remove a scheduled cron job.
- **Request Body (JSON):**
  ```json
  { "time": "11:00 AM" }
  ```
- **Response:**
  ```json
  {
    "message": "",
    "schedules": ["5:00 PM"]
  }
  ```

---

#### Update Cron Schedule

- **Endpoint:** `POST /api/cron/update-cf-cron`
- **Description:** Update the cron schedule for a specified task.
- **Request Body (JSON):**
  ```json
  { "times": ["5:00 PM", "11:00 AM"] }
  ```
- **Response:**
  ```json
  {
    "message": "",
    "schedules": ["5:00 PM", "11:00 AM"]
  }
  ```

---

### Inactivity & Email Reminders

#### Get Inactivity Reminder Count

- **Endpoint:** `GET /api/inactivity/reminder-count/:userId`
- **Description:** Get the count of inactivity reminders for a user.
- **Response:**
  ```json
  {
    "name": "",
    "email": "",
    "cf_handle": "",
    "reminder_count": 0
  }
  ```

---

#### Change Auto Email Disabled

- **Endpoint:** `PATCH /api/inactivity/auto-email/:userId`
- **Description:** Enable or disable auto-email reminders for a user.
- **Request Body (JSON):**
  ```json
  { "disable": false }
  ```
- **Response:**
  ```json
  {
    "message": "",
    "auto_email_disabled": true
  }
  ```

---

#### Fetch Auto Email Status

- **Endpoint:** `GET /api/inactivity/fetch-auto-email/:userId`
- **Description:** Get the status of the auto email feature for a user.
- **Response:**
  ```json
  {
    "name": "",
    "auto_email_disabled": true
  }
  ```

---

### Health Check

#### Root Endpoint

- **Endpoint:** `GET /`
- **Description:** Health check endpoint. Returns a plain text message.
- **Response:**  
  `Hello, World!`

---

### Notes

- All endpoints are prefixed with `/api`.
- For `POST` and `PUT` requests, set the `Content-Type` header to `application/json`.
- Replace `:cf_handle` or `:userId` with the actual handle or user ID.
- For more details, refer to the sample requests and responses above.
