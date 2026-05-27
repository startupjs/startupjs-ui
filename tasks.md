# startupjs-ui QA Tasks

This file is the working ledger for Storybook interaction coverage, component behavior review, and the follow-up accessibility/E2E ergonomics pass.

Current state:
- The initial component-by-component audit pass is complete for the public component set.
- Most components are now `covered with follow-up`, which means the current real behavior has Storybook coverage and the natural-but-currently-failing expectations are preserved in colocated `failingFollowup` specs.
- `abstract-popover` remains partially blocked: it has smoke coverage, but interaction coverage in the current Storybook web harness still hangs on the portal/measurement lifecycle.

Initial audit workflow:
1. Audit natural expectations first.
2. Record suspected gaps or follow-up improvements here before changing tests.
3. Add or refine Storybook stories and `play` coverage for the component.
4. Keep any currently-failing but still desirable expectations as a colocated non-executed `failingFollowup` spec inside the story file.
5. Run Storybook tests before moving to the next component.

Follow-up pass workflow:
1. Pick one `covered with follow-up` component at a time.
2. Re-read its ledger notes and the colocated `failingFollowup` spec before making code changes.
3. Improve the component or shared infrastructure in the smallest safe way that matches first-time-user expectations.
4. Promote the relevant `failingFollowup` assertions into green `play` coverage once the behavior is fixed.
5. Re-run that story before moving to the next component, and keep this ledger updated with anything newly discovered.

Status legend:
- `not started`
- `auditing`
- `covered`
- `covered with follow-up`

## Current Focus

- [ ] Follow-up pass:
  - Start with the obvious shared fixes that improve many components at once and are unlikely to be breaking.
  - Then work component-by-component turning `failingFollowup` specs green.
  - Keep `file-input` limited to surface-level work until the Expo/server runtime path is available.
  - Keep `abstract-popover` interaction work isolated, since it is still a Storybook harness blocker.

## Follow-up Backlog

### Low-hanging fruit / obvious / low-risk

1. [x] Shared disabled-state semantics normalization
   - Add consistent disabled semantics on web for interactive surfaces that already block interaction:
     - `Div`
     - pressable `Card`
     - `Button`
     - wrapped `Checkbox`
     - `ColorPicker`
     - `MultiSelect` trigger
   - Goal: if something is visually disabled and non-interactive, it should also expose disabled semantics naturally to users and E2E tools.

2. Shared icon-only action naming
   - Add or enforce accessible naming for icon-only action surfaces that are already clearly actionable:
     - `Alert` close
     - `Toast` close
     - tag icon actions
     - pagination icon buttons
     - password visibility toggle
   - Prefer small safe naming improvements over redesigns.

3. Shared input wrapper tightening
   - Keep improving label/description/error propagation where the wrapper model already exists:
     - `Input`
     - `Form`
     - `ObjectInput`
     - `NumberInput`
     - `PasswordInput`
     - disabled wrapped `Select`
   - Focus on cases that should already be discoverable by label but still are not.

4. Low-level host prop / targeting pass
   - Forward straightforward host targeting props where the component is a low-level primitive and the omission looks accidental rather than intentional:
     - `Badge`
     - `Divider`
     - `ColorPicker` trigger wrapper
     - `Portal` host/debug surface where safe
   - Goal: make developer-facing E2E targeting easier without changing component behavior.

5. Story/docs cleanup where the examples are misleading
   - Attach real handlers in stories/docs where actions are currently rendered as inert previews.
   - Keep stories aligned with actual interactive usage so the QA surface stays trustworthy.

6. Web deprecation cleanup that should be mechanical
   - Clean up repeated web/runtime warnings that look implementation-level rather than product-level:
     - deprecated `pointerEvents` prop usage
     - `TouchableWithoutFeedback` where a safer modern replacement is obvious
     - invalid DOM prop warnings such as `transform-origin`

7. [x] Public accessibility prop alignment
   - Use `role` and `aria-*` as the documented StartupJS UI accessibility API.
   - Remove explicit legacy `accessibility*` props from component interfaces and internal wiring.
   - Keep semantic Playwright locators covered in Storybook for select-like popovers, inputs, and dialog/calendar surfaces.
   - Add docs guidance under `/docs/Accessibility`.

