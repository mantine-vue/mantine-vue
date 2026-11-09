---
name: mantine-vue-form
description: Build and validate Vue 3 forms with @mantine-vue/form, including nested fields, lists, schema validation, submit handling, and reusable form context.
---

# Mantine Vue Form

Use the installed Mantine Vue version's docs or MCP API as the source of truth. Implement with Vue 3
Composition API and `<script setup>`.

## Workflow

1. Model the values and validation rules before rendering fields.
2. Create the form with `useForm` from `@mantine-vue/form`. Use `initialValues`, field validation, or
   `zodResolver`/`schemaResolver` as appropriate.
3. Bind Mantine Vue inputs using the current `form.getInputProps(...)` contract from the docs. Do not
   translate React spread-prop examples literally into templates.
4. Submit through the form's submit handler, surface server failures without losing user input, and
   disable or mark the submit action while an asynchronous request is active.
5. Use path-based helpers for nested objects and lists. Use stable keys for repeated Vue template
   rows, not the array index when rows can be reordered or removed.

Use `createFormContext` when distant components intentionally share one form. Keep a local form for
ordinary forms. Use `useField` for isolated fields that do not need a whole form object.

Preserve accessible labels, descriptions, errors, required state, and focus behavior. Validate the
initial state, one invalid submission, corrections, successful submission, and list add/remove behavior.
