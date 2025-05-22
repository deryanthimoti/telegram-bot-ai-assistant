export function formatPrice(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1) {
    return value.toFixed(2);
  } else if (value > 0) {
    // Use exponential notation for very small numbers
    return value.toExponential(2);
  } else if (value === 0) {
    return '0';
  } else {
    // Handle negative values similarly
    return `-${formatPrice(Math.abs(value))}`;
  }
}

export function multiSort<T>(
  array: T[],
  priorities: { key: keyof T; direction: 'asc' | 'desc' }[]
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction } of priorities) {
      const aVal = a[key] as unknown as number;
      const bVal = b[key] as unknown as number;
      const diff = aVal - bVal;

      if (diff !== 0) {
        return direction === 'asc' ? diff : -diff;
      }
    }
    return 0;
  });
}
