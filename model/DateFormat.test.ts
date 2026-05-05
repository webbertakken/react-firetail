import { describe, expect, it } from 'vitest';

import { DateFormat } from './DateFormat';

describe('DateFormat.simpleTimeIn24HourFormat', () => {
  it('formats a Date instance as HH:mm', () => {
    const date = new Date('2024-01-15T14:30:00');
    expect(DateFormat.simpleTimeIn24HourFormat(date)).toBe('14:30');
  });

  it('formats a numeric timestamp as HH:mm', () => {
    const timestamp = new Date('2024-01-15T09:05:00').getTime();
    expect(DateFormat.simpleTimeIn24HourFormat(timestamp)).toBe('09:05');
  });

  it('zero-pads single-digit hours', () => {
    expect(DateFormat.simpleTimeIn24HourFormat(new Date('2024-01-15T03:30:00'))).toBe('03:30');
  });

  it('zero-pads single-digit minutes', () => {
    expect(DateFormat.simpleTimeIn24HourFormat(new Date('2024-01-15T14:05:00'))).toBe('14:05');
  });

  it('renders midnight as 00:00', () => {
    expect(DateFormat.simpleTimeIn24HourFormat(new Date('2024-01-15T00:00:00'))).toBe('00:00');
  });

  it('renders 23:59 correctly', () => {
    expect(DateFormat.simpleTimeIn24HourFormat(new Date('2024-01-15T23:59:00'))).toBe('23:59');
  });
});
