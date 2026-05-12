# FoodHub

A food delivery web app for Almaty restaurants. Browse 100+ local restaurants, filter by cuisine, explore menus, add items to your cart, and get recommendations from an AI food assistant chatbot.

**Stack:** Spring Boot 3 · PostgreSQL · Angular 17 · Tailwind CSS · Docker

---

## Team

| Role | Name |
|---|---|
| 🎨 Frontend Developer | Dimash Turysbay |
| ⚙️ Backend Developer | Olzhas |
| 🧠 AI Engineer | Akynbek |
| 🧪 QA Engineer & Workflow Master | Yedige Ashmet |

---

## Demo

https://github.com/user-attachments/assets/restaurant-project.mp4

> Full walkthrough: restaurant list, cuisine filters, menu, cart, and AI chatbot.

[![FoodHub Demo](restaurant-project.mp4)](restaurant-project.mp4)

---

## Running the project

### Option A — Docker (recommended)

Runs everything (database + backend + frontend) with a single command.

```bash
docker compose up --build
```

The app will be available at **http://localhost**.

To stop:
```bash
docker compose down
```

---

### Option B — Local development

#### Prerequisites

- Java 17+
- Maven
- Node.js 18+
- PostgreSQL 14+ running locally

#### 1. Database

Create a database named `restaurants`:

```bash
psql -U postgres -c "CREATE DATABASE restaurants;"
```

#### 2. Backend

```bash
cd project-restaurant
./mvnw spring-boot:run
```

The API starts at **http://localhost:8080**. Flyway runs the migrations automatically on first start and seeds all restaurant and menu data.

Environment variables (optional overrides):

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/restaurants` | JDBC connection URL |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |

#### 3. Frontend

```bash
cd restaurants-front
npm install
npm start
```

The app starts at **http://localhost:4200**.

---

## Project structure

```
group-proj/
├── project-restaurant/   # Spring Boot backend
│   └── src/main/
│       ├── java/         # Controllers, services, repositories, models
│       └── resources/
│           └── db/migration/   # Flyway SQL migrations + seed data
├── restaurants-front/    # Angular 17 frontend
│   └── src/app/
│       ├── pages/        # Home, restaurant detail
│       ├── components/   # Navbar, cart sidebar, chatbot, restaurant card
│       ├── services/     # Restaurant, cart, chat services
│       └── models/       # TypeScript interfaces
├── images/               # Restaurant cover/logo and menu images
├── docker-compose.yml
└── README.md
```

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/restaurants` | List all restaurants |
| `GET` | `/api/restaurants?cuisine=пицца` | Filter by cuisine tag |
| `GET` | `/api/restaurants/{id}` | Get restaurant by ID |
| `GET` | `/api/restaurants/{id}/menu` | Get menu items for a restaurant |
| `GET` | `/api/restaurants/categories` | List all cuisine categories |
