# startupjs-ui Tasks

## Completed

- [x] Added a dedicated Expo-based `storybook/` workspace with Storybook 10 wiring.
- [x] Kept `docs/` functional while adding Storybook.
- [x] Added one Storybook story file for every real component/runtime package.
- [x] Added a minimal `startupjs-ui` integration story to smoke-test the meta package exports.
- [x] Upstreamed the downstream `dating` fixes into source packages:
  - `div` pressable semantics on web
  - `button` async pending cleanup on reject
  - `dialogs` provider remount lifecycle
- [x] Added initial accessibility/testability improvements for wrapped inputs, checkbox/switch/radio checked state, and web select labeling.
- [x] Storybook web starts successfully.
- [x] Storybook static build succeeds.
- [x] Docs build still succeeds.
- [x] Downstream `dating` validation passes against local linked `startupjs-ui` sources.

Covered by Storybook:
- [x] abstract-popover, alert, array-input, auto-suggest, avatar, badge, br, breadcrumbs
- [x] button, card, carousel, checkbox, collapse, color-picker, content
- [x] date-time-picker, dialogs, div, divider, draggable, drawer, drawer-sidebar, dropdown
- [x] file-input, flat-list, form, icon, input, item, layout, link, loader
- [x] menu, modal, multi-select, number-input, object-input, pagination, password-input
- [x] popover, portal, progress, radio, range-input, rank, rating, scroll-view, select
- [x] sidebar, smart-sidebar, span, startupjs-ui, table, tabs, tag, text-input, toast, user

## Remaining Accessibility / E2E Compatibility Work

- [ ] Make `Link` consistently targetable as a real semantic link in every web rendering path.
- [ ] Improve label relationships further so more composite fields work with `getByLabel(...)` without fallback selectors.
- [ ] Confirm combobox/listbox/option semantics for select-like composite widgets beyond the native web select path.
- [ ] Confirm `tablist` / `tab` / `tabpanel` semantics for `Tabs`.
- [ ] Tighten modal, popover, dropdown, and dialog naming/state semantics.
- [ ] Ensure icon-only actions require or derive accessible names.
- [ ] Add stable `data-testid` or slot-level test IDs only where semantics still cannot cover the widget.

## Notes

- Current repo lint / TS strictness in the Storybook workspace is not the release gate for this pass; successful compilation, rendering, and downstream validation are.
- If you use `playwright-interactive` for Storybook or docs QA, run it headless and avoid conflicting with another agent’s dev server session.