### Medium difficulty / likely worth doing next, but requires component-specific work

1. Overlay semantics normalization
   - Bring higher-level popup components closer to natural web contracts:
     - `Dropdown`
     - `Popover`
     - `MultiSelect`
     - `AutoSuggest`
     - `Drawer`
     - `Sidebar`
     - `SmartSidebar`
   - This likely needs component-by-component treatment even if some helpers can be shared.

2. Landmark and container semantics
   - Add clearer high-level semantics where the visual structure is already obvious:
     - `Breadcrumbs`
     - `Menu`
     - `Sidebar`
     - `Table`
     - `Collapse`
     - `Progress`
     - `Radio` group boundary

3. Readonly semantics pass
   - Normalize components whose readonly output currently feels surprising:
     - `Checkbox`
     - `MultiSelect`
     - possibly `Rating` / `Progress` value exposure depending on final direction

4. Repeated-field naming for generated/nested inputs
   - Improve developer and user ergonomics for repeated/nested structures:
     - `ArrayInput`
     - `ObjectInput`
     - generated controls inside `Form`

5. Hidden-state normalization
   - Ensure closed/collapsed content behaves consistently for browser visibility and accessibility:
     - `Collapse`
     - `DrawerSidebar`
     - `Sidebar`
     - `SmartSidebar`

6. Storybook TypeScript cleanup
   - Run `tsc --noEmit -p storybook/tsconfig.json` as a dedicated follow-up pass and separate story-only typing issues from package-source typing issues.
   - Story-only issues currently include:
     - icon prop typing mismatches in stories such as `Button` / `Link`
     - stories using props not present in declared component types, such as `label` on `PasswordInput` / `DateTimePicker`
     - story typing mismatches such as missing required `args` on `FlatList`
     - callback typing mismatches such as `RangeInput` `onChange`
   - Package-source issues currently also leak into this run, so decide whether Storybook typecheck should stay broad or get a narrower stories-only config.

### Research / design / potentially debatable or breaking

1. Semantic contract decisions that may affect public expectations
   - Should `Button` without `onPress` still expose button semantics?
   - Should readonly controls remain semantic controls or degrade to plain text?
   - Should badge counts/dots participate in accessible names or be hidden by default?

2. Low-level primitive boundary decisions
   - `AbstractPopover`: what belongs in the primitive versus higher-level wrappers?
   - `Portal`: do we want an explicit host/debugging contract?
   - `Icon`: whether decorative hiding should be automatic or opt-in in every context.

3. Complex interaction semantics
   - `RangeInput` slider semantics
   - `Rank` reorder semantics
   - `Draggable` keyboard/pointer accessibility contract
   - `Carousel` navigation and active-slide semantics
   - `Rating` star control contract

4. Runtime/harness blockers
   - `FileInput` real upload lifecycle in an Expo/server-backed environment
   - `AbstractPopover` interaction coverage in Storybook web
   - `DateTimePicker` time-mode instability in the current Storybook web harness
   - `ObjectInput` hooks-order warning under dependency toggling

5. TypeScript config boundary for Storybook
   - Decide whether `storybook/tsconfig.json` should typecheck:
     - all package source transitively, or
     - stories plus only the intended public story surface
   - Current `tsc` output mixes real story authoring issues with unrelated package-source typing problems, which makes Storybook-specific typecheck noisier than it should be.

## Component Ledger

### abstract-popover
- Status: auditing
- Expected behavior: anchor positioning, visibility lifecycle, dismissal, focus and pointer-safe overlay behavior.
- Follow-up notes:
  - This low-level primitive currently exposes no built-in semantic role or naming contract; higher-level wrappers must supply that today.
  - It does not appear to forward straightforward host targeting props such as `testID`, which makes direct E2E inspection harder than expected.
  - Outside-dismiss, focus trapping, and current accessibility semantics are intentionally not built in here; later pass should document that boundary more explicitly if it remains low-level by design.
  - The current Storybook harness can smoke-render the mocked-anchor story, but interaction coverage still hangs on the portal/measure-driven lifecycle; keep the desired behavior in `failingFollowup` and revisit with a dedicated debugging pass instead of leaving a flaky `play` test in place.

