<div align="center">

# SCRIVA

### Create. Curate. Publish.

**A decoupled portfolio publishing engine and content management system.**  
SCRIVA bridges a dedicated administration CMS with a dynamic public portfolio, replacing hardcoded personal sites with an API-driven, database-backed content platform.

<br />

[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.18-A30000?style=flat-square&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT Auth](https://img.shields.io/badge/Auth-SimpleJWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

[Architecture](#platform-architecture) • [Custom CMS](#custom-cms) • [Public Portfolio](#public-portfolio) • [Publishing Workflow](#content-publishing-workflow) • [API Reference](#api-overview) • [Local Setup](#local-development)

</div>

---

## Product Preview

SCRIVA consists of two decoupled React client applications connected through a centralized Django REST API and PostgreSQL database:

```text
┌────────────────────────────────────────────────────────┐
│                   PUBLIC PORTFOLIO                     │
│   Dynamic Hero • Skills • Selected Works • Blog        │
│   Experience Timeline • Testimonials • Contact Form    │
└───────────────────────────▲────────────────────────────┘
                            │
               Read-Only REST API (state = PUBLISHED)
                            │
┌───────────────────────────┴────────────────────────────┐
│                  SCRIVA REST PLATFORM                  │
│    Django 5.2 • Django REST Framework • SimpleJWT      │
│          PostgreSQL Relational Persistence             │
└───────────────────────────▲────────────────────────────┘
                            │
            JWT Authenticated Administration & CRUD
                            │
┌───────────────────────────┴────────────────────────────┐
│                      CUSTOM CMS                        │
│   Role-based Login • Analytics Dashboard • Profile     │
│   Projects • Blog • Skills • Testimonials • Media      │
└────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION PREVIEWS                               │
├────────────────────────────────────┬────────────────────────────────────┤
│          PUBLIC PORTFOLIO          │             CUSTOM CMS             │
│      (Dynamic Client Surface)      │     (Management Control Center)    │
│                                    │                                    │
│    [ Hero & Profile Summary ]      │     [ Live Metric Counters ]       │
│    [ Dynamic Projects Grid  ]      │     [ Draft / Publish Toggle ]     │
│    [ Interactive Skills Bar ]      │     [ Multi-Field CRUD Form  ]     │
│    [ Interactive Contact Form ]    │     [ Media Asset Uploader ]       │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

## What is SCRIVA?

Most developer portfolios suffer from a maintenance dilemma: updating a bio, showcasing a new project, adding an article, or updating work history requires editing frontend source code, triggering a redeployment, and rebuilding client bundles.

**SCRIVA resolves this with architectural separation:**

```text
Content Administration (Custom CMS)
                ↓
  REST API & State Validation (DRF)
                ↓
 Relational Persistence (PostgreSQL)
                ↓
 Dynamic Public Presentation (Portfolio)
```

1. **Decoupled Architecture:** Content changes made in the CMS reflect immediately on the public portfolio through API calls without modifying frontend source code.
2. **Access Isolation:** Administrative mutations, draft inspection, and media uploads require verified JWT credentials.
3. **Visibility Isolation:** Unauthenticated visitors to the public portfolio can only retrieve items marked with `state = PUBLISHED`. Draft entries remain hidden at the ORM layer.

---

## Core Experience

| Capability | Implementation Detail | Target Surface |
| :--- | :--- | :--- |
| **Custom CMS** | Dedicated control center with responsive dashboard counters, item editing modals, and confirmation dialogues. | Admin |
| **Dynamic Portfolio** | Sleek glassmorphic dark interface rendering verified profile data, projects, experience, writing, and client reviews. | Public |
| **Publishing Pipeline** | Two-state content model (`DRAFT` / `PUBLISHED`) isolating works in progress from public consumption. | CMS / Portfolio |
| **JWT Authentication** | Stateless token authentication with short-lived access tokens (60 min) and long-lived refresh tokens (24 hours). | CMS |
| **Media Management** | Multi-type binary asset uploads (JPEG, PNG, WebP, GIF, PDF) with 5 MB file size limit and disk persistence. | CMS / Backend |
| **Contact Persistence** | Validated messaging channel storing visitor inquiries in PostgreSQL and triggering notification emails. | Portfolio / Backend |
| **Content Coverage** | Granular data models for Profile/About, Skills, Projects, Blog posts, Experience, Testimonials, Education, Services, and Social Links. | CMS / Portfolio |

---

## Platform Architecture

```mermaid
flowchart TD
    subgraph Clients["Frontend Clients (React 19 + Tailwind CSS)"]
        Portfolio["Public Portfolio<br/>(Port 5173)"]
        CMS["Custom CMS<br/>(Port 5174)"]
    end

    subgraph Backend["Backend API (Django 5.2 + DRF)"]
        direction TB
        Router["DRF URL Router<br/>/api/*"]
        AuthLayer["JWT Authentication<br/>SimpleJWT Middleware"]
        PermLayer["Permission Isolation<br/>IsAdminOrReadOnly & BasePublishViewSet"]
        MediaHandler["Media Processing<br/>MultiPartParser + File Storage"]
        MailHandler["Email Dispatcher<br/>django.core.mail"]
    end

    subgraph Database["Database & Storage"]
        Postgres[(PostgreSQL<br/>Neon Cloud Instance)]
        FileSystem[("Media & Static Files<br/>/media/ & /staticfiles/")]
    end

    %% Interactions
    Portfolio -->|"Unauthenticated GET<br/>(state = PUBLISHED)"| Router
    Portfolio -->|"Public POST /api/contact/"| Router
    CMS -->|"JWT Bearer Auth<br/>(All CRUD Operations)"| Router

    Router --> AuthLayer
    AuthLayer --> PermLayer
    PermLayer --> Postgres
    Router --> MediaHandler
    MediaHandler --> FileSystem
    Router --> MailHandler
```

### Data Flow Breakdown

1. **Content Query Flow:** The public portfolio initiates parallel HTTP GET requests using Axios to `/api/profile/`, `/api/skills/`, `/api/projects/`, and `/api/blogs/`. The backend's `BasePublishViewSet` automatically filters querysets to `state = PublishState.PUBLISHED` for all unauthenticated calls.
2. **Management Mutation Flow:** The CMS user submits credentials to `POST /api/auth/login/`, receiving access and refresh tokens. Subsequent CMS requests include `Authorization: Bearer <token>`, granting full CRUD access across all models and revealing draft content.
3. **Contact Submission Flow:** Public inquiries sent via `POST /api/contact/` are validated against `ContactMessageSerializer`. Valid messages are committed to PostgreSQL, followed by an asynchronous or non-blocking email notification attempt to `CONTACT_EMAIL`.

---

## Technology Stack

| Layer | Technology | Version | Purpose in SCRIVA |
| :--- | :--- | :--- | :--- |
| **Public Frontend** | React | 19.3.0 | Dynamic client interface for portfolio presentation |
| **CMS Frontend** | React | 19.3.0 | Interactive management interface for portfolio content |
| **Client Routing** | React Router DOM | 6.30 / 7.18 | Single Page Application (SPA) client-side routing |
| **Styling** | Tailwind CSS | 4.3.3 | Modern styling and glassmorphism design system |
| **Icons** | Lucide React | Latest | Consistent icon set across both frontend surfaces |
| **HTTP Client** | Axios | 1.20.0 | Intercepted API communication and token renewal |
| **Bundler & Tooling** | Vite | 8.3.1 | Build tooling and client asset packaging |
| **Backend Framework** | Django | 5.2.17 | Web framework, ORM models, and business logic |
| **REST API** | Django REST Framework | 3.18.1 | Serialization, viewsets, and API routing |
| **Authentication** | djangorestframework-simplejwt | 5.5.1 | Stateless JSON Web Token authentication |
| **Database** | PostgreSQL | Neon Cloud | Relational database storage |
| **CORS Middleware** | django-cors-headers | 4.9.0 | Origin-restricted Cross-Origin Resource Sharing |
| **Image Handling** | Pillow | 12.3.0 | Image processing and media field validation |

---

## Custom CMS

The SCRIVA CMS is a responsive administrative portal providing centralized management over every aspect of the portfolio.

```text
CMS Navigation Structure
├── Dashboard               (Aggregated object counters & overview)
├── About / Profile         (Biographical info, avatar, resume, contact email)
├── Technical Skills        (Name, category, proficiency percentage, order)
├── Selected Projects       (Title, description, URLs, featured flag, draft/published)
├── Blog Articles           (Headline, editorial markdown content, cover image)
├── Testimonials            (Client name, position, company, recommendation text)
├── Work Experience         (Company, role, timeframe, responsibilities)
├── Education               (Institution, degree, graduation year, details)
├── Services                (Service title, offering description, icon)
└── Social Links            (Platform identifier, profile destination URL)
```

### Key CMS Capabilities

* **Stateless Token Management:** `AuthContext` transparently injects Bearer tokens into request headers and intercepts `401 Unauthorized` responses to refresh tokens via `POST /api/auth/refresh/`.
* **State Control:** Projects, blog articles, and testimonials can be toggled between `DRAFT` and `PUBLISHED` states directly from modal editors or table listings.
* **Form Data & Binary Uploads:** Modals support direct file inputs, sending `multipart/form-data` for cover images, profile avatars, and PDF resumes.
* **Validation & User Feedback:** Immediate visual feedback via floating status banners for success, server validation errors, and network anomalies.

---

## Content Publishing Workflow

SCRIVA provides an editorial lifecycle preventing incomplete work from leaking into public view:

```text
 ┌─────────────────┐
 │ Create Content  │  CMS Administrator submits new project or blog post
 └────────┬────────┘
          ▼
 ┌─────────────────┐
 │ Save as DRAFT   │  Stored in PostgreSQL with state = "DRAFT"
 └────────┬────────┘
          ▼
 ┌─────────────────┐
 │ Review & Polish │  Visible inside CMS with distinctive "Draft" badge
 └────────┬────────┘  Hidden from Public Portfolio (auto-filtered at ORM)
          ▼
 ┌─────────────────┐
 │ Toggle PUBLISH  │  CMS Administrator updates state to "PUBLISHED"
 └────────┬────────┘
          ▼
 ┌─────────────────┐
 │ Live Portfolio  │  Item immediately renders on public portfolio routes
 └─────────────────┘
```

The isolation is enforced on the backend in `BasePublishViewSet`:

```python
def get_queryset(self):
    queryset = super().get_queryset()
    if not (self.request.user and self.request.user.is_staff):
        return queryset.filter(state=PublishState.PUBLISHED)
    return queryset
```

---

## Public Portfolio

The public portfolio delivers a presentation layer designed to showcase an engineer's background, projects, and insights:

* **Home & Hero:** Dynamic greeting featuring the author's title, custom bio, resume download, and profile avatar with ambient glow effects.
* **Technical Skills Grid:** Interactive grid categorizing competencies and revealing proficiency percentages on hover.
* **Selected Works (`/projects`):** Project showcase featuring cover image previews, featured project highlights, project overviews, GitHub source links, and live demo buttons.
* **Writing & Insights (`/blog`):** Clean editorial layout displaying published articles, publication dates, and article content.
* **Professional Experience (`/experience`):** Chronological career timeline indicating roles, companies, tenures, and key accomplishments.
* **Client Testimonials (`/testimonials`):** Social proof section featuring client endorsements, company affiliations, and role titles.
* **Get in Touch (`/contact`):** Interactive contact form with client-side regex email validation, submission states, and immediate confirmation messaging.

---

## Media Management

SCRIVA contains a built-in media pipeline for handling portfolio assets:

```text
CMS Upload Input ──> POST /api/upload/image/ ──> Validation ──> /media/uploads/ ──> MediaAsset Record
```

* **Supported Formats:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`.
* **Payload Size Validation:** Server-side enforcement rejecting payloads larger than 5 MB (`HTTP 400 Bad Request`).
* **Media Serving:** When `DEBUG=False`, static and media URLs are routed via `re_path` to preserve valid media links in production.
* **Asset Model:** Tracked in the `MediaAsset` table with attributes for file reference, original filename, MIME type, and upload timestamp.

---

## Contact Flow

The portfolio contact system allows visitors to submit inquiries directly to the database:

```text
 Visitor fills out form (Name, Email, Message)
                     │
                     ▼
  Client-side validation (Required fields, RFC email regex)
                     │
                     ▼
             POST /api/contact/
                     │
                     ▼
  Server-side validation (ContactMessageSerializer)
                     │
                     ▼
   Record committed to PostgreSQL (ContactMessage table)
                     │
                     ▼
 Notification dispatch attempted (fail_silently = True)
                     │
                     ▼
      HTTP 201 Created returned to client
```

Submissions are persisted safely to the database regardless of SMTP availability, preventing lost inquiries due to network mail delivery timeouts.

---

## API Overview

All routes are prefixed with `/api/`.

### Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | Public | Authenticates credentials; returns access & refresh tokens |
| `POST` | `/api/auth/refresh/` | Public | Submits refresh token; returns renewed access token |

### System & Administration

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | Public | Healthcheck returning service availability status |
| `GET` | `/api/dashboard/stats/` | Admin | Aggregated model counts (projects, blogs, skills, etc.) |
| `POST` | `/api/upload/image/` | Admin | Multipart binary file upload endpoint |
| `POST` | `/api/contact/` | Public | Submits visitor message to database and notifies admin |

### Content Management & Presentation

| Method | Endpoint | Public View | CMS / Admin View |
| :--- | :--- | :--- | :--- |
| `GET`, `POST` | `/api/profiles/` | Published profile data | Full profile management |
| `GET` | `/api/profile/` | Primary profile record | Primary profile record |
| `GET` | `/api/about/` | Primary profile record | Primary profile record |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/skills/` | Read-only skills | Full skill CRUD |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/projects/` | `state = PUBLISHED` | All projects (Draft + Published) |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/blogs/` | `state = PUBLISHED` | All articles (Draft + Published) |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/testimonials/` | `state = PUBLISHED` | All reviews (Draft + Published) |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/experience/` | Read-only timeline | Full experience CRUD |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/education/` | Read-only education | Full education CRUD |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/services/` | Read-only offerings | Full services CRUD |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/social-links/` | Read-only links | Full social link CRUD |

---

## Security

* **Access Control:** All CMS operations (`POST`, `PUT`, `PATCH`, `DELETE`) require an authenticated Django user with `is_staff = True`. Unauthenticated mutation requests return `401 Unauthorized`.
* **State Isolation:** Draft items are strictly filtered at the database query level for unauthenticated users, preventing information leakage before publication.
* **Environment Isolation:** All sensitive credentials (`DJANGO_SECRET_KEY`, database credentials, SMTP passwords) are loaded via environment variables and excluded from version control.
* **CORS Protection:** `CORS_ALLOW_ALL_ORIGINS` is disabled. Only explicitly declared frontend origins (e.g., Portfolio and CMS hosts) are permitted for credentialed requests.
* **Payload Sanitization:** Media uploads undergo strict server-side MIME type filtering and file size limits (5 MB maximum).
* **Production Hardening:** Production settings support `DEBUG = False`, with `SECURE_BROWSER_XSS_FILTER`, `X_FRAME_OPTIONS = 'DENY'`, and `SECURE_CONTENT_TYPE_NOSNIFF`.

---

## Project Structure

```text
Scriva/
├── .gitignore                   # Root repository ignore rules
├── DEPLOYMENT.md                # Production deployment documentation
├── README.md                    # Product & architecture documentation
│
├── backend/                     # Django REST Framework Backend
│   ├── api/                     # Main application package
│   │   ├── admin.py             # Django admin model registrations
│   │   ├── apps.py              # Application configuration
│   │   ├── models.py            # PostgreSQL ORM schema definitions
│   │   ├── permissions.py       # Custom DRF permission classes
│   │   ├── serializers.py       # Model serializers & field formatters
│   │   ├── urls.py              # API endpoint route definitions
│   │   └── views.py             # ViewSets & custom API endpoints
│   ├── config/                  # Django project configuration
│   │   ├── settings.py          # Environment-driven application settings
│   │   ├── urls.py              # Root URL dispatcher
│   │   ├── wsgi.py              # WSGI production server entrypoint
│   │   └── asgi.py              # ASGI production server entrypoint
│   ├── media/                   # Uploaded media assets storage
│   ├── staticfiles/             # Collected static files for deployment
│   ├── manage.py                # Django CLI utility
│   ├── requirements.txt         # Python dependency definitions
│   ├── .env.example             # Safe environment variable template
│   └── test_production_api.py   # Comprehensive integration smoke test suite
│
├── cms/                         # React Administration Portal
│   ├── public/                  # Static assets & SPA routing rules
│   │   └── _redirects           # Static SPA rewrite configuration
│   ├── src/
│   │   ├── api/                 # Axios configuration & token refresh
│   │   ├── assets/              # UI images and SVG icons
│   │   ├── components/          # Reusable layout and modal components
│   │   ├── context/             # AuthContext for session management
│   │   ├── pages/               # CMS management views (Projects, Blogs, etc.)
│   │   ├── App.jsx              # Main routing & route guards
│   │   └── main.jsx             # React application entrypoint
│   ├── package.json             # CMS dependencies and scripts
│   ├── vite.config.js           # Vite build configuration
│   └── .env.example             # Frontend environment template
│
└── portfolio/                   # React Public Portfolio
    ├── public/                  # Public assets & SPA routing rules
    │   └── _redirects           # Static SPA rewrite configuration
    ├── src/
    │   ├── api/                 # Axios HTTP client configuration
    │   ├── assets/              # SVG vectors and brand icons
    │   ├── components/          # Navigation, Header, Footer, and UI states
    │   ├── pages/               # Public views (Home, Projects, Blog, Contact)
    │   ├── App.jsx              # Main routing configuration
    │   └── main.jsx             # React entrypoint
    ├── package.json             # Portfolio dependencies and scripts
    ├── vite.config.js           # Vite build configuration
    └── .env.example             # Frontend environment template
```

---

## Local Development

### Prerequisites

* Python 3.10+
* Node.js 18+ & npm
* PostgreSQL instance (local or hosted, e.g. Neon)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Run automated API validation suite
python test_production_api.py

# Start the Django development server
python manage.py runserver 127.0.0.1:8000
```

Backend will be operational at `http://127.0.0.1:8000/api/health/`.

---

### 2. Custom CMS Setup

```bash
# In a new terminal, navigate to the cms directory
cd cms

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000/api/

# Start Vite development server
npm run dev
# Or preview production build:
npm run build && npm run preview -- --port 5174
```

CMS portal will be operational at `http://127.0.0.1:5174/`.

---

### 3. Public Portfolio Setup

```bash
# In a new terminal, navigate to the portfolio directory
cd portfolio

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000/api/

# Start Vite development server
npm run dev
# Or preview production build:
npm run build && npm run preview -- --port 5173
```

Public portfolio will be operational at `http://127.0.0.1:5173/`.

---

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Safe Example |
| :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | Cryptographic key for session & token security | `django-insecure-your-secret-key-here` |
| `DEBUG` | Enable debug mode during local development (`True`/`False`) | `False` |
| `DATABASE_URL` | PostgreSQL connection URL string | `postgresql://user:pass@host:5432/dbname` |
| `ALLOWED_HOSTS` | Comma-separated list of valid host headers | `localhost,127.0.0.1,api.example.com` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173,http://localhost:5174` |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated list of trusted CSRF origins | `http://localhost:5173,http://localhost:5174` |
| `EMAIL_BACKEND` | Django email delivery backend | `django.core.mail.backends.console.EmailBackend` |
| `EMAIL_HOST` | SMTP server address | `smtp.example.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USE_TLS` | Enable TLS encryption | `True` |
| `DEFAULT_FROM_EMAIL` | Sender address for system messages | `webmaster@example.com` |
| `CONTACT_EMAIL` | Admin recipient address for contact inquiries | `admin@example.com` |

### Frontend Configuration (`portfolio/.env` & `cms/.env`)

| Variable | Target Application | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Portfolio & CMS | Base URL pointing to the Django REST Framework API (e.g. `http://localhost:8000/api/`) |

---

## Deployment

SCRIVA is architected for production deployment across modern hosting providers:

* **Backend API:** Designed for containerized or WSGI environments (Gunicorn / Uvicorn behind Nginx, Render, Railway, or AWS EC2).
* **Database:** Backed by managed PostgreSQL (Neon, AWS RDS, Supabase).
* **Frontend Applications:** Built as static single-page applications (`portfolio/dist/` and `cms/dist/`) optimized for static platforms (Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront).

### Verified Local Deployment Verification

```text
Backend API       → http://127.0.0.1:8000/api/       (Django DRF + PostgreSQL)
Custom CMS        → http://127.0.0.1:5174/           (Vite Production Preview)
Public Portfolio  → http://127.0.0.1:5173/           (Vite Production Preview)
```

Refer to [`DEPLOYMENT.md`](DEPLOYMENT.md) for the comprehensive production deployment manual.

---

## Project Highlights

- [x] **Decoupled Architecture:** Separation between presentation, administration, and data layers.
- [x] **Relational Persistence:** PostgreSQL database storage with zero hardcoded content.
- [x] **Granular Content Models:** Dedicated models for 10 distinct portfolio content categories.
- [x] **Draft / Published Workflow:** Instant toggling of public visibility directly from the CMS.
- [x] **JWT Security:** Stateless access and refresh token lifecycle with automatic rotation.
- [x] **Media Asset Management:** Multipart uploads with size validation and direct disk serving.
- [x] **Persistent Contact System:** Validated contact storage with email notification dispatch.
- [x] **SPA Routing:** Direct deep-link routing support across all client views without 404 errors.
- [x] **Automated Validation:** Test suite verifying API endpoints, security gates, and database integrity.

---

## Development Journey

SCRIVA was engineered through structured milestones focused on architectural separation and production readiness:

1. **Foundational Architecture:** Django project initialization, PostgreSQL integration, and model schema design.
2. **Security & Content APIs:** DRF viewsets, SimpleJWT authentication, and role-based permissions (`IsAdminOrReadOnly`).
3. **Draft / Published Logic:** Queryset filtering isolating draft assets from unauthenticated clients.
4. **Custom CMS Engineering:** React administration console with authenticated routing, modal editors, and state management.
5. **Dynamic Public Presentation:** React portfolio interface rendering live content directly from DRF endpoints.
6. **Media & Contact Pipelines:** Validated file upload processing and persistent contact message delivery.
7. **Production Hardening:** Origin-restricted CORS, static file collection, SPA rewrite rules, and automated integration tests.

---

## Future Scope

* **Rich Text / Markdown Editor:** Integrated WYSIWYG editor for blog articles and project descriptions.
* **Visitor Analytics:** Privacy-first view counters and engagement metrics displayed on the CMS dashboard.
* **Automated Image Optimization:** Automated WebP conversion and responsive thumbnail generation on upload.
* **Multi-User Role Management:** Granular role permissions distinguishing content authors from site administrators.

---

## Author

**Dhyey Patel**  
Full-Stack Software Engineer

* **GitHub:** [@dhyey2402](https://github.com/dhyey2402)
* **Repository:** [dhyey2402/Scriva](https://github.com/dhyey2402/Scriva)

---

<div align="center">

**SCRIVA transforms a developer's portfolio from a static codebase into an active, manageable publishing engine.**

Built with Django REST Framework, React, PostgreSQL, and Tailwind CSS.

</div>
