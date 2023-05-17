FROM python:3.9

# Setup environment variable for root directory 
# (docker home directory) of Django App
ENV DockerHOME=/home/app/webapp
# Create directory in image for docker home directory
RUN mkdir -p $DockerHOME
# Set working directory to docker home directory
WORKDIR $DockerHOME

# Set Python environment variables  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Upgrade pip  
RUN pip install --upgrade pip

# Copy the whole project to the docker home directory
COPY . $DockerHOME

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port on the container for Django App
EXPOSE 8000

# Run the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
