# Authentication

The backend API authenticates it's users via JWT. These JWTs have a lifetime of 30 days. They can be set back to the client either via an HTTP cookie, or by an `Authorization`-Header set to `Bearer <jwt>`.

JWTs are managed by the `SessionController`.

## Roles

Users are divided into two groups - `AGENT` and `ADMIN`. Users with the `ADMIN` role have full access to the entire API. The `AGENT` role is more restrictive - for example, it can't create, close or delete incidents.

