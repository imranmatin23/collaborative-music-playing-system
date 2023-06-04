# Frontend

The frontend was created using the `create-react-app` CLI. To run the frontend locally, set the environment variables in the `.env` file.

```bash
REACT_APP_BACKEND_URL="http://127.0.0.1:80"
CHOKIDAR_USEPOLLING=true
```

## Available Commands

### `make run-frontend`

Builds and runs the frontend's development server as a container using Docker Compose at http://127.0.0.1:3000.

### `make stop-frontend`

Stops the running frontend container.

### `make logs-frontend`

Retrieves the logs for the running frontend container.
