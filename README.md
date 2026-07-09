# Red Rose School Management Website

## Features
- Student registration with email notification
- Admission request handling and admin emails
- Teacher job application with resume upload
- Contact form and newsletter subscription
- Admin notifications with unread badge support

## Environment Variables
Copy `.env.example` to `.env` and fill in values.

## Installation
```bash
npm install
npm start
```

## API Endpoints
- POST /api/register
- POST /api/admissions
- POST /api/teacher-application
- POST /api/contact
- POST /api/newsletter
- GET /api/notifications
- PATCH /api/notifications/:id/read
