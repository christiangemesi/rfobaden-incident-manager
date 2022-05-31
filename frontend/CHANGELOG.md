# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Transports can now be closed via dropdown item.

### Changed
- The start page now shows all panels on desktop, without the need to scroll.
- Adjusted multiple colors to better fit together.
- Closed records and tasks now show that with a banner.
- The organization list on the incident page no longer contains an add button.
- Submit buttons now contain text instead of icons.

### Fixed
- The page is no longer scrollable while a modal is open.
- The vehicle and trailer dropdowns in transport forms now work as expected.
- Adjusted multiple elements to always be visible on mobile.

## [4.0.0] - 14.05.2022
### Added
- Incidents, reports, transports, tasks and subtasks can now be printed.
- Uploaded images can now be seen by clicking on the image counter in the header of the record they belong.
- User password reset is now implemented.
- Documents can now be attached to incidents, reports, tasks and subtasks. Their name and type is not yet displayed correctly.
- Organizations can now be managed at `/organisationen`.
- Reports now require an entry type, which describes which source caused them to be created.
- Errors and similar events are now displayed to the user in alert overlays.
- Incidents now have a `Ereignis` text above their name, which links back to `/ereignisse`.
- Closed incidents are now listed on `/ereignisse/archiv`.

## Changed
- The entire webpage is now fully responsive.
- Adapted overall fonts and spacing
- Vehicles and trailers on transports now support autocomplete and deletion.
- The list of reports now shows the report's description.
- Images and documents are now uploaded using the button in their respective drawers.
- All closed items are now greyed out.
- Renamed all `Schliessen` to `Abschliessen.`

## Fixed
- Header and footer are now guaranteed to not be visible immediately after a logout.
- Attempting to create a user with an already existing email is now shown as error in the form.
- The todo list in the header is now updating when assigning to oneself.
- The filename and type of documents is now displayed correctly.
- The organization count on incidents is now displayed correctly.

## [3.0.0] - 13.04.2022
### Added
- Modals can now be closed by pressing the escape key.
- Incidents, reports and tasks now support manual closing.
- Added page footer.
- New users and assignees now receive email notifications.
- The landing page at `/` now contains a dashboard.
- The incident page at `/ereignisse/{id}` now contains a progress circle.
- Profile specific actions are now available as a dropdown via the username in the header.
- Added image upload for incidents, reports, tasks and subtasks. Images are not displayed anywhere yet.
- Incidents can now have transports.
- The incident page at `/ereignisse/{id}` now contains tabs to switch between report and transport management.

### Changed
- Updated the overall theme (fonts, colors, etc.) to align more closely with our design documents.
- Redesigned the incident page.
- Redesigned the users page.
- Replaced the date/time input.
- Redesigned the login page.
- Signing in is now mandatory.
- Agents no longer have access to admin-only actions.

### Removed
- The profile page has been removed.

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
