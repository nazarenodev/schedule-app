# Full-Stack Scheduling Application

This repository contains a full-stack scheduling application built with a modern technology stack. The project is structured as a monorepo using **Turborepo** to manage the backend API, the frontend web application, and a shared core logic library.

## Key Features

* **Event Type Creation**: Users can define new types of events they want to offer (e.g., "30 Minute Call", "1 Hour Consultation").
* **Availability Management**: Users can set blocks of time when they are available for specific event types.
* **Dynamic Slot Booking**: The system automatically calculates and displays available time slots for booking based on the event duration and owner's availability.
* **Conflict Detection**: Prevents double-booking for both the event owner and the person booking.
* **User Dashboard**: A "My Bookings" page where users can view all their upcoming and past appointments.

## Tech Stack

* **Monorepo**: [**Turborepo**](https://turbo.build/repo) for high-performance builds and code sharing.
* **Backend**:
  * [**Nest.js**](https://nestjs.com/): A progressive Node.js framework for building efficient and scalable server-side applications.
  * [**Prisma**](https://www.prisma.io/): Next-generation Node.js and TypeScript ORM.
  * [**PostgreSQL**](https://www.postgresql.org/): A powerful, open-source object-relational database system.
* **Frontend**:
  * [**React**](https://reactjs.org/): A JavaScript library for building user interfaces.
  * **Vite**: A next-generation frontend tooling that provides a faster and leaner development experience.
  * **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
  * [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
* **Shared Logic**:
  * A dedicated **TypeScript** package (`@scheduler/core`) containing shared business logic classes used by both the frontend and backend.

## Project Structure

The monorepo is organized into `apps` and `packages`, a standard convention for Turborepo projects.

```
/
├── apps/
│   ├── api/          # Nest.js backend application
│   └── web/          # React (Vite) frontend application
│
├── packages/
│   ├── core/         # Shared TypeScript classes (TimeSlot, Booking, etc.)
│   └── tsconfig/     # Shared TypeScript configurations
│
└── turbo.json        # Turborepo pipeline configuration
```

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [pnpm](https://pnpm.io/installation) (or your preferred package manager like npm/yarn)
* [Docker](https://www.docker.com/get-started) and Docker Compose (for running the PostgreSQL database)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Set Up Environment Variables

The backend requires a database connection string.

* Navigate to the `apps/api` directory.
* Rename the `.env.example` file to `.env`.
* Update the `DATABASE_URL` variable with your PostgreSQL connection details.

```
# In apps/api/.env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Start the Database

From the root of the project, start the PostgreSQL database using Docker Compose.

```bash
docker-compose up -d
```

### 4. Install Dependencies

From the **root** of **the project**, install all dependencies for all workspaces.

```bash
npm install
```

### 5. Run Database Migrations

Apply the Prisma schema to your running database to create the necessary tables.

```bash
npm --filter api db:push
# or `npm --filter api prisma migrate dev` if you prefer versioned migrations
```

### 6. Run the Application

Start both the backend API and the frontend web application in development mode.

```bash
npm run dev
```

Turborepo will start both services concurrently. You can access them at:

* **Frontend (Web)**: `http://localhost:5173` (or your configured Vite port)
* **Backend (API)**: `http://localhost:3000` (or your configured Nest.js port)
