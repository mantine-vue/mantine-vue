# Mantine Vue — Component Showcase

A kitchen-sink demo application that showcases **every** implemented Mantine Vue
component in one place, organized into logical sections with realistic usage
examples. It doubles as a visual gallery for people exploring the library and a
practical API reference for developers learning the components.

## What's inside

Components are grouped into thirteen sections, mirroring the categories used
across the Mantine ecosystem:

| Section           | Highlights                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Inputs            | TextInput, Select, MultiSelect, Checkbox, Radio, Switch, Slider, ColorInput, PinInput, Rating, TreeSelect…                |
| Buttons & Actions | Button, ActionIcon, CopyButton, FileButton, CloseButton, UnstyledButton                                                   |
| Navigation        | Tabs, Stepper, NavLink, Breadcrumbs, Pagination, Burger, Tree, TableOfContents                                            |
| Data Display      | Card, Accordion, Table, Avatar, Badge, Timeline, List, Kbd, Image, NumberFormatter, RollingNumber…                        |
| Feedback          | Alert, Notification, Progress, RingProgress, Loader, LoadingOverlay, Skeleton                                             |
| Overlays          | Modal, Drawer, Dialog, Menu, Popover, HoverCard, Tooltip, Overlay, Affix, Spotlight, imperative Notifications & Modals    |
| Layout            | AppShell, Grid, SimpleGrid, Group, Stack, Flex, Container, Paper, ScrollArea, Collapse, Splitter…                         |
| Typography        | Title, Text, Anchor, Highlight, Mark, Code, Blockquote, Typography                                                        |
| Combobox          | The low-level `useCombobox` primitive                                                                                     |
| Dates & Calendar  | DateInput, DatePicker, DateTimePicker, MonthPicker, YearPicker, TimeInput, MiniCalendar (`@mantine-vue/dates`)            |
| Charts            | Area, Bar, Line, Composite, Pie, Donut, Radar, Scatter, Sparkline… (`@mantine-vue/charts`)                                |
| Rich Content      | RichTextEditor, CodeHighlight, Carousel, Dropzone                                                                         |
| Utilities         | Marquee, Scroller, OverflowList, FloatingIndicator, FloatingWindow, FocusTrap, Portal, VisuallyHidden, NavigationProgress |

Every example uses the same public APIs as the React Mantine library, expressed
with idiomatic Vue (SFC templates, `v-model`, slots and `h()` for icon
sections).

## Running it

From the monorepo root:

```bash
yarn install        # once, to link the workspace
yarn showcase       # starts the dev server (http://127.0.0.1:4180)
```

Or directly:

```bash
yarn workspace @mantine-vue/showcase dev
```

The app imports each package straight from its `src` (via Vite aliases), so no
package build step is required for local development.

## How it's structured

```
src/
  main.ts                 # providers: Direction / Mantine / Modals + global styles
  App.vue                 # AppShell layout, sidebar nav, color-scheme toggle
  sections.ts             # section registry (label, icon, component, count)
  components/DemoCard.vue  # reusable "titled demo" wrapper
  sections/*.vue          # one file per category, each rendering its components
```

To add a new component demo, drop a `<DemoCard>` into the relevant section file.
