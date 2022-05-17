# Controllers

Controllers are defined in the `controllers` package.  They are responsible for defining API endpoints, and thus represent the presentation layer.

## Authorization

Authorization is provided by Spring Security. To authorize a user, you can use annotations provided by Spring Security, such as `@PreAuthorize`. As an alternative, the backend provides the custom `@RequireAgent` and `@RequireAdmin` annotations.

Authorization annotations can be either applied directly to controller methods, or to the entire controller at once.

## Model Controllers

Controllers for `Model` data types may extend from the `controllers.base.ModelController` base class. It provides all normal REST CRUD routes. To do so, it requires only an instance of a `ModelService`.

### Loading Relations

if the model has relations to other models, your controller will have to load them when the model is being changed. To do so, override the `loadRelations` method in your controller and load the relations.
See `ReportController` for an example of how this is done.

### Authorization

By default, `ModelController` allows read-only access for all `AGENT` users, and read-and-write access for `ADMIN` users. This can be changed by either applying an authorization annotation to your entire controller, or by overriding a specific method, and applying an annotation to it.

> If you override a controller method, you must also copy all the annotations of it's parameters!

### Testing

Test Classes for  `ModelController` subtypes may extend `ModelControllerTest`, which provides tests for all methods of that class. Note that this requires a generator for the model type.

if the model has relations to other models, your test will then have to mock them. To do so, override the `mockRelations` method in your test class. See `ReportControllerTest` for an example of how this is done.
