<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { Button } from '@mantine-vue/core'

/**
 * Template type tests for the polymorphic factory. Requires `strictTemplates`, without which
 * Vue permits any fallthrough attribute and every negative below would pass silently.
 * `@vue-expect-error` behaves like `@ts-expect-error`, so these negatives cannot rot.
 */

const RouterLink = defineComponent({
  props: {
    to: { type: String, required: true },
    replace: { type: Boolean, default: false },
  },
})

const buttonElement = ref<HTMLButtonElement | null>(null)
const anchorElement = ref<HTMLAnchorElement | null>(null)

const onClick = (event: MouseEvent) => event.preventDefault()

const LinkButton = Button.withProps({ component: RouterLink, variant: 'subtle', to: '/docs' })
const AnchorButton = Button.withProps({ component: 'a', variant: 'subtle' })
</script>

<template>
  <!-- Default root: native button attributes, Mantine props and style props -->
  <Button type="submit" :disabled="true" variant="filled" mt="md" bg="red.5" @click="onClick">
    Default root
  </Button>

  <!-- Reserved props stay usable on every root -->
  <Button ref="anyRef" class="custom" :style="{ color: 'red' }">Reserved props</Button>

  <!-- Typed rootRef: callback form, because templates unwrap refs -->
  <Button :rootRef="(node: Element | null) => (buttonElement = node as HTMLButtonElement | null)">
    Root ref
  </Button>

  <!-- Intrinsic polymorphism: anchor attributes are inferred from `component` -->
  <Button
    component="a"
    href="/docs"
    target="_blank"
    rel="noreferrer"
    :rootRef="(node: Element | null) => (anchorElement = node as HTMLAnchorElement | null)"
  >
    Documentation
  </Button>

  <!-- Custom Vue component root contributes its declared props -->
  <Button :component="RouterLink" to="/docs" :replace="true">Documentation</Button>

  <!-- Slots stay typed after factory wrapping -->
  <Button>
    <template #leftSection>Left</template>
    Label
    <template #rightSection>Right</template>
  </Button>

  <!-- Compound components remain available and typed -->
  <Button.Group :grow="true">
    <Button>One</Button>
    <Button>Two</Button>
  </Button.Group>

  <!-- withProps keeps polymorphic inference -->
  <LinkButton to="/docs" />
  <AnchorButton href="/docs" target="_blank" />

  <!-- @vue-expect-error `nope` is not a Button variant -->
  <Button variant="nope" />

  <!-- @vue-expect-error `fullWidth` is a boolean -->
  <Button :fullWidth="'yes'" />

  <!-- @vue-expect-error `href` is not an attribute of the default `button` root -->
  <Button href="/nope" />

  <!-- @vue-expect-error `target` belongs to an anchor, not a button -->
  <Button target="_blank" />

  <!-- @vue-expect-error unknown attribute -->
  <Button bogusAttr="x" />

  <!-- @vue-expect-error `mt` does not accept an arbitrary object -->
  <Button :mt="{ bad: true }" />

  <!-- @vue-expect-error `href` must be a string -->
  <Button component="a" :href="123" />

  <!-- @vue-expect-error required `to` is missing from the RouterLink root -->
  <Button :component="RouterLink" />

  <!-- @vue-expect-error `to` is not an anchor attribute -->
  <Button component="a" :to="1" />

  <!-- @vue-expect-error `grow` is a boolean -->
  <Button.Group :grow="'x'" />

  <!-- @vue-expect-error templates unwrap refs, so the ref object cannot be bound directly -->
  <Button :rootRef="buttonElement" />

  <!-- @vue-expect-error `to` is not a prop of the anchor-rooted component -->
  <AnchorButton to="/docs" />

  <!-- @vue-expect-error `to` must be a string on the RouterLink-rooted component -->
  <LinkButton :to="123" />

  <Button>
    <!-- @vue-expect-error unknown slot -->
    <template #notASlot>x</template>
  </Button>
</template>