### alert
- Status: covered with follow-up
- Expected behavior: clear message semantics, stable icon/title/content rendering, color variants.
- Follow-up notes:
  - The root alert surface currently lacks explicit live-region semantics; decide whether variants should expose `role="alert"`, `status`, or another documented pattern.
  - The built-in close action is icon-only and currently has no accessible name.
  - Story/docs examples using `Button` actions should attach real handlers so the action area is exercised as actual buttons rather than static previews.

### array-input
- Status: covered with follow-up
- Expected behavior: add/remove/reorder flows, field labeling, nested form semantics.
- Follow-up notes:
  - Repeated rows currently share the same field label, so there is no stronger row-level naming contract such as “Participant 1”, “Participant 2”, etc.
  - Remove actions are currently icon-only row buttons, so they do not expose the natural accessible names a first-time user would expect, such as “Remove Participant 1”.
  - Typing into the extra blank row does not currently materialize into the bound array value in this web Storybook audit flow, so the “append by filling the trailing row” contract needs a dedicated follow-up pass.

### auto-suggest
- Status: covered with follow-up
- Expected behavior: text entry, option filtering, keyboard navigation, selection, popup semantics.
- Follow-up notes:
  - The natural web expectation is a combobox/listbox-style semantics contract with named options and expanded state, but the current surface is still closer to a text input plus floating menu.
  - The dismiss overlay and popup surface do not yet expose a strong semantic contract for natural E2E targeting.

### avatar
- Status: covered with follow-up
- Expected behavior: image/fallback initials/status badge rendering without accidental interactivity.
- Follow-up notes:
  - When `Avatar` is interactive, its natural accessible name is weak because the visible fallback is typically just initials; docs or the component should push authors toward an explicit accessible name for pressable avatars.
  - Status indicators appear decorative; later pass should verify whether they should be hidden from accessibility by default.

### badge
- Status: covered with follow-up
- Expected behavior: badge overlay positioning and value rendering without blocking parent semantics.
- Follow-up notes:
  - Need a deliberate accessibility strategy for badge content on web: count overlays may accidentally become part of a wrapped control's accessible name.
  - Dot badges are usually decorative; later pass should decide whether they should be hidden from accessibility by default.
  - `Badge` does not currently forward straightforward host targeting props such as `testID`, which makes normal developer-facing E2E targeting harder than it should be.

### br
- Status: covered with follow-up
- Expected behavior: pure spacing helper, non-interactive, no meaningful accessibility surface.
- Follow-up notes:
  - Current implementation uses `Text`, which may be a poor semantic choice for a pure spacer.
  - Consider a later improvement to make it explicitly presentational/hidden from accessibility.
  - Consider switching it to a `View`-like host and allowing standard host props such as `testID` without changing its visual role.

### breadcrumbs
- Status: covered with follow-up
- Expected behavior: semantic navigation trail with readable link names and current page indication.
- Follow-up notes:
  - Natural web expectation is a navigation landmark/list structure for breadcrumbs; current implementation appears purely visual.
  - The last breadcrumb should probably expose current-page semantics (`aria-current="page"` or equivalent) in a later pass.

### button
- Status: covered with follow-up
- Expected behavior: native button semantics on web, accessible names for icon-only actions, async pending lifecycle, disabled state.
- Follow-up notes:
  - `Button` without `onPress` currently renders as a static surface, so disabled/preview-only buttons lose button semantics entirely; decide whether `Button` should always expose button semantics regardless of handler presence.
  - Icon-only and custom-content buttons still depend on the caller supplying an accessible name; consider whether the component/docs should enforce that contract more strongly.
  - Async pending state visually swaps to a loader and blocks duplicate presses, but likely also wants explicit busy-state semantics (`aria-busy` or equivalent).
  - Rejected async handlers still surface as unhandled browser rejections even though the loader clears; decide whether `Button` should swallow/rethrow them in a safer way.

