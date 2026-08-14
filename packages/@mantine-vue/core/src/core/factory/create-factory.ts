import type { FactoryPayload, PolymorphicFactoryPayload } from './factory-payload'

export type Factory<Payload extends FactoryPayload> = Payload
export type PolymorphicFactory<Payload extends PolymorphicFactoryPayload> = Payload
