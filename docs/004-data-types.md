# Data Types

## Incident Management

The IncidentManager offers the following data types for structuring an Incident:

- The _Incident_ (_Ereignis_) itself, representing any major event organized and handled via the IncidentManager.
- The _Transport_, representing a commission to transport something from one location to another, in the context of an _Incident_.
- The _Report_ (_Meldung_), representing any event happening at an _Incident_, to which the RFO has to react.
- The _Task_ (_Auftrag_), representing an action which has to be taken in order to handle a specific _Report_.
- The _Subtask_ (_Teilauftrag_), representing a signle, small part of a _Task_.

These data types have the following relations:

- One _Incident_ can have zero or more _Transports_. A _Transport_ always belongs to exactly one _Incident_.

- One _Incident_ can have zero or more _Reports_. A _Report_ always belongs to exactly one _Incident_.
- One _Report_ can have zero or more _Tasks_. A _Task_ always belongs to exactly one _Report_.
- One _Task_ can have zero or more _Subtasks_. A _Subtask_ always belongs to exactly one _Task_.

## User Management

Users are structured as follows:

- The _Organization_ represents an organization working with the IncidentManager, such as the RFO Baden itself, the Police, Fire Departement, and others.
- The _User_ represents a real person working with the IncidentManager. 

As such, these data types have the following relations:

- An _Organization_ can have zero or more _Users_.
- A _User_ can belong to exactly one _Organization_, or to none at all.

