# RFO Baden - Incident Manager

[[_TOC_]]

## Email information
| Mailadresse                       | im@rfo-baden.ch                   |
| Passwort                          | 54Rf0_ImT00l.17                   |
| Benutzername                      | im@rfo-baden.ch                   |
| Posteingangs- und Ausgangsserver  | lx52.hoststar.hosting             |
| Ports mit SSL/TLS                 | POP3: 995 / IMAP: 993 / SMTP: 465 |
| Ports ohne SSL/TLS                | POP3: 110 / IMAP: 143 / SMTP: 587 |
| Webmail                           | https://webmail.hoststar.ch       |

## Code Quality
[Frontend SonarQube](https://www.cs.technik.fhnw.ch/sonarqube/dashboard?id=rfobaden-incident-manager-frontend) <br>
[Backend SonarQube](https://www.cs.technik.fhnw.ch/sonarqube/dashboard?id=rfobaden-incident-manager-backend)

## Development
### Setup
#### Install frontend dependencies
```shell
docker compose run --no-deps frontend sh -c "npm install"
```

If you use an IDE, you most likely also want to install the frontend dependencies locally.
To do that, you will have to install node.js and run the following command:
```shell
cd frontend && npm install
```
Backend dependencies are automatically fetched on startup.
For local development, make sure to have installed JDK 11+ and gradle 7+.

#### Load Sample Data
> The backend and database need to be running. The database has to be empty.
```bash
# Load sample data:
docker compose exec database sh -c 'mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /data-sample.sql'

# Load dumped production data:
docker compose exec database sh -c 'mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /data-prod.sql'
```

#### Install Checkstyle plugin in IntelliJ IDEA
1. Download the Checkstyle plugin in the settings, and restart your IDE.
2. Go to `File > Settings > Tools > Checkstyle`.
3. Set `Checkstyle version` to `9.0` and `Scan Scope` to `only Java sources (including tests)`.
4. select `Configuration File > +`.
5. Under `Use a local Checkstyle file`, navigate to `backend/config/checkstyle/checkstyle.xml`.
6. Click `next` until the new configuration shows up in the list, and activate it.

### Usage
Start the application:
```shell
docker compose up
```

Start only the backend:
```shell
docker compose up backend
```

Stop the application:
```shell
docker compose down
```

The frontend is served on `localhost:3000`. 
The backend is served on `localhost:3001`.

#### Hot Reloading
Both the front- and backend containers support _hot reloading_.
This means that you don't need to restart the container when you make changes to the code.
Instead, changes are monitored and automatically applied to running instances.

**The frontend** reloads code in-place, which means that code is changed at runtime, at a very high speed.  
**The backend** needs to restart itself everytime, which means it is a lot slower when reloading.

> _On windows only_, the backend reload does not trigger on file save, but only on build.
Because of this, you need to either manually execute a `gradle build` after every change
(which defeats the entire point of hot reloading), or you configure your IDE to build on save.
For Intellij, activate the option `Build project automatically`
in `File > Settings... > Build, Execution, Deployment > Compiler`.

#### Linting
Java- und Typescript-Code is linted using [eslint](https://eslint.org/)
and [Checkstyle](https://checkstyle.sourceforge.io/), respectively.
Linters are automatically executed when pushing to `master` or `development`.

To manually lint the backend, run:
```shell
# locally (with Java & gradle installed):
gradle checkstyleMain checkstyleTest

# in docker:
docker compose run --no-deps backend sh -c  "gradle --no-daemon checkstyleMain checkstyleTest"
```

To manually lint the frontend, run:
```shell
# locally (with npm and dependencies installed):
npm run lint

# in docker
docker compose run --no-deps frontend sh -c "npm run lint"
```

### Cleanup
Remove currently installed frontend dependencies:
```shell
docker volume rm rfobaden-incident-manager_frontend.node_modules
```
Drop the database:
```shell
docker volume rm rfobaden-incident-manager_database

# Remove all remaining containers, drop the database, then restart:
docker compose down && docker volume rm rfobaden-incident-manager_database && docker compose up
```

# Testing
> Tests can also be run locally, without requiring a docker container.

Test the backend:
```bash
# locally
cd backend
gradle clean test --rerun-tasks

# in docker
docker compose run --no-deps backend gradle test
```

Test the frontend:
```bash
# locally
cd frontend
npm run test

# locally, using the interactive test runner
cd frontend
npm run test -- --watch

# in docker
docker compose run --no-deps frontend npm run test

# in docker, using the interactive test runner
docker compose run --no-deps frontend npm run test --watch 
```

Backend tests can also be run inside IntelliJ, which also offers built-in coverage testing.
For this to work correctly, make sure to go to `File > Settings... > Build, Execution & Deployment > Build Tools > Gradle`,
where you can configure `Build and run using:` as `Gradle (default)` and `Run tests using:` as `Intellij IDEA`.

Frontend tests can also be run inside IntelliJ, altough they are remarkably slow compared to just testing using the command line.

# Deployment
The project is continuously deployed.
- Commits to the `development` branch are deployed to the staging environment at [https://dev.im.rfobaden.ch]().
- Commits to the `master` branch are deployed to the production environment at [https://im.rfobaden.ch]().

# Other
## Database Export
The database can be dumped using the following command:
```bash
dkc exec database sh -c 'mysqldump -u root --password=${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} --no-create-info --no-create-db'
```
> The database service has to be running.