import { useState } from 'react';

/**
 * Returns the value `value` held before it last changed, or `undefined` until it first changes.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [tracked, setTracked] = useState<{ current: T; previous?: T }>({ current: value });

  if (!Object.is(tracked.current, value)) {
    setTracked({ current: value, previous: tracked.current });
  }

  return tracked.previous;
}
