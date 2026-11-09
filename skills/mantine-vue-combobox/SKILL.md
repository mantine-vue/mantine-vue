---
name: mantine-vue-combobox
description: Build accessible custom Vue 3 selects, autocomplete fields, and multiselects with Mantine Vue Combobox. Use when a task needs behavior beyond the packaged Select, MultiSelect, or Autocomplete components.
---

# Mantine Vue Combobox

Check the current Combobox documentation or the Mantine Vue MCP server before implementation. Prefer
the packaged input when it already covers the requested behavior; use `Combobox` for custom rendering,
filtering, or selection models.

## Vue invariants

- Import `Combobox`, `useCombobox`, and input primitives from `@mantine-vue/core`.
- Keep values and search text in Vue `ref`/`computed` state inside `<script setup>`.
- Pass the store with `:store="combobox"`; use Vue listeners such as `@option-submit`, `@click`, and
  `@update:model-value`.
- Use `Combobox.Target` for a single focusable target. Use `Combobox.EventsTarget` and
  `Combobox.DropdownTarget` only when event and positioning targets differ.
- Render options inside `Combobox.Options`; give each `Combobox.Option` a stable string `value` and
  use `:active` for the committed value.
- When filtering changes the option list, call `combobox.updateSelectedOptionIndex()` after the DOM
  update. Reset selection when closing searchable dropdowns.
- Preserve keyboard behavior, focus return, disabled options, empty states, and ARIA attributes
  supplied by Combobox. Do not replace them with click-only divs.

For remote data, separate loading, empty, and error states and ignore stale responses. For multi-select,
keep selected values separate from the current search query and prevent duplicate values.

Validate with keyboard-only interaction: open, arrow through enabled items, select, escape, reopen, and
filter to an empty list.
