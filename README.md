# Campus Notification Portal & Reusable Logging Package

This repository contains the complete frontend implementation for the Campus Notification Portal and its integrated reusable logging middleware package.

## Project Structure

*   `/logging-middleware`: A reusable, self-healing ESM logging package. Validates logs, manages API bearer tokens, caches them, and handles token expiration and retries.
*   `/notification-app-fe`: A React + Vite frontend application utilizing Material UI (MUI). Displays unread badges, supports light/dark mode selection, client-side pagination, and client-side filtering.
*   `notification-system-design.md`: Technical documentation explaining the system architecture and implementation decisions.

---

## Getting Started

### 1. Installation

First, install and link the reusable logging package inside the React application:

```bash
# Navigate to the frontend directory
cd notification-app-fe

# Install all dependencies and link the local logging middleware
npm install
```

### 2. Running the Development Server

Start the Vite local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the application.

### 3. Building for Production

Compile and bundle the production assets:

```bash
npm run build
```

The static files will be outputted to the `dist/` directory.

### 4. Running Lint Checks

Check for code quality issues:

```bash
npm run lint
```
