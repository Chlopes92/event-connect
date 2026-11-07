
<div align="center">

# 🎟️ EventConnect

### Discover events. Create experiences. Bring people together.

A platform designed to make event discovery and event management easier for everyone.

<br/>

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

<br/>

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Application Preview](#-application-preview)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Security](#-security)
- [Testing and Deployment](#-testing-and-deployment)
- [Future Improvements](#-future-improvements)
- [Visual Identity](#-visual-identity)

---

## 💡 About the Project

EventConnect is a web application designed to centralize event discovery and management.

Nowadays, event information is scattered across multiple platforms, including social networks, ticketing websites and forums.

This makes it difficult for attendees to discover interesting events and for organizers to manage and promote their activities.

**EventConnect provides a centralized solution** where users can explore events while organizers can create and manage their own events.

### 🎯 Target Users

**👥 Attendees**

People looking for cultural, artistic, family or leisure activities such as concerts, exhibitions, festivals, workshops and more.

**🎪 Event Organizers**

Companies, professionals, associations and individuals who want to create, manage and promote their events.

---

## 🚀 Key Features

### 👥 Attendee Area

- Browse available events.
- Filter events by category.
- View detailed event information.
- Create a participant account.
- Add events to a wishlist.
- Add events to a cart.
- Access the reservation and payment flow.

### 🎪 Organizer Area

- Create an organizer account.
- Access a dedicated dashboard.
- Create new events.
- Manage event information.
- View created events.

### 📝 Event Creation

Organizers can provide information such as:

- Event title and image.
- Description and programme.
- Date and location.
- Price and available capacity.
- Event category.
- Contact information.

---



## 🖥️ Application Preview



### 🏠 Homepage

Discover events and explore different categories.

<img width="220" src="https://github.com/user-attachments/assets/393266f3-5eca-499c-a36d-2bd71bdeaab9" alt="Homepage" />

### 🎟️ Event Details

Access detailed information about an event.

<img width="220" src="https://github.com/user-attachments/assets/e382f303-a837-4c8f-b0b2-ffff9d896162" alt="Event details" />

### 🎪 Organizer Dashboard

View and manage created events.

<img width="220" src="https://github.com/user-attachments/assets/554dfaf7-e451-486f-8873-acfe061ea88f" alt="Organizer dashboard" />

### ✨ Create an Event

A dedicated form allows organizers to publish their events.

<img width="220" src="https://github.com/user-attachments/assets/ce77cb97-c988-4342-ab43-295e614eb6be" alt="Create an event" />

### 🔐 Authentication

Registration interface for participants and organizers.

<img width="220" src="https://github.com/user-attachments/assets/61c0d94c-86d1-47db-8e61-7cf8fae95493" alt="Authentication" />





---

## 🛠️ Technology Stack

<div align="center">

### Frontend

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)

### Database & Security

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![BCrypt](https://img.shields.io/badge/BCrypt-333333?style=for-the-badge)

### DevOps & Deployment

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</div>

---

## 🏗️ Application Architecture

EventConnect follows a three-layer architecture.


```text
              FRONTEND
             Angular
                 |
             HTTP / JSON
              JWT Token
                 |
                 ▼
              BACKEND
            Spring Boot
                 |
       ┌─────────┼─────────┐
       ▼         ▼         ▼
  Controllers  Services  Repositories
                 |
                 ▼
              DATABASE
             PostgreSQL
```

### Frontend – Angular

- Components and pages.
- Forms and user interactions.
- HTTP services to communicate with the API.
- Route Guards to protect application routes.
- HTTP Interceptors to attach JWT tokens.

### Backend – Spring Boot

- REST API controllers.
- Business logic through services.
- Repositories for database access.
- Spring Security for authentication and authorization.

### Database – PostgreSQL

Database entities include:

- Users
- Events
- Categories

Relationships are managed through foreign keys and database integrity constraints.

---

## 🔐 Security

Security is an important part of EventConnect.

Implemented security mechanisms presented in the project include:

- **BCrypt:** secure password hashing with salt.
- **JWT:** authentication and secure communication.
- **Spring Security:** backend security.
- **Route Guards:** frontend route protection.

### Future Security Enhancements

- Limit repeated login attempts.
- Implement CAPTCHA.
- Temporarily lock accounts after repeated failures.
- Strengthen password policies.

---

## 🧪 Testing and Deployment

### Testing

The project includes a testing approach based on:

- Frontend unit tests.
- Backend unit tests.
- API integration tests using Postman.

### DevOps

The deployment workflow uses:

| Tool | Purpose |
|---|---|
| Docker Desktop | Local development environment |
| GitHub Actions | CI/CD automation |
| Render | Production deployment |

### Deployment Architecture

**Local Environment**

- Angular frontend.
- Spring Boot backend.
- PostgreSQL database.
- Docker Desktop.

**Production Environment**

The application is deployed using Render.

GitHub Actions is used to automate build and testing stages.

---

## 🔮 Future Improvements

Several improvements have been identified for future development:

### 📱 Responsive Design
- Improve mobile layouts.
- Optimize pages for smaller screens.

### 🔒 Security
- Limit login attempts.
- Add CAPTCHA protection.
- Strengthen password policies.

### ♿ Accessibility
- Improve keyboard navigation.
- Expand accessibility testing.
- Make the application more inclusive.

---

## 🎨 Visual Identity

EventConnect uses a modern and vibrant visual identity.

| Color | Hex Code |
|---|---|
| Deep Purple | `#190043` |
| Purple | `#3C096C` |
| Pink | `#FE195E` |
| Yellow | `#FDC500` |

**Typography:** Comfortaa & Roboto.

---

<div align="center">

## EventConnect

<br/>

*Developed as part of the CDA 2026 project.*

</div>
