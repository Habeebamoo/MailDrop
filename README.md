# MailDrop 

MailDrop is a simple and powerful email campaign management system designed to help users manage subscribers, send campaigns mails, and track management with ease. MailDrop provides a secure solution for modern email marketing.

## Usage

1. Register or log in with email/password or Google account.
2. Create, manage and share campaigns.
3. Get subscribers and send promotional emails.
4. Track leads and view unsubscriptions.

---

## Features

**User Authentication**
- JWT-based authentication with secure cookies
- Google OAuth integration
- Email + Password signup with OTP verification

**Profile Management**
- Update user profile details (name, bio, etc.)
- Profile picture upload via **Cloudinary integration**

**Campaign Management**
- Create, update, and delete campaigns.
- Manage subscribers for each campaign
- Unsubscribe functionality with feedback (reason/comments)

**Email System**
- Dynamic email composer with **rich text editor** (Tiptap)
- Lead magnet reward email on subscription
- Reset password and OTP verification emails with custom branding
- Subscription and unsubscription notification emails

**Security**
- JWT expiration validation
- XSS prevention
- API rate limiting
- SQL injections prevention
- Proper request validation in both client & server

---

## Tech Stack

### Backend
- Go (Gin Framework, GORM ORM)
- PostgreSQL
- Cloudinary SDK

### Frontend
- React.js + TypeScript
- Tailwind CSS
- Titap editor

## Installation

### Backend (Go)

```bash
# Clone the repo
git clone
https://github.com/Habeebamoo/MailDrop.git
cd MailDrop/server

# Install dependencies
go mod tidy

# Run the server
go run main.go
```


### Frontend (React)

```bash
# Clone the repo
git clone
https://github.com/Habeebamoo/MailDrop.git
cd MailDrop/client

# Install dependencies
npm i

# Run the development server
npm run dev