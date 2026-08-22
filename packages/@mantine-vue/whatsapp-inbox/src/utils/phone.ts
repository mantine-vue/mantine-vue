/**
 * Phone number handling for starting a conversation with a number that is not in the list yet.
 *
 * Deliberately permissive: the authoritative check is whichever provider the consumer uses, and
 * a frontend that guessed at national formats would reject numbers the backend accepts. All this
 * does is catch obvious typos before the payload is emitted.
 */

/** Digits only, keeping a leading `+`. Handy as a lookup key for an existing conversation. */
export function normalizePhoneNumber(value: string): string {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')

  if (digits.length === 0) {
    return ''
  }

  return trimmed.startsWith('+') ? `+${digits}` : digits
}

/**
 * Shortest and longest number the default validation accepts.
 *
 * E.164 allows up to 15 digits; the lower bound is loose enough for short codes.
 */
export const MIN_PHONE_NUMBER_DIGITS = 6
export const MAX_PHONE_NUMBER_DIGITS = 15

/** Whether a number is plausible enough to send to the backend. */
export function isValidPhoneNumber(value: string): boolean {
  const digits = normalizePhoneNumber(value).replace(/\D/g, '')

  return digits.length >= MIN_PHONE_NUMBER_DIGITS && digits.length <= MAX_PHONE_NUMBER_DIGITS
}
