# SCRIVA Backend

SCRIVA is a custom-built portfolio CMS designed to manage and serve a public portfolio website. 
This is the Python/Django backend repository, serving as the foundation for the CMS authentication, content models, REST APIs, and database interactions.

## Technology Stack

- **Backend**: Python, Django
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL

## Local Development Setup

### 1. Prerequisites

- Python 3.10+
- PostgreSQL (or access to a Neon PostgreSQL instance)

### 2. Create the Virtual Environment

Navigate to the `backend` directory and create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:
- **Windows**: `.\venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`

### 3. Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Configuration (.env)

Create a `.env` file in the root of the `backend` directory based on the `.env.example` file.
Configure the variables as follows:

```text
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### 5. Run Migrations

Apply the database migrations to set up the PostgreSQL tables:

```bash
python manage.py migrate
```

### 6. Start the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

## Health Endpoint

You can verify the backend is operational by accessing the health endpoint:

```
GET http://127.0.0.1:8000/api/health/
```

This will return a simple JSON response indicating the API is running correctly.
