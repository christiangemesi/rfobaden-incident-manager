# Backend: Introduction

The backend of the IncidentManager is implemented using Java. It's built using _Gradle_ and uses _Spring Boot_. It exposes a JSON-based REST-API, and persists its data in an MySQL database.

## Structure

> Note that unless otherwhise specified, all java classes and packages mentioned here can be assumed to be in the `ch.rfobaden.incidentmanager.backend` package.

The overall structure follows the standard Gradle project layout. The package structure loosely follows the 3-tier architecture and is as follows:

- `controllers` contains the REST controllers (presentation layer).
- `errors` contains custom exception and error classes.
- `models` contains the database models.
- `repos` contains repositories (persistence layer).
- `services` contains services (business layer).
- `utils` contains any otherwise unspecified helper classes.

The applications entry point is in `Application`.

## Further Reading

- [models](./002-models.md)
- [repositories](./003-repositories.md)
- [services](./004-services.md)
- [controllers](./004-controllers.md)
- [authentication](./006-authentication.md)
