# Services and Helpers

Utility functions which are reused throughout the project may be grouped together and stored as either a *Service* or a *Helper*. Both of these definitions follow the exact same layout: They are a JavaScript module with the following structure:

```ts
// file 'MyServiceOrHelper.ts'
 
class MyServiceOrHelper {
   // utility methods and fields
}
export default new MyServiceOrHelper()
```

The difference between services and helpers is their portability: Services are *project-specific*, while helpers are *generalized utilities*. This means that services may make use of all of the project's features (e.g. API, stores, components, other services, helpers). Helpers, on the other hand, are expected to use only the standard library (e.g. strings, arrays, fetch) and/or specific external libraries, for which they provide their utilities.

Examples for services:

- `BackendService` standardizes Backend API access.
- `UploadService` defines utilities access files (images, attachments, etc.)
- `AuthService` contains authorization and authorization functionality.

Examples for helpers:

- `StringHelper` contains string utilites
- `StyleHelper` contains CSS utitlies, and may make use of `styled-components`.
- `UrlHelper` contains utilities to read and write the current browser url.

> These are only examples, which may or may not exist in in our application.