### card
- Status: covered with follow-up
- Expected behavior: static container by default, button-like surface when pressable, no nested interactive host issues.
- Follow-up notes:
  - For rich pressable cards, docs should probably recommend an explicit accessible name instead of relying on whatever descendant text becomes the computed name.

### carousel
- Status: covered with follow-up
- Expected behavior: slide visibility, index changes, loop/endless behavior, keyboard/pointer navigation where applicable.
- Follow-up notes:
  - The natural expectation is named previous/next controls such as “Previous slide” and “Next slide”, but the current arrow affordances are icon-only.
  - The current surface does not yet expose a strong semantic active-slide contract, so tests still benefit from explicit state text rather than relying on carousel semantics alone.
  - In the current web Storybook harness, the responsive branch still logs sizing errors (`isResponsive need minWidth and maxWidth`, `no valid minSide/maxSide`) and the arrow interaction does not reliably drive the exposed active index.

### checkbox
- Status: covered with follow-up
- Expected behavior: checkbox/switch semantics, label association, checked/disabled state, keyboard activation.
- Follow-up notes:
  - `readonly` currently renders as plain text glyphs instead of a semantic readonly checkbox/switch surface; decide whether that is the intended public contract.
  - Disabled behavior should be verified at the semantic level as well as the visual level; later pass may need stronger disabled-state normalization.

### collapse
- Status: covered with follow-up
- Expected behavior: expandable region with correct naming, open/closed state, and content visibility semantics.
- Follow-up notes:
  - The header currently behaves like a pressable section trigger, but it does not yet expose stronger accordion semantics such as `aria-expanded` and a trigger/content relationship.
  - Need to verify whether collapsed content should expose a stable region/ID contract for linking the trigger to the panel in a later pass.
  - On web, the collapsed body currently still reads as visible to browser-level checks, so the visibility semantics likely need normalization in a later pass.

### color-picker
- Status: covered with follow-up
- Expected behavior: color selection flows and emitted value consistency.
- Follow-up notes:
  - The visible trigger is currently just the hex value button; consider whether it should expose a clearer accessible name such as “Choose color” plus the current value.
  - `ColorPicker` does not currently forward straightforward host targeting props such as `testID` on its outer wrapper, which makes direct E2E targeting harder than expected.
  - In this client-only Storybook pass, only the trigger/button contract is realistically testable; the native/system color picker UI itself remains outside the current browser harness.

### content
- Status: covered
- Expected behavior: layout wrapper only, width presets and padding behavior, no accidental accessibility role.
- Follow-up notes:
  - No obvious semantic gap so far.

### date-time-picker
- Status: covered with follow-up
- Expected behavior: date/time selection, label association, popup visibility and emitted value behavior.
- Follow-up notes:
  - The readonly text-input shell is straightforward, but the opened picker surface does not yet expose a clearly documented accessibility contract on web.
  - Only parts of the opened web picker currently expose stable test IDs (`calendarTestID`); the overall popup/time list targeting contract is still inconsistent for E2E.
  - The wrapped input shell is not currently discoverable by `getByLabelText()` in this Storybook setup, so label semantics still need work here.
  - Opening the time-mode picker is currently unstable in this Storybook web harness and drops into the generic Storybook error shell; revisit in a later debugging pass.

### dialogs
- Status: covered with follow-up
- Expected behavior: alert/confirm/prompt lifecycle, provider mounting stability, action button naming.
- Follow-up notes:
  - `prompt()` currently renders a textbox with no obvious accessible name, so browser/E2E usage falls back to generic `getByRole('textbox')` instead of a natural label query.
  - The current audit pass exercises sequential helper usage in one mounted provider, but not the earlier route-remount regression directly; keep that regression protected elsewhere.

### div
- Status: covered with follow-up
- Expected behavior: generic layout primitive, button semantics only when interactive, safe composition on web.
- Follow-up notes:
  - Keep watching for composition edge cases around deferred web `role="button"` assignment.

