# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- [FEATURE] Auto login when there is a valid Entra ID session.

## [2.0.0] - 2024-06-01

- Initial copy from https://github.com/mckaywrigley/chatbot-ui
- ...

## [2.1.0] - 2024-06-11

### Added

- Added auto sign in for supabase
- Added auto sign up for supabase
- Added Azure authentication
- Added Euricom colors in tailwind setup
- Added Euricom favicon

### Changed

- Changed some styling to euricom colors

### Fixed

- Fixed error with failing packages
- Fixed error with using edge runtime

### Removed

- Removed Help function
- Removed sign in and setup pages
- Removed assistants and tools
- Removed assistants/models/tools/collections from sidebar
- Removed possibility to have multiple workspaces
- removed possibility to add own API keys
- Removed redirect link to chatui page from icon

## [2.2.0] - 2024-06-12

### Fixed

- Fixed automatic supabase login and azure login

## [2.2.1] - 2024-06-13

### Changed

- Changed color palette of the sidebar

## [2.2.2] - 2024-06-14

### Added

- Added development database
- Added migrations to remove policies and foreign keys
- Added assistants for admins and make assistants usable for every user

## [2.3.0] - 2024-06-18

### Added

- Added Admin files which can be maintained by admins and used by every one through the assistants

## [2.3.0] - 2024-06-20

### Added

- Added tools
- Added tool to get smoelenbook

### Changed

- Changed admin files so they're no longer visible for non admins

### Fixed

- Fixed bug where description was not getting saved when creating file
- Fixed admin files so they are no longer draggable for non admins

### Removed

- Removed import button

## [2.3.1] - 2024-06-21

### Added

- Added admin security for admin pages

### Changed

- Changed all next images to normal images (no image optimization in Vercel)
- Changed file picker to no longer include admin files

### Removed

- Removed tools

## [2.3.2] - 2024-06-24

### Added

- Added a way to generate own files based on json

### Changed

- Changed azure login to automatically login when session exists

## [2.4.0] - 2024-06-25

### Added

- Added API endpoint to generate a smoelenbook json file
- Added Changelog and new ReadMe
- Added a way to get the usage out of the stream and log it

### Changed

- Changed azure login to automatically login when session exists
- Upgrade openai to newer version
- Changed smoelenbook endpoint to generate pdf file
- Change database so usage can get saved in database

### Fixed

- Fixed visual bug where previous message gets removed and added again every time

## [2.4.1] - 2024-06-26

### Changed

- Changed db-pull script

## [2.4.2] - 2024-06-27

### Added

- Added the token usage in the ui
- Added functions to easily generate own file in json, pdf or txt

### Changed

- Changed file picker to not show admin files

## [2.5.0] - 2024-07-02

### Added

- Added the cost per request in the ui and save in database
- Added functions to easily generate own file in json, pdf or txt
- Added new column in database for cost

### Changed

- Changed default model to 3.5
- Changed logo's and name

### Fixed

- Fixed error when creating file

### Removed

- Removed openai Vision model
- Removed token calculation from the ui

## [2.5.1] - 2024-07-03

### Added

- Added app description

### Changed

- Changed color of cost per message

### Fixed

- Fixed error: cron page was seen as static instead of dynamic

## [2.5.2] - 2024-07-16

### Added

- Added balance overview in sidebar

### Changed

- Changed color of cost per message

### Fixed

- Fixed error: cron page was seen as static instead of dynamic

## [2.5.3] - 2024-07-17

### Added

- Added cron job for smoelenboek
- Added month switcher for balances

## [2.5.4] - 2024-07-24

### Added

- Added gpt-4o-mini model from openai
- Added messages, chats and total in balance overview

### Changed

- Changed default model to gpt-4o-mini

## [2.5.5] - 2024-09-05

### Changed

- Changed assistants so they can be assigned to a role

### Fixed

- Fixed pricing when deleting chats
- Fixed bug when switching chats when talking to assistant

### Removed

- Removed really small old logo
