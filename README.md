# Smart Restaurant Reservation System

A small full-stack prototype for a smart restaurant reservation system.

The application recommends suitable tables for a given party size and time, and allows users to visualize table availability on an interactive restaurant floor plan.

The system is implemented using:

- React + TypeScript frontend
- Spring Boot (Java 21) backend
- Nginx reverse proxy
- Docker Compose for running the full stack

---

# Running the Project

## Option 1 — Run with Docker (Recommended)

### Requirements

Make sure the following are installed:

- Docker
- Docker Compose

### Start the application

From the project root:

```bash
docker compose up --build
```

After the containers start:

Frontend  
http://localhost

Backend API  
http://localhost/api

---

## Option 2 — Run without Docker

### Start the Backend

Navigate to the backend directory and run the Spring Boot application:

```bash
cd backend
./gradlew bootRun
```

Backend will run on:

http://localhost:8080

---

### Start the Frontend

Navigate to the frontend directory and start the React application:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

http://localhost:5173

---

# Project Overview

The application allows users to:

- search for available tables
- filter results by party size, zone, and preferences
- visualize tables on a restaurant floor plan
- receive recommended tables
- confirm reservations

Tables on the floor plan are visually distinguished as:

| State | Description |
|------|------|
| Available | Free table |
| Occupied | Already booked |
| Recommended | Best match for the search |
| Selected | Table chosen by the user |

---

# Table Recommendation Logic

The backend recommends tables based on:

- party size
- table capacity
- seating preferences
- table availability

The system attempts to maximize seating efficiency, meaning that smaller groups are placed at appropriately sized tables when possible.

Example:

| Party Size | Table | Result |
|------|------|------|
| 2 | Table (2 seats) | Ideal |
| 2 | Table (8 seats) | Not recommended |

---

# Dynamic Table Combination

If the party size is larger than any single table, the system can recommend two adjacent tables that can be combined.

Rules for combining tables:

- tables must be in the same zone
- tables must be physically adjacent
- combined capacity must fit the group

Example:

Party size: 10  
Recommended: Table 11 (6 seats) + Table 12 (6 seats)

---

# Architecture

```
React (Frontend)
       |
       | REST API
       v
Spring Boot (Backend)
       |
       +-- Table Repository
       +-- Booking Repository
       +-- Recommendation Service
```

---

# Author

Fred Brosman  
TalTech – Smart Systems and Applied Information Technology

Created as part of the CGI Summer Internship application assignment.