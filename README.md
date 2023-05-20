# Collaborative Music Playing System

The Collaborative Music Playing System is a way for you and your friends to listen to music on Spotify together! The system is built with React and Django.

# Setup

## Step 0: Set up a Spotify App

Follow the [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api) to create an App.

```bash
{
    "App name": "Collaborative Music Playing System",
    "App description": "The Collaborative Music Playing System is a way for you and your friends to listen to music on Spotify together!",
    "Redirect URIs": "http://127.0.0.1:8000/spotify/redirect"
}
```

## Step 1: Clone the project

```bash
git clone https://github.com/imranmatin23/collaborative-music-playing-system.git
cd collaborative-music-playing-system
```

## Step 2: Create virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

## Step 3: Run the backend

Update the Spotify credentials in `credentials.py`. Run the backend webserver at http://127.0.0.1:8000.

```bash
cd backend
python manage.py migrate
python manage.py makemigrations
python manage.py runserver
```

## Step 4: Run the frontend

Run the frontend webserver at http://127.0.0.1:3000.

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
3. Testing
4. CI/CD
5. Continuous: Update (fullstack-web-app-template)[https://github.com/imranmatin23/fullstack-web-app-template.git] with templates for all the above items

# Bug Fixes

1. `backend/spotify/views.py::spotify_callback()` does not return the user back to the Room they were in after authorizing with Spotify.
2. `frontend/src/components/MusicPlayer.js` is not rendering the Mui Icons (Pause/Play/Skip).
3. `frontend/src/components/Info.js` is not rendering the Mui Icons (NavigateBefore/NavigateAfter).
4. `frontend/src/components/Info.js` does not have full-fleged information about how to use the App.

# References

[1] [Django & React - Full Stack Web App Tutorial](https://youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j) by Tech With Tim
[2] [Writing Makefiles for Python Projects](https://venthur.de/2021-03-31-python-makefiles.html) by Bastian Venthur
[3] [Dockerizing Django App](https://blog.logrocket.com/dockerizing-django-app/) by LogRocket
