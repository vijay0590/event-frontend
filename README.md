# 🎟️ EventX — Event Management Platform (MERN)

A high-performance, full-stack Event Management application built using the MERN stack. EventX enables users to explore upcoming events, book tickets seamlessly, and make secure payments via Razorpay integration.

---

## 🚀 Live Links

*   **Frontend:** https://eventx-app.netlify.app/
*   **Backend API:** https://online-6fl3.onrender.com

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `vijay@gmail.com` | `123456` |
| **Organizer** | `baskar06@gmail.com` | `123456` |
| **Admin** | `vijay@gmail.com` | `123456` |

---

## ✨ Key Features

### 👤 User Features
*   **JWT Authentication:** Secure Register/Login system with protected routes.
*   **Advanced Discovery:** Search and filter events by category, date, and price.
*   **Secure Booking:** Seamless ticket purchasing powered by **Razorpay**.
*   **Personal Dashboard:** View and manage "My Tickets" with real-time status.

### 🎤 Organizer Features
*   **Event Lifecycle Management:** Create, Edit, and Delete events via a dedicated dashboard.
*   **Dynamic Ticketing:** Support for multiple ticket tiers (VIP, General, etc.) with availability tracking.
*   **Attendee Tracking:** Real-time list of guests with **CSV Export** functionality for management.

### 👑 Admin Features
*   **Platform Oversight:** Manage all users and events across the platform.
*   **Global Dashboard:** Monitor transactions and site-wide event statistics.

---

## 💳 Payment Workflow

1.  **Order Initialization:** Backend creates a unique Razorpay Order ID.
2.  **Secure Checkout:** User interacts with the Razorpay Modal in test mode.
3.  **Signature Verification:** HMAC-SHA256 verification ensures payment authenticity.
4.  **Instant Confirmation:** Ticket status updates to "Paid" immediately upon success.

---

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, Axios, React-Router-Dom.
*   **Backend:** Node.js, Express.js, MongoDB (Mongoose).
*   **Security:** JWT (JSON Web Tokens), Bcrypt.js.
*   **Payments:** Razorpay API.

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=[https://online-6fl3.onrender.com](https://online-6fl3.onrender.com)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id