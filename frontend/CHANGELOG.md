# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Modals can now be closed by pressing the escape key.

### Fixed
- Scroll is now disabled while a modal is open.

## [0.3.0] - 24.02.2022
### Added
- Organizations can now be managed at `/organizations`.
- Users can now belong to an organization.
- The organizations involved with a specific incident are shown in the incident list.
- The organizations involved with a specific incident are shown in that incidents detail page at.
- All pages now include a shared header.
- The changelog is now available at `/changelog`.
- The task view now includes breadcrumbs to navigate back to the report and incident it belongs to.
- Incidents, reports, tasks and subtask are now sorted according to priority and close status.
- Closed report, task and subtask list items will now appear slightly greyed out.

### Changed
- Restructured the incidents page.
- Renamed the _creator_ role to _agent_.
- The design of the priority icons has been updated.
- The design of the create buttons has been updated, and the buttons have been positioned differently.
- The icon for key reports has been changed to an actual key.
- Date inputs can now be changed using a dialog containing a date/time selection.

### Fixed
- Forms can now be submitted by clicking the enter key.
- Incident deletion now correctly clears local data, which means incidents will no longer be visible right after deletion.
- The amount of closed subparts (e.g. closed reports in an incident) now gets displayed and updated correctly.
- Hovering of incident and report list items no longer causes the items to light up excessively.
- Line breaks in the description of incidents, reports, tasks and subtasks will now be displayed correctly.
- Changing from a report with a large amount of tasks to one with a smaller amount will no longer cause the page scroll to jump upwards.
- Deletion of tasks and subtasks now correctly reroutes back to the respective parent page.

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
