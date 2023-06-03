#!/bin/sh

# Collect static assets
echo "Collecting the static assets..."
python manage.py collectstatic --noinput

# Wait for postgres to become healthy
echo "The database type is $DATABASE_TYPE..."
if [ "$DATABASE_TYPE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 1
    done

    echo "Postgres started"
fi

# Apply the migrations
echo "Applying the migrations..."
python manage.py makemigrations
python manage.py migrate

# Run the backend webserver
echo "The DEBUG flag is $DEBUG..."
if [ "$DEBUG" = "True" ]; then
    echo "Running Django development server..."
    python manage.py runserver 0.0.0.0:80
else
    echo "Running Django Gunicorn server..."
    gunicorn --bind 0.0.0.0:80 --workers 1 --timeout 60 --log-level debug backend.wsgi
fi
