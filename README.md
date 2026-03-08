# Smart Restaurant Reservation System

A full-stack prototype for searching and visualizing restaurant table availability.

Users can choose a date and party size, filter by zone and seating preferences, view the restaurant floor plan, select a table, with the best option highlighted by the system, and step through a simple booking confirmation flow.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Spring Boot
- Java runtime: Java 25
- Reverse proxy: Nginx
- Containers: Docker Compose

## Running the Project

### Option 1: Docker Compose

Recommended for running the full stack behind Nginx.

#### Requirements

- Docker
- Docker Compose

#### Start

From the project root:

```bash
docker compose up --build
```

#### URLs

- App: [http://localhost](http://localhost)
- Backend API through Nginx: [http://localhost/api](http://localhost/api)
- Backend container port: [http://localhost:8080/api](http://localhost:8080/api)

### Option 2: Run Locally Without Docker

#### Backend

Requirements:

- Java 25

Start the backend:

```bash
cd backend
./gradlew bootRun
```

On Windows:

```powershell
cd backend
.\gradlew.bat bootRun
```

Backend base URL:

- [http://localhost:8080/api](http://localhost:8080/api)


#### Frontend

Requirements:

- Node.js 20 or newer
- npm

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- [http://localhost:5173](http://localhost:5173)

Note: when running the frontend separately from Nginx, API calls still target `/api/search`, so you may need a local proxy or run the stack through Docker Compose for the smoothest experience.

## Features

- Search for tables by date/time and party size
- Filter by restaurant zone
- Apply seating preferences
- Visualize availability on an interactive floor plan
- Highlight recommended tables
- Recommend merged adjacent tables when one table is not enough
- Confirm a booking in a dedicated summary screen
- Show an optional chef's offer during confirmation

### Table States

| State | Meaning |
| --- | --- |
| Available | The table is visible and not occupied for the selected time |
| Occupied | The table already has an overlapping booking |
| Recommended | The backend considers this the best fit for the request |
| Selected | The user has picked this table for the reservation |

## Project Structure

```text
.
|- frontend/   React application and floor plan UI
|- backend/    Spring Boot API and recommendation logic
|- nginx/      Reverse proxy configuration
|- test.http   Example API request
\- docker-compose.yml
```

## How It Works

### Recommendation Logic

The backend recommendation service scores available tables using:

- party size
- table capacity
- seating preferences
- zone filter
- time overlap with existing bookings

Smaller groups are favored toward tables that fit more tightly, so the system avoids wasting large tables when a better-sized option exists.

### Combined Tables

If no single table can seat the whole party, the backend can recommend a pair of mergeable tables.

Rules:

- both tables must be available
- both tables must belong to the same zone
- the pair must be marked as mergeable in the table data
- the combined capacity must be large enough for the group

## API

### Search Tables

Endpoint:

```http
POST /api/search
Content-Type: application/json
```

Example request:

```json
{
  "start": "2026-03-05T19:00:00",
  "partySize": 4,
  "zone": "TERRACE"
}
```

You can also use the sample request in [`test.http`]

## External Dependency

During the booking confirmation step, the frontend fetches a random chef's offer from [TheMealDB](https://www.themealdb.com/). If that service is unavailable, the reservation flow still works, but the meal suggestion may not load.

## Tests

Backend tests can be run with:

```bash
cd backend
./gradlew test
```

## Notes

- The current project uses in-memory repositories, so bookings and table state reset when the backend restarts.
- The frontend includes a group size limit for online bookings above 12 guests.
- Nginx is used in the Docker setup to expose the frontend and backend under one host.


  For additional implementation notes, assumptions, and MVP trade-offs, see `DECISIONS_AND_ASSUMPTIONS.md`.

## Author

Fred Brosman  
TalTech - Smart Systems and Applied Information Technology

Created as part of the CGI Summer Internship application assignment.
