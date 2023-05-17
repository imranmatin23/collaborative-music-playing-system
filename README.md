# Collaborative Music Playing System

The Collaborative Music Playing System is a way for you and your friends to listen to music on Spotify together! The system is built with React and Django.

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

## Step 5: Build the App

Builds the frontend and moves the build to the backend. To test the build simply run the backend webserver only.

```bash
cd frontend
npm run relocate
```

## Step 5: Deploy the App

TODO

```bash
TODO
```

# TODO

1. Spotify Integration
2. IaaC/Deployment (monolith)
3. CI/CD
4. Testing
5. Continuous: Update (fullstack-web-app-template)[https://github.com/imranmatin23/fullstack-web-app-template.git] with templates for all the above items

# References

[1] [Django & React - Full Stack Web App Tutorial](https://youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j) by Tech With Tim
