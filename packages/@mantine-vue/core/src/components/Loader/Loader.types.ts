import type { Component } from 'vue'

export type MantineLoader = 'bars' | 'oval' | 'dots' | (string & {})
export type MantineLoaderComponent = Component
export type MantineLoadersRecord = Record<string, MantineLoaderComponent>
