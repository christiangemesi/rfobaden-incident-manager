# RFO Baden - Incident Manager

## Development
### Setup
Install frontend dependencies:
```shell
docker-compose run frontend sh -c "npm install --silent"
```

If you use an IDE, you most likely also want to install the frontend dependencies locally.
To do that, you will have to install node.js and run the following command:
```shell
cd frontend && npm install
```
Backend dependencies are automatically fetched on startup.

### Using Checkstyle plugin in IntelliJ IDEA
1. Download the Checkstyle plugin in the settings.
2. Add the Configuration under `Settings->Tools->Checkstyle->Configuration File->+` select `backend/config/checkstyle.xml` file.

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
