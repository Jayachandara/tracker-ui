export const currencyFormat = (amount: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'inr',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
    notation: 'standard',
    ...options,
  }).format(amount);
};

// fast-format-date.ts

// Cached formatters — create once per module (cheap to reuse)
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
});

/**
 * Format ISO string as:
 * - "Today, 6:25 PM"  (if date is today in local timezone)
 * - "25 Dec, 6:25 PM" (otherwise)
 *
 * Optimized for speed & low memory:
 * - reuses Intl.DateTimeFormat instances
 * - minimal allocations per call
 */
export const formatDateTime = (isoString: string): string => {
  // Fast invalid input guard
  const date = new Date(isoString);
  const t = date.getTime();
  if (!Number.isFinite(t)) return isoString; // or return '' based on your preference

  // Use a single `now` value (numeric) and create one Date for today
  const now = Date.now();
  const today = new Date(now);

  // Compare date portions (local timezone)
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    // "Today, 6:25 PM"
    return `Today, ${timeFormatter.format(date)}`;
  }

  // "25 Dec, 6:25 PM"
  return `${shortDateFormatter.format(date)}, ${timeFormatter.format(date)}`;
};

