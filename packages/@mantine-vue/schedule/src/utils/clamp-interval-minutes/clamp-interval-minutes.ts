/**
 * Clamps interval minutes to a value that keeps the time grid consistent:
 *
 * - Values of 60 or less must divide evenly into an hour.
 * - Values above an hour must be a whole number of hours.
 *
 * Invalid values fall back to 60 and the result is capped to one day.
 */
export function clampIntervalMinutes(intervalMinutes: number): number {
  const rounded = Math.round(Math.max(1, Math.min(1440, intervalMinutes)))

  if (rounded <= 60) {
    return 60 % rounded === 0 ? rounded : 60
  }

  return rounded % 60 === 0 ? rounded : 60
}