### divider
- Status: covered with follow-up
- Expected behavior: presentational separator with correct orientation and no accidental focusability.
- Follow-up notes:
  - Natural web expectation is `role="separator"` plus orientation metadata.
  - Current implementation appears purely visual; likely accessibility follow-up needed.
  - Consider allowing standard host props such as `testID` so this low-level primitive can be inspected without wrapper indirection.

### draggable
- Status: covered with follow-up
- Expected behavior: drag/drop state and ordering feedback, no broken keyboard/pointer interaction.
- Follow-up notes:
  - The board structure renders clearly, but the natural expectation is real pointer drag coverage and a documented keyboard-accessibility stance; the current Storybook web pass does not yet prove either.
  - Draggable items and drop zones do not expose a stronger semantic drag/drop contract on web, so natural E2E targeting still depends on descendant content and custom status text.

### drawer
- Status: covered with follow-up
- Expected behavior: open/close lifecycle, overlay dismissal, focus-safe presentation.
- Follow-up notes:
  - The drawer surface does not currently expose a clear built-in dialog semantics contract on web (`role="dialog"`, naming, `aria-modal`).
  - Overlay dismissal works behaviorally, but the overlay has no straightforward semantic/testable surface, which makes natural E2E targeting harder than expected.
  - The implementation still relies on `TouchableWithoutFeedback`, which now emits a deprecation warning in the Storybook web harness.

### drawer-sidebar
- Status: covered with follow-up
- Expected behavior: drawer/sidebar composition and dismissal behavior.
- Follow-up notes:
  - Closed sidebar content is still present/discoverable in the current web output, so hidden-state semantics need normalization.
  - The opened sidebar does not yet expose a clear built-in navigation/dialog landmark contract on web, so semantic targeting still depends on descendant text.
  - The current surface is behaviorally testable, but there is no straightforward named host element for the sidebar itself.

### dropdown
- Status: covered with follow-up
- Expected behavior: trigger semantics, popup behavior, option selection and dismissal.
- Follow-up notes:
  - The current trigger is not discoverable as a `button` on web, so the natural `getByRole('button', { name })` query path does not work yet.
  - `Dropdown.Caption variant='button'` is wrapped by another pressable trigger, which likely creates nested interactive hosts on web.
  - Popup/item semantics are still not clearly normalized to a standard menu/listbox contract; current usage is reachable, but the semantic role model needs a later pass.
  - Disabled options should keep blocking selection, but their disabled semantics on web still need a deliberate audit.

### file-input
- Status: covered with follow-up
- Expected behavior: upload flow, clear/reselect behavior, accessible trigger naming.
- Follow-up notes:
  - In the current client-only docs/Storybook setup, only do a surface-level audit and surface-level interaction coverage.
  - Defer real upload lifecycle testing, server integration, and file persistence checks to a later pass with a running backend.
  - The current web Storybook path resolves the non-Expo fallback and throws before `<FileInput />` can render, so even surface-level web coverage is blocked until that package-resolution/runtime issue is addressed.
  - Once that runtime path is fixed, the first natural expectation to re-enable is a visible upload/change trigger with a stable accessible name rather than only low-level imperative methods.

### flat-list
- Status: covered
- Expected behavior: stable rendering wrapper and basic list item behavior.
- Follow-up notes:
  - Wrapper-level audit looks fine; richer row semantics belong to the separate `item` audit.

### form
- Status: covered with follow-up
- Expected behavior: schema-driven rendering, label propagation, validation visibility.
- Follow-up notes:
  - The natural expectation is that generated field labels work uniformly across all field types, but the form inherits the existing weaker semantics of some underlying inputs such as number/composite controls.
  - Validation visibility can be exercised, but the fully ergonomic “all generated controls are naturally discoverable by label” contract still needs another pass through the underlying input stack.
  - In the current web Storybook pass, `validate` does not surface a clear visible required-field error message for the empty required field on mount, even though that is the natural expectation.

### icon
- Status: covered with follow-up
- Expected behavior: decorative/presentational by default, non-interactive, wrapper components own button semantics.
- Follow-up notes:
  - Likely no direct interactivity should be added; `Button`/wrapper controls should remain the interactive surface.
  - Consider whether decorative icons should be explicitly hidden from accessibility on web by default.

