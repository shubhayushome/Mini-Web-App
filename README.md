# 🌐 Mini Web App - AI URL Summarizer

A full-stack AI-powered web application that takes in a website URL, extracts its content, summarizes it using AI (Cohere API), and stores the result in a PostgreSQL database.

🚀 Built with:

- ⚛️ **React** – Frontend UI with TailwindCSS
- ☕ **Spring Boot** – Backend REST API with Java 21
- 🐍 **FastAPI** – Summarization microservice (Python)
- 🐘 **PostgreSQL** – Database
- 🔗 **Scala** – Custom summarization logic compiled to JAR
- 🐳 **Docker Compose** – Unified multi-container deployment

---

## 📸 Screenshots

![Home Screen](https://github.com/shubhayushome/Mini-web-app/blob/main/Project%20ss/Screenshot%202025-04-26%20100815.png) 
![History Screen](https://github.com/shubhayushome/Mini-web-app/blob/main/Project%20ss/Screenshot%202025-04-26%20100825.png)

---


---

## ⚙️ Features

- ✅ Enter URL and get summary in seconds
- ✅ Uses FastAPI or Scala-based summarizer logic
- ✅ Stores history with timestamp
- ✅ Full UI with expandable cards
- ✅ Grouped by date like browser history
- ✅ Fully Dockerized (React, FastAPI, Spring Boot, PostgreSQL)

---

## 🐳 Run with Docker Compose

- mkdir mini-web-app
- cd mini-web-app
- extract everthing there
- docker-compose up --build


