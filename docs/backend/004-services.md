# Services

Services are defined in the `services` package. They are responsible for implementing general logic and behaviour and thus represent the business layer. 

# `Model` Services

Services for `Model` data types may extend the `services.base.ModelRepositoryService` base class. It provides basic (and not so basic) CRUD functionality. To do so, it requires only an instance of a `ModelRepository`.

### Testing

Test Classes for `ModelService` subtypes may extend `ModelRepositoryServiceTest`, which provides tests for all methods of that class. Note that this requires a generator for the model type.