### input
- Status: covered with follow-up
- Expected behavior: wrapper-level label/description/error relationships across input types.
- Follow-up notes:
  - The wrapper-level text-field semantics are in decent shape, but the universal promise still weakens when `Input` delegates to some composite inputs such as number/select-style controls.
  - Required-state and error-state semantics are present, but the cross-type guarantee that every generated field is naturally discoverable by label still needs the underlying input stack to be tightened further.

### item
- Status: covered with follow-up
- Expected behavior: row semantics as link or button depending on props, stable accessible naming.
- Follow-up notes:
  - Complex slotted rows are reachable as buttons, but their accessible name is the full assembled text from all slots rather than the simpler central-content name a first-time user might expect.

### layout
- Status: covered
- Expected behavior: safe-area/layout wrapper with no accidental semantics.
- Follow-up notes:
  - No obvious semantic gap from the current shell-level audit.

### link
- Status: covered with follow-up
- Expected behavior: real link semantics on web, readable accessible names, router-safe navigation.
- Follow-up notes:
  - On web, the ideal contract is a real anchor whenever possible; verify where the current implementation still relies on generic hosts with `role="link"` instead.
  - Button-wrapped links should preserve link semantics without collapsing into ambiguous button/link behavior.
  - Modified-click / new-tab behavior should stay as close as possible to native anchor expectations.

### loader
- Status: covered with follow-up
- Expected behavior: visible loading indicator, non-interactive, ideally exposed as a sensible loading/progress affordance.
- Follow-up notes:
  - Need to verify what semantics RN Web currently gives `ActivityIndicator`.
  - `hidesWhenStopped` appears to hide the spinner glyph rather than the outer progressbar wrapper; confirm whether that behavior is acceptable or should be normalized later.

### menu
- Status: covered with follow-up
- Expected behavior: menu/menuitem semantics, active state and keyboard targetability.
- Follow-up notes:
  - The current surface behaves like a styled list of links/buttons rather than exposing a clear `menu` / `menuitem` semantics contract.
  - Active state is visible, but there is no obvious semantic state like `aria-current`, `aria-selected`, or `menuitemradio`/`menuitemcheckbox` behavior.

### modal
- Status: covered with follow-up
- Expected behavior: dialog naming, modal state, actions, overlay dismissal.
- Follow-up notes:
  - The dialog surface itself is in good shape, but the backdrop still lacks a straightforward semantic/testable target for natural overlay-dismiss assertions.

### multi-select
- Status: covered with follow-up
- Expected behavior: named trigger, selected value lifecycle, max-count behavior, readonly/disabled discoverability, no nested interactive hosts.
- Follow-up notes:
  - Natural expectation is one discoverable trigger whose accessible name comes from the placeholder or selected tags, plus a popup/list contract that clearly exposes selectable options.
  - Readonly state still needs a stronger semantic contract on the trigger so a first-time user can tell it is intentionally non-interactive.
  - The current default tags are visual only, so chip removal is not directly discoverable without reopening the popup; that may still be acceptable, but it should be an explicit product decision rather than an accidental limitation.
  - Readonly mode currently renders raw stored values (`ada, grace`) instead of the visible option labels (`Ada Lovelace, Grace Hopper`), which is surprising for both users and E2E authors.
  - The popup surface still behaves more like a free-floating list of buttons than a clearly labeled multi-select/listbox contract.

### number-input
- Status: covered with follow-up
- Expected behavior: text/stepper interaction, label association, numeric value lifecycle.
- Follow-up notes:
  - The current web output is not discoverable by `getByLabelText()` even though the component accepts `label`, so wrapper-level label semantics still need work here.
  - The label/input contract is good at the wrapper level, but the increment/decrement controls still need a clearer accessible naming contract for natural role-based targeting.

