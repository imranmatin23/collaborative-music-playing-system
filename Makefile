makemigrations:
	python music_controller/manage.py makemigrations

migrate:
	python music_controller/manage.py migrate

run-backend:
	python music_controller/manage.py runserver

run-frontend:
	cd music_controller/frontend; \
	npm run dev; \
	cd ../..
