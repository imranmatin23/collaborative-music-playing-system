# Collaborative Music Playing System

The product is built with ReactJS and Python.

# Setup

## Step 1: Clone the project

```bash
git clone https://github.com/imranmatin23/collaborative-music-playing-system.git
cd collaborative-music-playing-system
```

## Step 2: Create virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Step 3: Run the backend

Runs the backend webserver at http://127.0.0.1:8000.

```bash
cd backend
python manage.py migrate
python manage.py makemigrations
python manage.py runserver
```

## Step 4: Run the frontend

Runs the frontend webserver at http://127.0.0.1:3000.

```bash
cd frontend
npm install
npm start
```

# References

[1] [Django & React - Full Stack Web App Tutorial](https://youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j) by Tech With Tim
