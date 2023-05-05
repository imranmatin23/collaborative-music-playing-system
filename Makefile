makemigrations:
	python music_controller/manage.py makemigrations

migrate:
	python music_controller/manage.py migrate

run:
	python music_controller/manage.py runserver
