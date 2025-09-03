# Zizo_HealthVerse: A Futuristic Clinic Management Platform

Welcome to Zizo_HealthVerse, a next-generation clinic management application built with a focus on modern, data-driven, and AI-enhanced healthcare. This project, created in Firebase Studio, demonstrates a comprehensive, multi-user system with distinct portals for different roles within a futuristic clinic.

## Features

- **Five Role-Based Portals**: Secure, tailored user experiences for different roles:
    - **Admin**: A mission control center to manage users, view clinic analytics, and monitor system security.
    - **Doctor**: A dedicated portal to manage appointments, view patient charts, and utilize an AI assistant for generating consultation notes.
    - **Nurse**: A workflow-oriented interface to view schedules, manage assigned patients, and log patient vitals.
    - **Receptionist**: A front-desk hub for managing appointments, checking in patients, and registering new patient accounts.
    - **Patient**: A personal health dashboard to book appointments, view medical history, and interact with clinic services.
- **AI Symptom Checker**: A Genkit-powered AI Nurse Assistant that provides pre-diagnoses and triage scores based on patient-described symptoms.
- **Voice-Activated Check-in**: A futuristic voice recognition interface for patients to check in for their appointments.
- **Dynamic Dashboards & Analytics**: Live-updating dashboards for all roles, providing at-a-glance information relevant to their tasks. The admin portal includes charts for clinic-wide analytics.
- **End-to-End Appointment Booking**: A seamless, multi-step UI for booking appointments, complete with dynamic doctor filtering based on the selected service.
- **Secure Authentication & Database**: Built on Firebase for secure user authentication and a real-time Firestore database that powers the entire application.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom futuristic theme
- **UI Components**: ShadCN UI
- **Generative AI**: Google's Genkit
- **Backend & Database**: Firebase (Authentication, Firestore)

## Getting Started

### 1. Prerequisites
- Node.js and npm installed.
- A Firebase project.

### 2. Setup Environment Variables
- Create a `.env` file in the root directory.
- Add your Firebase project configuration keys to the `.env` file. These keys should be prefixed with `NEXT_PUBLIC_FIREBASE_`. You can get these from your Firebase project settings.
- Create a `serviceAccountKey.json` file in the root directory with your Firebase Admin SDK credentials. This is required for server-side actions.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

### 5. Create an Admin User
To access the admin portal, you need to create an admin user first. The credentials are pre-configured in the script.
- **Email**: `admin@clinic.io`
- **Password**: `password123`

Run the following command to create the user in your Firebase project:
```bash
npm run create-admin
```
You can now log in with these credentials to access the full administrative features.