### object-input
- Status: covered with follow-up
- Expected behavior: nested field rendering, label propagation, dependency visibility, readonly/disabled cascade, validation visibility.
- Follow-up notes:
  - Natural expectation is that each rendered child field remains discoverable by its own label even though the component is a higher-level wrapper.
  - Dependency-driven fields should disappear and reappear predictably; preserving hidden values is currently documented, but it still needs to feel explicit rather than surprising.
  - Wrapper-provided errors should be clearly visible next to the right field and should ideally remain tied to that field’s accessible description.
  - Text-backed nested fields are working in the current story, but number-field label discoverability is still weak enough that `Age` remains a deferred label-based expectation.
  - The current web Storybook run logs a real React hooks-order warning when the dependency-driven field is toggled, so the nested input composition path needs a deeper runtime audit.

### pagination
- Status: covered with follow-up
- Expected behavior: page actions, current page state, readable button/link naming.
- Follow-up notes:
  - The natural contract is page buttons with a clear current-page state (`aria-current`, `aria-selected`, or an equivalent documented pattern), but the current surface does not yet document or guarantee that.
  - The first/previous/next/last icon buttons need explicit accessible names such as “First page”, “Previous page”, “Next page”, and “Last page” instead of relying on unlabeled glyph buttons.

### password-input
- Status: covered with follow-up
- Expected behavior: text entry, reveal/hide toggle semantics, label association.
- Follow-up notes:
  - The wrapped field still is not discoverable by `getByLabelText()` on web even though the component exposes a visual `label`.
  - The label/input contract is the same as wrapped text input, but the visibility toggle still lacks a clear accessible naming contract such as “Show password” / “Hide password”.

### popover
- Status: covered with follow-up
- Expected behavior: anchor behavior, open/close lifecycle, dismissal, safe composition.
- Follow-up notes:
  - The anchor open/close behavior is straightforward, but the popup surface itself does not yet expose a clear dialog/menu semantics contract.
  - Outside-dismiss works behaviorally, but the dismiss overlay still has no straightforward semantic/testable target.
  - In the current Storybook web harness, opening the popover mounts popup content but the visible surface does not become reliably inspectable, so the web visibility contract still needs a dedicated follow-up pass.

### portal
- Status: covered with follow-up
- Expected behavior: stable out-of-tree rendering without visual or event regressions.
- Follow-up notes:
  - The lifecycle is straightforward, but there is no explicit named host or host-targeting contract for developers who need to inspect the portal destination directly in E2E/debugging.

### progress
- Status: covered with follow-up
- Expected behavior: progressbar semantics and value exposure.
- Follow-up notes:
  - The current surface is visually clear, but it does not yet expose an obvious `progressbar` role/value contract on web.
  - The circular progress branch currently logs an invalid DOM property warning for `transform-origin` on web.

### radio
- Status: covered with follow-up
- Expected behavior: radio group/item semantics, checked state, label association.
- Follow-up notes:
  - Individual radio items are reachable, but the natural higher-level contract is a named `radiogroup`/fieldset for each set of options; the current surface does not yet expose that clearly.
  - Repeated option names across groups still push tests toward array indexing because the groups themselves do not expose a strong semantic boundary.

### range-input
- Status: covered with follow-up
- Expected behavior: slider semantics, value updates, single/range mode behavior.
- Follow-up notes:
  - The natural expectation is a real `slider` contract with readable current values and keyboard-friendly handles, but the current web surface does not yet expose that clearly.
  - The Storybook web audit can currently confirm presence/layout, but not a strong semantic interaction model or even a straightforward stable host-targeting contract for the slider handles.

### rank
- Status: covered with follow-up
- Expected behavior: reorder semantics and emitted value stability.
- Follow-up notes:
  - The current reorder path is mainly exposed through unlabeled position selects plus a decorative drag handle; a first-time user would likely expect clearer move controls or a more explicit reorderable-list semantics contract.
  - The interactive list itself does not yet expose strong list/listitem or drag/drop semantics on web, so natural E2E targeting still depends on descendant text and position.

### rating
- Status: covered with follow-up
- Expected behavior: star selection semantics and readable current value behavior.
- Follow-up notes:
  - The natural expectation is a named set of star controls such as “Set rating to 4” or a clearer slider/radiogroup-style contract; the current star hit areas do not appear to expose that semantics explicitly.
  - The readonly branch is visually clear, but it does not yet expose a stronger semantic value contract beyond the visible number.

