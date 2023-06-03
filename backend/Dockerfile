FROM python:3.10

# Set Python environment variables  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set a directory for the app
WORKDIR /usr/src/app

# Copy the whole project to the docker home directory
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install netcat -y

# Expose the port on the container for Django App
EXPOSE 80

# Run the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
