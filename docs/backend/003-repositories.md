# Repositories

Repositores are defined in the `repos` package.  They are responsible for loading from and storing to the database, and thus represent the persistence layer. They are mainly implemented using Spring JPA repositories.

## `Model` Repositories

Repositories for `Model` data types may extend from `repos.base.ModelRepository`, which requires them to provide methods with which model instances can be loaded by path. They are used by the API to ensure that data is only loaded when it matches a specific path.