### scroll-view
- Status: covered
- Expected behavior: scrollable container behavior without semantic regressions.
- Follow-up notes:
  - No obvious wrapper-level gap from the current audit.

### select
- Status: covered with follow-up
- Expected behavior: label association, native web select semantics, typed value mapping.
- Follow-up notes:
  - The enabled wrapped path looks good, but a disabled wrapped select is no longer discoverable by `getByLabelText()` on web because the native control association disappears.
  - Low-level unlabeled standalone selects still require an explicit accessible name, which is acceptable but should stay documented.

### sidebar
- Status: covered with follow-up
- Expected behavior: open/close behavior and safe navigation composition.
- Follow-up notes:
  - The visual open/close contract is straightforward, but the sidebar itself does not yet expose a clear landmark or named host such as a `navigation` region.
  - Closed-state behavior is visually correct, but there is still no explicit documented semantic contract for whether closed sidebar content should remain mounted, hidden, or fully absent from accessibility APIs.

### smart-sidebar
- Status: covered with follow-up
- Expected behavior: responsive sidebar/drawer switching and stable interaction model.
- Follow-up notes:
  - Both branches are behaviorally reachable, but the component still does not expose a clear high-level landmark/dialog contract; consumers are left targeting descendant content.
  - The fixed and drawer branches should ideally present a more unified documented semantics contract so responsive switching does not change how they are targeted.
  - The drawer branch keeps its sidebar content mounted and visibly rendered before open in the current web output, so the closed-state contract is much weaker than a first-time user would likely expect.

### span
- Status: covered
- Expected behavior: plain text by default, heading semantics when `h1`-`h6` are used, no accidental focusability.
- Follow-up notes:
  - Heading semantics already look intentional; verify exact `role="heading"` and `aria-level`.
  - Ensure plain text stays non-interactive and does not gain unexpected roles.

### startupjs-ui
- Status: covered
- Expected behavior: meta-package export smoke coverage only.
- Follow-up notes:
  - No obvious smoke-level gap from the current top-level re-export story; the detailed semantics belong to the component-specific stories.

### table
- Status: covered with follow-up
- Expected behavior: table structure and cell/header semantics.
- Follow-up notes:
  - The natural web expectation is a real `table` / `row` / `columnheader` / `cell` semantics contract, but the current implementation is still generic container-based.
  - Ellipsis cells are behaviorally expandable, but they do not yet expose an obvious semantic affordance for that interactive state.

### tabs
- Status: covered with follow-up
- Expected behavior: tablist/tab/tabpanel semantics, active state, keyboard navigation.
- Follow-up notes:
  - The main tab role/state contract looks good in the current web audit.
  - The web path still logs a `props.pointerEvents` deprecation warning from the underlying tab bar stack and should be cleaned up in a later pass.

### tag
- Status: covered with follow-up
- Expected behavior: static tag by default, interactive wrapper/icon semantics when actions exist.
- Follow-up notes:
  - Icon-action affordances on tags do not currently expose clear independent button semantics or accessible names, so they are harder to target naturally than the main tag press surface.

### text-input
- Status: covered with follow-up
- Expected behavior: text entry, label/description/error wiring, icon action wrappers.
- Follow-up notes:
  - Low-level `TextInput` still relies on direct `aria-label` usage in practice; it does not provide the same natural label contract as wrapped `Input`.
  - Icon action wrappers still need a clearer accessible naming contract when they are interactive.
  - The current icon-wrapper path still logs the deprecated `props.pointerEvents` warning on web.

### toast
- Status: covered with follow-up
- Expected behavior: transient feedback visibility and sane announcement behavior.
- Follow-up notes:
  - Toast surfaces do not yet expose an explicit live-region role/announcement contract on web.
  - The close affordance is icon-only and currently lacks a clear accessible name.

### user
- Status: covered with follow-up
- Expected behavior: avatar/name layout and row semantics when pressable.
- Follow-up notes:
  - Pressable `User` rows still benefit from an explicit accessible name; otherwise the name is assembled from descendant text and status/layout details.
