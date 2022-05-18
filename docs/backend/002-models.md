# Models

Models are defined in the `models` package. They represent how data is persisted in the database, and also in which structure this data is sent from and received by the API.

## The `Model`

Most models extend from the `Model` base class, which provides basic fields and helper methods for any normal model.

## Model Paths

The _path_ of a model describes at which endpoint the API (and thus the entire backend) is expected to show a specific model instance. It defines both how the API routes will look, and how models are loaded from the database.

A few examples:

- `Transport` instances always belong to a specific `Incident`.  The API exposes them at `/incidents/{incidentId}/transports`. The path of a report thus consists of a `incidentId`, which is the incident to which a specific `Transport` belongs.
- `Subtask` instances always belong to a specific `Task`, which belongs to a specific `Report`, which belongs to a specific `Incident`. The API exposes subtasks at `/incident/{incidentId}/reports/{reportId}/tasks/{taskId}/subtasks`. The path of a report thus consists of an `incidentId`, `reportId` and `taskId`.
- `Incident` instances do not belong to anything. The API exposes them at `/incidents`. Their path does thus consists of nothing - it is _empty_.

Paths are stored as simple classes, where every value of the path is stored in an instance variable. They can be found at `models.paths`.

Model which have a path should implement `PathConvertible`. Models with an empty path can extend `Model.Basic`, which automatically implements `PathConvertible<EmptyPath>`.

## Testing

Test classes for models may extend `PojoTest`, which provides tests for `equals(Object)` and `toString()`. `Model` subtypes may extend `ModelTests`, which builds on top of `PojoTest`, but requires a `Generator`.

### Generators

Generators are classes that provide fake data for testing purposes. They are stored in the tests packages under `test.generators`. It is recommended that you implement generators for every model type. Normal models can extend `Generator`, generators for `Model` subtypes can extend `ModelGenerator`.

After implementing a new generator, it has to be added to the `@Import`  annotation of the  `TestConfig` class found in the test package. This ensures that the generator gets loaded into your tests.



