# Collaborative Music Playing System

The product is built with ReactJS and Python.

# Setup

## Prerequisites

### Step 1: Clone the project

```bash
git clone https://github.com/imranmatin23/collaborative-music-playing-system.git
cd collaborative-music-playing-system
```

### Step 2: Create virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Frontend

### Step 1: Run the frontend

```bash
npm start
```

# Adding new API

1. Routes defined in frontend/src/App.js

---

## Backend

### Step 1: Run the backend

```bash
# Create a migration file
python manage.py makemigrations
# Apply changes to the database
python manage.py migrate
# Run the backend server
python manage.py runserver
```

# Adding new API

1. Routes defined in backend/api/urls.py

2. Create View in backend/api/views.py

3. Add Serializer backend/api/serializers.py

4. Add Model in backend/api/models.py

# References

[1] [Django & React - Full Stack Web App Tutorial](https://youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j) by Tech With Tim
