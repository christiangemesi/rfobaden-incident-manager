# Backend: Introduction

The backend of the IncidentManager is implemented using Java. It's built using _Gradle_ and uses _Spring Boot_.
It exposes a JSON-based REST-API, and persists it's data in an SQL database.

## Structure

> Note that unless otherwhise specified, all java classes and packages mentioned here can be assumed to be in the `ch.rfobaden.incidentmanager.backend ` package.

The overall structure follows the standard Gradle project layout. The package structure loosely follows 3-tier archictecture and is as follows:

- `controllers` contains the REST controllers (presentation layer).
- `errors` contains custom exception and error classes.
- `models` contains the database models.
- `repos` contains repositories (persistence layer).
- `services` contains services (business layer).
- `utils` contains any otherwise unspecified helper classes.

The applications entry point is in `Application`.

