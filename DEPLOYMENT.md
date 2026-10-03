# SCRIVA — Production Deployment Guide

This document details the production deployment architecture, configuration, environment variables, and setup instructions for **SCRIVA — “Create. Curate. Publish.”**

---

## 1. System Architecture

The SCRIVA platform consists of two decoupled React frontends communicating with a centralized Django REST Framework (DRF) backend backed by a PostgreSQL database:

```text
┌─────────────────────────┐          ┌─────────────────────────┐
│    Public Portfolio     │          │       Custom CMS        │
│  (React + Tailwind CSS) │          │  (React + Tailwind CSS) │
└────────────┬────────────┘          └────────────┬────────────┘
             │                                    │
             │ Unauthenticated Content            │ JWT Authenticated Content
             │ & Public Contact Form              │ & CRUD Operations
             ▼                                    ▼
┌──────────────────────────────────────────────────────────────┐
│                  Django REST Framework API                   │
│              (Authentication, Permissions, Media)            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│             (Content, Users, Contact Messages)               │
└──────────────────────────────────────────────────────────────┘
```

- **Public Portfolio**: Consumes public read endpoints (auto-filtered to `state = PUBLISHED`) and submits contact messages.
- **Custom CMS**: Manages all content via JWT Bearer authentication, with draft/publish workflows and media upload handling.
- **Django REST Backend**: Central API providing JWT authentication, draft/publish permission isolation, media upload and file serving, and email notification dispatch.
- **PostgreSQL**: Central relational database holding all application records.

---

## 2. Environment Variables Specification

### 2.1 Backend (`backend/.env`)

Configure the following environment variables on the production backend server:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | Strong, unique cryptographic secret key for Django | `<generated-secret-key>` |
| `DEBUG` | Disables debug mode in production | `False` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed domains/hosts | `api.yourdomain.com,localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS`| Comma-separated list of allowed frontend origins | `https://yourdomain.com,https://cms.yourdomain.com` |
| `CSRF_TRUSTED_ORIGINS`| Comma-separated list of trusted origins for CSRF | `https://yourdomain.com,https://cms.yourdomain.com` |
| `EMAIL_BACKEND` | Email backend class for contact notifications | `django.core.mail.backends.smtp.EmailBackend` |
| `EMAIL_HOST` | SMTP server hostname | `smtp.mailgun.org` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USE_TLS` | Enable TLS encryption | `True` |
| `EMAIL_HOST_USER` | SMTP username | `postmaster@yourdomain.com` |
| `EMAIL_HOST_PASSWORD`| SMTP password | `<smtp-secret-password>` |
| `DEFAULT_FROM_EMAIL`| Sender email address | `noreply@yourdomain.com` |
| `CONTACT_EMAIL` | Admin recipient address for contact messages | `admin@yourdomain.com` |

> **Security Note**: Never commit `.env` files to source control. A template is provided in `backend/.env.example`.

### 2.2 Public Portfolio (`portfolio/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL pointing to the deployed Django DRF API | `https://api.yourdomain.com/api/` |

### 2.3 Custom CMS (`cms/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL pointing to the deployed Django DRF API | `https://api.yourdomain.com/api/` |

---

## 3. Backend Deployment Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL database (e.g., Neon, AWS RDS, Supabase, or self-hosted)
- Web Server / Reverse Proxy (Nginx, Caddy) and WSGI/ASGI application server (Gunicorn, Uvicorn)

### Steps

1. **Clone and Setup Virtual Environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your production credentials
   ```

3. **Apply Database Migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Collect Static Files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

5. **Create Superuser (if not existing):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run WSGI Production Server:**
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```

---

## 4. Frontend Deployment Instructions

### 4.1 Public Portfolio

1. **Navigate to portfolio directory and install dependencies:**
   ```bash
   cd portfolio
   npm install
   ```

2. **Configure Environment Variable:**
   ```bash
   echo "VITE_API_URL=https://api.yourdomain.com/api/" > .env.production
   ```

3. **Build Production Bundle:**
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in `portfolio/dist/`.

4. **Static Hosting & SPA Routing:**
   - Host `portfolio/dist/` on any static provider (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, or Nginx).
   - Ensure all non-file routes are rewritten to `index.html` (a `_redirects` file is included in `public/`).

### 4.2 Custom CMS

1. **Navigate to cms directory and install dependencies:**
   ```bash
   cd cms
   npm install
   ```

2. **Configure Environment Variable:**
   ```bash
   echo "VITE_API_URL=https://api.yourdomain.com/api/" > .env.production
   ```

3. **Build Production Bundle:**
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in `cms/dist/`.

4. **Static Hosting & SPA Routing:**
   - Host `cms/dist/` on your chosen static provider or dedicated subdomain (e.g., `cms.yourdomain.com`).
   - SPA rewrite rule (`/* /index.html 200`) ensures direct URL navigation without 404s.

---

## 5. Security & Verification Checklist

- [x] `DEBUG` set to `False` in production environment.
- [x] `SECRET_KEY` / `DJANGO_SECRET_KEY` supplied securely via environment variable.
- [x] `.env` files strictly ignored in `.gitignore`.
- [x] `ALLOWED_HOSTS` restricted to designated production domains and hostnames.
- [x] CORS restricted to authenticated CMS origin and Public Portfolio origin (`CORS_ALLOW_ALL_ORIGINS = False`).
- [x] Database credentials isolated strictly server-side.
- [x] SMTP credentials isolated strictly server-side.
- [x] Public endpoints restricted to `state = PUBLISHED`.
- [x] Draft content accessible only to authenticated staff users.
- [x] Unauthenticated mutations (POST/PUT/DELETE) rejected with 401/403.
- [x] Media upload endpoint restricted to authenticated admin users with size and MIME type validation.
- [x] Static files collected via `collectstatic` to `staticfiles/`.
