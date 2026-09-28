Bilkul. Neeche **complete final `README.md`** hai, same clean format mein, aur Author section mein **Sumit Shahi** details included hain.

# ResQVision

AI-powered disaster verification and rescue service designed to verify disaster reports, predict disaster severity, and help rescue teams respond faster and more efficiently.

---

# Features

* AI-powered disaster report verification
* Disaster severity prediction
* AI-based disaster analysis
* Rescue response assistance
* Disaster report management
* REST API architecture
* Dedicated AI/ML microservice
* FastAPI-based AI service
* Interactive AI API documentation
* Modern responsive frontend
* Backend business logic and API management
* Independent AI service deployment
* Scalable microservice architecture
* Environment-based configuration
* Secure service-to-service communication
* Real-time communication between application services

---

# Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

## Backend

* Node.js
* Express.js
* REST API
* Database
* Environment Variables

## AI Service

* Python
* FastAPI
* Machine Learning
* AI-based disaster verification
* Disaster severity prediction

---

# Project Structure

```text
ResQVision/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── ai-service/
│   ├── models/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

```bash
cd ResQVision
```

---

# Client Setup

Open a terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Server Setup

Open another terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

Backend runs on the port configured in the `.env` file.

Example:

```text
http://localhost:5000
```

---

# AI Service Setup

Open another terminal:

```bash
cd ai-service
```

## Create Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate the environment:

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
```

Activate the environment:

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start AI Service

```bash
python app.py
```

AI service runs on:

```text
http://localhost:5001
```

FastAPI interactive documentation:

```text
http://localhost:5001/docs
```

---

# Environment Variables

## Server `.env`

Create a `.env` file inside the `server` directory.

```env
PORT=5000
DATABASE_URL=your_database_url
AI_SERVICE_URL=http://localhost:5001
```

Add or modify variables according to your backend implementation.

---

## AI Service `.env`

If the AI service requires environment variables, create:

```text
ai-service/.env
```

Example:

```env
MODEL_PATH=your_model_path
API_KEY=your_api_key
```

> The exact environment variables depend on the AI model and implementation used in the project.

---

# Architecture

ResQVision follows a three-service microservice architecture:

```text
                 ┌─────────────────────┐
                 │       CLIENT        │
                 │    React + Vite     │
                 └──────────┬──────────┘
                            │
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │       SERVER        │
                 │   Node.js + Express │
                 └──────────┬──────────┘
                            │
                            │ AI API
                            ▼
                 ┌─────────────────────┐
                 │     AI SERVICE      │
                 │   Python + FastAPI  │
                 └─────────────────────┘
```

---

# How It Works

ResQVision processes disaster reports through the following workflow:

```text
Disaster Report
       │
       ▼
┌──────────────────┐
│  React Frontend  │
└────────┬─────────┘
         │
         │ REST API
         ▼
┌──────────────────┐
│   Express Server │
└────────┬─────────┘
         │
         │ AI Request
         ▼
┌──────────────────┐
│   AI Service     │
│     FastAPI      │
└────────┬─────────┘
         │
         ├──► Disaster Verification
         │
         ├──► Severity Prediction
         │
         └──► AI Analysis
         │
         ▼
┌──────────────────┐
│   Server / DB    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Rescue Team /    │
│ Application UI   │
└──────────────────┘
```

---

# Disaster Verification

ResQVision uses AI-based analysis to help verify disaster reports.

The system receives disaster-related information and sends it to the AI service for analysis.

The verification workflow is:

```text
Disaster Report
       │
       ▼
Frontend
       │
       ▼
Backend API
       │
       ▼
AI Service
       │
       ▼
Disaster Verification
       │
       ▼
Verification Result
```

This helps reduce the time required to process and assess incoming disaster reports.

---

# Severity Prediction

The AI service analyzes disaster-related information and predicts the potential severity of an incident.

Example severity levels:

```text
Low
Medium
High
Critical
```

The actual severity categories depend on the trained AI model and project implementation.

Severity information can help rescue teams prioritize incidents and make more informed response decisions.

---

# AI Features

ResQVision uses artificial intelligence to:

* Verify disaster reports
* Analyze disaster-related information
* Predict disaster severity
* Generate AI-based predictions
* Assist emergency response decisions
* Process incoming disaster information
* Provide structured AI analysis through APIs

---

# API Documentation

The AI service is powered by FastAPI.

Once the AI service is running, interactive API documentation is available at:

```text
http://localhost:5001/docs
```

The documentation can be used to:

* View available endpoints
* Understand request parameters
* Test API requests
* Inspect API responses
* Explore the AI service

---

# Service Communication

The services communicate with each other through HTTP APIs.

```text
Client
  │
  │ HTTP / REST API
  ▼
Server
  │
  │ AI Request
  ▼
AI Service
  │
  │ Prediction / Analysis
  ▼
Server
  │
  ▼
Client
```

This architecture keeps the frontend, backend, and AI logic independent from each other.

---

# Security

ResQVision uses environment variables to keep sensitive configuration separate from source code.

The following files should never be committed to GitHub:

```text
.env
.env.*
```

Never expose:

* API keys
* Database credentials
* Authentication secrets
* Private tokens
* Production credentials

For production deployment, HTTPS, authentication, authorization, request validation, and rate limiting should be implemented where required.

---

# Important Notes

## Files Ignored from GitHub

The following files and folders should be ignored using `.gitignore`:

```text
node_modules/
.env
.env.*
venv/
__pycache__/
dist/
build/
```

These files can be recreated during project setup.

For Node.js:

```bash
npm install
```

For Python:

```bash
pip install -r requirements.txt
```

---

# Empty Folder Handling

GitHub does not track empty directories.

If a directory such as:

```text
ai-service/models/
```

needs to be preserved even when it is empty, add a `.gitkeep` file.

Example:

```text
ai-service/
└── models/
    └── .gitkeep
```

---

# Running All Services

For local development, run each service in a separate terminal.

### Terminal 1 — Client

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Terminal 2 — Server

```bash
cd server
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 3 — AI Service

```bash
cd ai-service
python -m venv venv
```

Activate the virtual environment and install dependencies:

```bash
pip install -r requirements.txt
```

Start the AI service:

```bash
python app.py
```

AI Service:

```text
http://localhost:5001
```

API Documentation:

```text
http://localhost:5001/docs
```

---

# GitHub Setup

## Initialize Git

```bash
git init
```

## Add Files

```bash
git add .
```

## Commit

```bash
git commit -m "Initial commit"
```

## Set Main Branch

```bash
git branch -M main
```

## Add Remote Repository

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_LINK
```

## Push to GitHub

```bash
git push -u origin main
```

---

# Future Improvements

* Real-time disaster location tracking
* Interactive disaster maps
* Mobile application
* Image-based disaster verification
* Video-based disaster analysis
* Satellite image analysis
* Weather API integration
* Real-time emergency alerts
* Rescue team dispatch management
* Advanced disaster analytics dashboard
* Multi-source disaster verification
* Improved AI/ML models
* Cloud deployment
* Automatic AI model retraining
* Real-time notification system

---

# Author

## Sumit Shahi

**Full Stack MERN Developer | AI & Web Developer**

GitHub: [@sumitShahi255](https://github.com/sumitShahi255)

---

# License

This project is for educational and portfolio purposes.
