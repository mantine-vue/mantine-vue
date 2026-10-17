import { ApiError } from '../contracts'

export interface MockNetworkOptions {
  /** Fixed latency or `[min, max]` range in milliseconds. */
  latency?: number | [number, number]
  /** Probability (0–1) that a request fails with a network error. Read on every request. */
  failureRate?: () => number
  random?: () => number
}

export type MockNetwork = <T>(operation: () => T | Promise<T>) => Promise<T>

/**
 * Wraps mock operations so they behave like real HTTP calls: they are always
 * asynchronous, take a realistic amount of time and can fail.
 */
export function createMockNetwork({
  latency = [250, 700],
  failureRate = () => 0,
  random = Math.random,
}: MockNetworkOptions = {}): MockNetwork {
  return async (operation) => {
    const ms = Array.isArray(latency)
      ? Math.round(latency[0] + random() * (latency[1] - latency[0]))
      : latency

    await new Promise((resolve) =>
      ms > 0 ? setTimeout(resolve, ms) : queueMicrotask(() => resolve(undefined)),
    )

    if (random() < failureRate()) {
      throw new ApiError('network', 'The request could not be completed. Please try again.')
    }

    return structuredCloneSafe(await operation())
  }
}

/** Returns a deep copy so callers can never mutate the mock database by accident. */
function structuredCloneSafe<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== 'object') {
    return value
  }
  return JSON.parse(JSON.stringify(value)) as T
}
