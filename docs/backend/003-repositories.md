# Repositories

Repositores are defined in the `repos` package.  They are responsible for loading from and storing to the database, and thus represent the persistence layer. They are mainly implemented using Spring JPA repositories.

## `Model` Repositories

Repositories for `Model` data types may extend from `repos.base.ModelRepository`, which requires them to provide methods with which model instances can be loaded by path. They are used by the API to ensure that data is only loaded when it matches a specific path.

### Testing

Test Classes for classes implementing `ModelRepository` may extend `ModelRepositoryTest`, which provides tests for all commonly used methods of that interface. Note that this requires a generator for the model type.

if the model has relations to other models, your test will then have to save them. To do so, override the `saveRelations` method in your test class, and load the relations. See `ReportRepositoryTest` for an example of how this is done.
