# Backend

The backend was created using the `django-admin` CLI. To run the backend locally, set the environment variables in the `.env` file.

```bash
SECRET_KEY="HNj3ykMBbsrvgLmKwvcwLceu"
DEBUG=True
CORS_ORIGIN_ALLOW_ALL=True
CORS_ALLOW_CREDENTIALS=True
ALLOWED_HOSTS="localhost 127.0.0.1 [::1]"
DATABASE_TYPE="postgres"
SQL_ENGINE="django.db.backends.postgresql"
SQL_DATABASE="django_database"
SQL_USER="django_user"
SQL_PASSWORD="django_password"
SQL_HOST="db"
SQL_PORT="5432"
SPOTIFY_CLIENT_ID="TODO"
SPOTIFY_CLIENT_SECRET="TODO"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:80/spotify/redirect"
FRONTEND_ENDPOINT="http://127.0.0.1:3000"
```

## Available Commands

### `make build-backend`

Builds the Docker image for the backend.

### `make run-backend`

Builds and runs the backend and database as containers using Docker Compose at http://127.0.0.1:80.

### `make stop-backend`

Stops the running backend and database containers.

### `make logs-backend`

Retrieves the logs for the running backend container.

### `python manage.py makemigrations`

Stores changes to models as a migration.

### `python manage.py migrate`

Creates any necessary database tables by looking at the INSTALLED_APPS and database settings.
