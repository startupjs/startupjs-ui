# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## Unreleased

### Fixes

* **draggable:** placeholder position based on ghost (element) instead of cursor — same behavior regardless of grab point; equal slots + direction-aware index for reorder ([SortableJS-style](https://github.com/SortableJS/Sortable))
* **draggable:** multi-drop 2D hit-test — ghost center (refX/refY) determines which Droppable is hovered; correct cross-list drag and dropHoverId
* **droppable:** show placeholder when empty list is the active drop target (drag into empty zone)

## [0.1.16](https://github.com/startupjs/startupjs-ui/compare/v0.1.15...v0.1.16) (2026-02-10)

**Note:** Version bump only for package @startupjs-ui/draggable





## [0.1.11](https://github.com/startupjs/startupjs-ui/compare/v0.1.10...v0.1.11) (2026-01-20)

**Note:** Version bump only for package @startupjs-ui/draggable





## [0.1.5](https://github.com/startupjs/startupjs-ui/compare/v0.1.4...v0.1.5) (2025-12-29)

**Note:** Version bump only for package @startupjs-ui/draggable





## [0.1.3](https://github.com/startupjs/startupjs-ui/compare/v0.1.2...v0.1.3) (2025-12-29)

**Note:** Version bump only for package @startupjs-ui/draggable





## [0.1.2](https://github.com/startupjs/startupjs-ui/compare/v0.1.1...v0.1.2) (2025-12-29)


### Features

* add mdx and docs packages. Refactor docs to get rid of any @startupjs/ui usage and use startupjs-ui instead ([703c926](https://github.com/startupjs/startupjs-ui/commit/703c92636efb0421ffd11783f692fc892b74018f))
* **draggable:** refactor Draggable, Droppable, DragDropProvider components ([edf54e1](https://github.com/startupjs/startupjs-ui/commit/edf54e1171f6e89737281d580567b559d585d242))
