# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2022-02-16
### Added
- The changelog is now available under `/changelog`.
- Incidents, reports, tasks and subtask are now sorted according to priority and close status.
- Closed report, task and subtask list items will now appear slightly greyed out.

### Fixed
- Incident deletion now correctly clears local data, which means incidents will no longer be visible right after deletion.
- Hovering of incident and report list items no longer causes the items to light up excessively.
- Line breaks in the description of incidents, reports, tasks and subtasks will now be displayed correctly.
- Changing from a report with a large amount of tasks to one with a smaller amount will no longer cause the page scroll to jump upwards.

## [0.3.1] - 2022-02-06
### Added
- Added breadcrumbs to easily navigate and differentiate between the parts of an incident.

### Changed
- Forms can now be submitted by clicking the enter key.

### Fixed
- The amount of closed subparts (e.g. closed reports in an incident) now gets displayed and updated correctly.

## [0.3.0] - 2022-01-19
### Added
- Added organization management.
- Users can now belong to an organization.
- The organizations involved with a specific incident are listed on it.
- Add a page header.

### Changed
- Restructured the incidents page at `/incidents`.
- Renamed the _creator_ role to _agent_.

## [0.2.0] - 2021-12-03
### Added
- CI/CD Setup
- SonarQube for frontend and backend
- Report and task management
- Reports, tasks and subtasks can now be assigned to a user.
- Reports, tasks and subtasks can now be prioritized.
- Incidents, reports, tasks and subtasks can now be edited.
- User can now change their own password.

## [0.1.0] - 2021-11-03
### Added
- Project setup with docker integration
- User management
- Incident management
