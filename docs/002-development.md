# Development

The IncidentManager is running as a set of Docker containers, composed to together using `docker compose`. 

Start the application:

```shell
docker compose up
```

Stop the application:

```shell
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

```shell
docker volume rm rfobaden-incident-manager_frontend.node_modules
```

Remove the database:

```shell
docker volume rm rfobaden-incident-manager_database
```

Remove backend Gradle cache, including dependencies:

```shell
docker volume rm rfobaden-incident-manager_backend.cache
```

Remove backend build directory:

```shell
rm -r backend/build

# on windows:
rd /s /q "backend\build"
```

## Database

### Dumping Database

> The database has to be running in order for these commands to work.
> Note that this only exports the data, not the structure of the database.

```shell
docker compose exec database sh -c 'mysqldump -u root -p${MYSQL_ROOT_PASSWORD} --no-create-info ${MYSQL_DATABASE}' > dump.sql
```

### Importing Sample Data

> The database and backend have to be running in order for these commands to work.

```shell
# Load minimal data(only admin and agent users):
docker compose exec database sh -c 'mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /data-minimal.sql'

# Load sample data:
docker compose exec database sh -c 'mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /data-sample.sql'

# Load dumped production data:
docker compose exec database sh -c 'mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /data-prod.sql'
```
