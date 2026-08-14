<script setup lang="ts">
import { defineComponent } from 'vue'
import {
  ActionIcon,
  Anchor,
  Avatar,
  BackgroundImage,
  Badge,
  Card,
  Center,
  ColorSwatch,
  Flex,
  Image,
  NavLink,
  Overlay,
  UnstyledButton,
} from '@mantine-vue/core'

/**
 * Template coverage for the migrated polymorphic components. Requires `strictTemplates`.
 */

const RouterLink = defineComponent({ props: { to: { type: String, required: true } } })
</script>

<template>
  <!-- Default roots -->
  <ActionIcon type="submit" variant="light">+</ActionIcon>
  <UnstyledButton type="button">Click</UnstyledButton>
  <Anchor href="/docs" target="_blank">Docs</Anchor>
  <NavLink href="/docs" label="Docs" />
  <Overlay :backgroundOpacity="0.6" />
  <Flex gap="md" wrap="nowrap">Row</Flex>
  <Center :inline="true">Centered</Center>
  <Badge variant="light" radius="sm">New</Badge>
  <Card padding="lg" :withBorder="true">Body</Card>
  <Avatar size="lg" radius="xl" />
  <BackgroundImage src="/img.png">Caption</BackgroundImage>
  <ColorSwatch color="red" />
  <Image src="/img.png" alt="An image" />

  <!-- Intrinsic polymorphism -->
  <ActionIcon component="a" href="/docs" target="_blank">+</ActionIcon>
  <Badge component="a" href="/docs">Link badge</Badge>
  <Card component="a" href="/docs">Link card</Card>
  <ColorSwatch component="button" type="button" color="red" />
  <Center component="section">Section</Center>

  <!-- Custom component roots -->
  <Avatar :component="RouterLink" to="/profile" />
  <Anchor :component="RouterLink" to="/docs">Docs</Anchor>

  <!-- Compound statics -->
  <ActionIcon.Group>
    <ActionIcon>1</ActionIcon>
  </ActionIcon.Group>
  <Avatar.Group>
    <Avatar />
  </Avatar.Group>
  <Card>
    <Card.Section>Section</Card.Section>
  </Card>

  <!-- @vue-expect-error Overlay defaults to a div root, which has no href -->
  <Overlay href="/nope" />

  <!-- @vue-expect-error `wrap` only accepts flex-wrap values -->
  <Flex wrap="sideways" />

  <!-- @vue-expect-error `backgroundOpacity` is a number -->
  <Overlay backgroundOpacity="lots" />

  <!-- @vue-expect-error required `to` is missing from the RouterLink root -->
  <Avatar :component="RouterLink" />

  <!-- @vue-expect-error `href` is not valid on the default button root -->
  <UnstyledButton href="/nope" />

  <!-- @vue-expect-error unknown attribute -->
  <Center bogusAttr="x" />

  <!-- @vue-expect-error `alt` must be a string -->
  <Image src="/img.png" :alt="123" />

  <!-- @vue-expect-error `padding` does not accept an arbitrary object -->
  <Card :padding="{ base: true }" />
</template>
