# @mantine-vue/contextmenu

Context menu extension for Mantine Vue, ported from
[mantine-contextmenu](https://github.com/icflorescu/mantine-contextmenu).

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/contextmenu/styles.css'

import { ContextMenuProvider, useContextMenu } from '@mantine-vue/contextmenu'
```

Place `ContextMenuProvider` inside `MantineProvider`, then use the handler returned by
`showContextMenu` with Vue's `onContextmenu`/`@contextmenu` event.
