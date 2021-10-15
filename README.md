# RFO Baden - Incident Manager

## Development
### Setup
Install frontend dependencies:
```shell
docker-compose run --no-deps frontend sh -c "npm install"
```

If you use an IDE, you most likely also want to install the frontend dependencies locally.
To do that, you will have to install node.js and run the following command:
```shell
cd frontend && npm install
```
Backend dependencies are automatically fetched on startup.
For local development, make sure to have installed JDK 11+ and gradle 7+.

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
docker-compose up
```

Start only the backend:
```shell
docker-compose up backend
```

Stop the application:
```shell
docker-compose down
```

The frontend is served on `localhost:3000`.  
The backend is served on `localhost:3001`.

#### Hot Reloading
Both the front- and backend containers support _hot reloading_.
This means that you don't need to restart the container when you make changes to the code.
Instead, changes are monitored and automatically applied to running instances.

**The frontend** reloads code in-place, which means that code is changed at runtime, at a very high speed.  
**The backend** needs to restart itself everytime, which means it is a lot slower when reloading.
Also, the backend reload does not trigger on file save, but only on build.
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
docker-compose run --no-deps backend sh -c  "gradle --no-daemon checkstyleMain checkstyleTest"
```

To manually lint the frontend, run:
```shell
# locally (with npm and dependencies installed):
npm run lint

# in docker
docker-compose run --no-deps frontend sh -c "npm run lint"
```

### Cleanup
Remove currently installed frontend dependencies:
```shell
docker volume rm rfobaden-incident-manager_frontend.node_modules
```
Remove gradle caches:
```shell
docker volume rm rfobaden-incident-manager_backend.gradle-global
docker volume rm rfobaden-incident-manager_backend.gradle-local
```
Drop the database:
```shell
docker volume rm rfobaden-incident-manager_database
```
