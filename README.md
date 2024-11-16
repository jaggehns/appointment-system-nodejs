# Appointment Scheduling System API

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A RESTful API for scheduling appointments, developed using **Node.js** with **TypeScript**. The system supports creating, viewing, and canceling appointments, with configurable slot durations and operational parameters. This project was designed to meet the requirements of a Senior Backend Engineer role challenge.

---

## System Design Overview

### Components Overview
1. **API Server (Express.js)**: Routes incoming requests, performs necessary operations, and sends responses.
2. **Business Logic Layer**: Contains the core logic for booking and managing appointments.
3. **Database (PostgreSQL)**: Stores appointments, configurations, days off, and unavailable hours, managed via Prisma ORM.
4. **Error Handling & Validation (Zod)**: Ensures data integrity and security by validating incoming requests.
5. **Configuration Layer**: Manages slot durations, operational hours, days off, and more.

---

## Project Overview

### Business Logic
- **Default Slot Duration**: 30 minutes.
- **Operational Hours**: Weekdays from 9 AM to 6 PM.
- **Double Booking Prevention**: Ensures slots cannot be booked multiple times.

### API Endpoints

#### Appointment Endpoints
- **GET /v1/api/appointment/available-slots**: Retrieve available slots for a specified date.
- **POST /v1/api/appointment/**: Book an appointment if the slot is available.
- **DELETE /v1/api/appointment/:id**: Cancel an existing appointment.

#### Configuration Endpoints
- **GET /v1/api/configuration/**: Retrieve the current configuration settings, including slot duration, operational hours, days off, and unavailable hours.
- **PUT /v1/api/configuration/**: Update the configuration settings. Supports updating slot duration, operational hours, days off, and unavailable hours.

---

## Appointment Endpoints

---

### **GET /v1/api/appointment/available-slots**
**Description**: Retrieve available slots for a specified date.

**Request Parameters**:
- `date` (query parameter, required): The date for which to retrieve available slots in `YYYY-MM-DD` format.

**Example Request**:  
- `GET /v1/api/appointment/available-slots?date=2024-04-04`

**Example Response**:
```json
[
  {
    "time": "09:00",
    "available_slots": 1
  },
  {
    "time": "09:30",
    "available_slots": 1
  },
  {
    "time": "10:00",
    "available_slots": 0
  }
]
```

### **POST /v1/api/appointment/**
**Description**: Book an appointment if the slot is available.

**Request Body**:
```json
{
  "date": "2024-04-04",
  "time": "09:30",
  "slots": 1
}
```

**Example Request**:  
- `POST /v1/api/appointment/`

**Example Response**:
```json
{
  "message": "Appointment booked successfully"
}
```
OR

```json
{
  "message": "Slot is already fully booked"
}
```

### **DELETE /v1/api/appointment/**
**Description**: Cancel an existing appointment.

**Request Parameters**:
- `id` (path parameter, required): The ID of the appointment to cancel.

**Example Request**:  
- `DELETE /v1/api/appointment/123`

**Example Response**:
```json
{
  "message": "Appointment canceled successfully"
}
```
OR
```json
{
  "message": "Appointment not found"
}
```
---

## Configuration Endpoints

---

### **GET /v1/api/configuration/**
**Description**: Retrieve the current configuration settings, including slot duration, operational hours, days off, and unavailable hours.

**Example Request**:  
- `GET /v1/api/configuration/`

**Example Response**:
```json
{
  "slotDuration": 30,
  "maxSlots": 1,
  "startHour": "09:00",
  "endHour": "18:00",
  "daysOff": [
    { "date": "2024-04-10", "description": "Public Holiday" }
  ],
  "unavailableHours": [
    { "dayOfWeek": "Monday", "startTime": "12:00", "endTime": "13:00" }
  ]
}
```

### **PUT /v1/api/configuration/**
**Description**: Update the configuration settings.

**Request Body**:
```json
{
  "slotDuration": 15,
  "maxSlots": 2,
  "startHour": "08:00",
  "endHour": "17:00",
  "daysOff": [
    { "date": "2024-04-10", "description": "Public Holiday" }
  ],
  "unavailableHours": [
    { "dayOfWeek": "Friday", "startTime": "12:00", "endTime": "13:00" }
  ]
}

```
---

## Configuration Options

### Basic Level
- **Slot Duration**: Configurable, with a minimum of 5 minutes.
- **Max Slots per Appointment**: Configurable, ranging from 1 to 5 slots.
- **Operational Hours & Days**: Configurable, with default set from 9 AM to 6 PM on weekdays.

### Advanced Level
- **Days Off**: Manage public holidays or other days when scheduling is disabled.
- **Unavailable Hours**: Specify unavailable hours, like lunch breaks, within operational days.

---

## Getting Started

### Prerequisites
- **Node.js** (version 20 or later)
- **pnpm** (version 9.3.0 or later)
- **Docker** (for running Supabase locally)
- **Supabase CLI** (for database setup)

## Getting Started

### Prerequisites
- **Node.js** (version 20 or later)
- **pnpm** (version 9.3.0 or later)
- **Docker** (for running Supabase locally)
- **Supabase CLI** (for database setup)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jaggehns/appointment-system-nodejs.git
   cd appointment-system-nodejs
   ```
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Configure Environment Variables**:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres?pgbouncer=true"
   PORT=3000
   NODE_ENV=development
   ```
4. **Setup Local Databas:**:
   - Docker must be running locally
   ```bash
   pnpm db-start 
   ```
   - Once you're done
   ```bash
   pnpm db-stop
   ```
5. **Run tests:=**:
   - Docker must be running locally
   ```bash
   pnpm test 
   ```
## Assumptions & Justifications

### Slot Duration
The default 30-minute slot duration was chosen as it suits most standard scheduling needs. However, the API supports customizable durations with a minimum of 5 minutes, allowing flexibility for different use cases.

### Operational Hours
The system is set to operate from 9 AM to 6 PM on weekdays, assuming these hours cover typical business needs. This is configurable for businesses that may operate on different schedules.

### Database Choice (PostgreSQL)
**Justification**: PostgreSQL was selected for its robustness, strong ACID compliance, and capability to handle complex queries efficiently. It is well-suited for applications requiring reliable and consistent data management, like an appointment scheduling system.

### Error Handling & Validation
Using **Zod** for schema validation ensures that all incoming data is validated and errors are handled gracefully. This prevents data corruption and provides meaningful error messages to API consumers.

### Days Off & Unavailable Hours
The system supports setting days off (e.g., public holidays) and unavailable hours (e.g., lunch breaks) to offer realistic scheduling options. These settings are stored in the database for easy updates and retrieval.

---

## Future Enhancements

### Authentication & Authorization
Implement user authentication to restrict access to certain API endpoints and provide role-based permissions.

### Notifications
Add functionality to send email or SMS reminders for appointments to improve user engagement and reduce no-shows.

### Admin Dashboard
Develop a front-end dashboard for admins to manage appointments, configure settings, and view reports.

### Rate Limiting & Security
Implement rate limiting to prevent abuse and improve API security. Further measures like API keys or OAuth2 can be considered for user authentication.

### Performance Optimization
Use caching mechanisms, such as Redis, to cache frequently accessed data and reduce load on the database.

---

## Tech Stack

- **Framework**: Node.js (Express.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (managed with Prisma ORM)
- **Logging**: Pino for efficient logging
- **Validation**: Zod for schema validation
- **Testing**: Jest and Supertest for thorough testing

   
   
