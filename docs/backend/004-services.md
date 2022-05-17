# Services

Services are defined in the `services` package.  They are responsible for implementing general logic and behaviour, and thus represent the business layer. 

# `Model` Services

Services for `Model` data types may extend from the `services.base.ModelRepositoryService` base class. It provides basic (and not so basic) CRUD functionality. To do so, it requires only an instance of a `ModelRepository`.