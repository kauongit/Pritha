# Pritha 🌿

Pritha is a wellness and nutrition platform built for **Yogini Kudtarkar**, designed to provide a calm, nature-inspired digital sanctuary focused on nutrition, emotional wellness, and sustainable lifestyle habits.

The platform combines personalized diet planning, consultation booking, journaling, and an AI wellness companion into a single experience.

---

## ✨ Features

### 👤 Authentication

* Email & Password Signup/Login
* JWT-based authentication
* Mock Google Sign-In support
* Persistent login sessions

### 🏠 Home Dashboard

* Personalized greeting
* Daily wellness quotes
* Mood check-ins
* Quick access to key features
* Nutrition tips and guidance

### 🥗 Personalized Diet Plans

* Detailed wellness questionnaire
* Student and regular pricing
* Request-based diet plan generation
* Admin management workflow

### 📅 Consultation Booking

* Schedule 1:1 consultations
* Time slot selection
* Consultation request management

### 📖 Wellness Journal

* Mood tracking
* Reflection notes
* Historical journal entries

### 🤖 AI Wellness Companion

* Gentle conversational wellness support
* Powered by Claude Sonnet through Emergent Integrations
* Nutrition and lifestyle guidance
* Non-diagnostic wellness assistance

### 💳 Payments

* Mock Razorpay payment flow
* Student pricing support
* Consultation and diet plan payments

### 👩‍⚕️ Admin Dashboard

* User management
* Diet request management
* Consultation tracking
* Revenue statistics
* Payment monitoring

---

## 🛠 Tech Stack

### Frontend

* React Native
* Expo
* Expo Router
* TypeScript

### Backend

* FastAPI
* Python
* JWT Authentication
* Motor (MongoDB Async Driver)

### Database

* MongoDB Atlas

### AI

* Emergent Integrations
* Claude Sonnet

### Payments

* Razorpay (Mock Integration)

---

## 📂 Project Structure

```text
Pritha/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── assets/
│   ├── src/
│   ├── package.json
│   └── app.json
│
└── README.md
```

---

## 🚀 Running the Project

### Backend

Create a virtual environment:

```bash
python -m venv .venv
```

Activate:

```bash
.\.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
MONGO_URL=
DB_NAME=
JWT_SECRET=
JWT_ALGO=HS256
ADMIN_EMAIL=
ADMIN_PASSWORD=
EMERGENT_LLM_KEY=
RAZORPAY_MOCK_MODE=true
```

Run:

```bash
uvicorn server:app --reload
```

Backend API:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

Install dependencies:

```bash
npm install
```

Create:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000
```

Start Expo:

```bash
npx expo start
```

---

## 🔐 Environment Variables

### Backend

```env
MONGO_URL=
DB_NAME=
JWT_SECRET=
JWT_ALGO=
ADMIN_EMAIL=
ADMIN_PASSWORD=
EMERGENT_LLM_KEY=
RAZORPAY_MOCK_MODE=
```

### Frontend

```env
EXPO_PUBLIC_BACKEND_URL=
```

---

## 🎯 Future Improvements

* Real Google OAuth
* Real Razorpay Integration
* Video Consultation Support
* Calendar Availability Management
* PDF Diet Plan Delivery
* Email Notifications
* Password Reset Flow
* Analytics Dashboard
* Production Deployment

---

## 🌱 Vision

Pritha aims to make wellness feel personal, sustainable, and compassionate by blending nutrition guidance, mindful reflection, and supportive technology into a single experience.

**Pritha means “Daughter of Earth” — a reminder to nourish ourselves with the same care that nature offers.**

---

### Developed By

Built with ❤️ by Kaustubh for his loving sister - *Yogini*.
# Pritha
Gift for Yogini didi
