# Backend Banking Transaction Processing System

A secure backend banking transaction processing system built using Node.js, Express.js, MongoDB, JWT Authentication, and bcrypt. The application supports account management, double-entry ledger accounting, idempotent transaction processing, role-based authorization, account freeze/unfreeze controls, email notifications, and ledger-driven balance calculation.

## Features
## 🚀 Features
- Secure User Registration & Authentication
- JWT-Based Authorization
- Password Hashing using bcrypt
- Role-Based Access Control (RBAC)
- Account Creation & Management
- Account Freeze / Unfreeze Functionality
- Double-Entry Ledger Accounting System
- Idempotent Transaction Processing
- MongoDB Multi-Document Transactions
- Ledger-Based Balance Calculation
- Email Notifications with Nodemailer
- RESTful API Architecture
- Environment-Based Configuration
---

## 🏗️ Architecture Highlights

### Double-Entry Ledger System
Every financial transaction creates both:
- Debit Entry
- Credit Entry

This ensures data consistency, auditability, and accurate financial record keeping.

### Idempotent Transactions
Supports idempotency keys to prevent duplicate transaction execution during retries or network failures.

### Ledger-Driven Balances
Account balances are derived from ledger entries rather than being manually updated, ensuring financial accuracy.

### Role-Based Authorization
Different roles are granted different levels of access to banking operations and administrative functions.

### Account Control
Administrators can freeze or unfreeze accounts to restrict transaction activity when required.

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Security
- JWT Authentication
- bcrypt Password Hashing

### Communication
- Nodemailer

### Utilities
- dotenv

---

## 📁 Project Structure

```text
src/
├── conf/
│   └── db.js
├── controller/
│   ├── auth.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── user.model.js
│   ├── account.model.js
│   ├── ledger.model.js
│   └── transaction.model.js
├── router/
│   ├── auth.router.js
│   ├── account.router.js
│   └── transaction.router.js
├── service/
│   └── gmail.service.js
└── app.js
```


## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASSWORD=your_email_password
```

---

## ▶️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## 📌 Core Modules

- Authentication Service
- User Management
- Account Management
- Transaction Processing
- Double-Entry Ledger Management
- Authorization Middleware
- Email Notification Service

---

This project demonstrates:

- Backend System Design
- Financial Transaction Processing
- Secure Authentication & Authorization
- MongoDB Transactions
- REST API Development
- Ledger-Based Accounting Principles
- Production-Ready Node.js Development

---

Backend Developer | Node.js | Express.js | MongoDB

GitHub: https://github.com/Yasar9108
