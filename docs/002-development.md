# Development

The IncidentManager is running as a set of Docker containers, composed to together using `docker compose`. 

Start the application:

```
docker compose up
```

Stop the application:

```
docker compose down
```

- the frontend is running at `http://localhost:3000`.
- the backend is running at `http://localhost:3001`.
- the database is running at `localhost:3002` . Credentials and database name are defined in the [.env](../.env) file.

## Dependencies

For the frontend to work correctly, it's dependencies need to be manually installed:

```shell
docker compose run --no-deps frontend sh -c "npm install"
```

Backend dependencies are automatically fetched on startup.

## Persisted Data

Some parts of the application are persisted even when it's containers are stopped. They have to be manually removed, if you desire to do so.

> Note that the docker containers have to be stopped in order for these commands to work.

Remove frontend dependencies:
```sh
docker volume rm rfobaden-incident-manager_frontend.node_modules
```

Remove the database:

```
docker volume rm rfobaden-incident-manager_database
```

Remove backend gradle cache, including dependencies:
```
docker volume rm rfobaden-incident-manager_backend.cache
```

Remove backend build directory:

```
rm -r backend/build

# on windows:
rd /s /q "backend\build"
```

