import { describe, expect, it } from 'vitest';

import { EventBuffer } from './EventBuffer';

describe('EventBuffer', () => {
  it('starts empty', () => {
    const buf = new EventBuffer<number>();
    expect(buf.isEmpty()).toBe(true);
    expect(buf.length).toBe(0);
  });

  it('reports non-empty after put()', () => {
    const buf = new EventBuffer<number>();
    buf.put(1);
    expect(buf.isEmpty()).toBe(false);
    expect(buf.length).toBe(1);
  });

  it('take() returns items in FIFO order', () => {
    const buf = new EventBuffer<string>();
    buf.put('a');
    buf.put('b');
    buf.put('c');
    expect(buf.take()).toBe('a');
    expect(buf.take()).toBe('b');
    expect(buf.take()).toBe('c');
  });

  it('take() returns undefined and keeps length 0 on an empty buffer', () => {
    const buf = new EventBuffer<number>();
    expect(buf.take()).toBeUndefined();
    expect(buf.length).toBe(0);
  });

  it('flush() returns all items and empties the buffer', () => {
    const buf = new EventBuffer<number>();
    buf.put(1);
    buf.put(2);
    buf.put(3);
    expect(buf.flush()).toEqual([1, 2, 3]);
    expect(buf.isEmpty()).toBe(true);
    expect(buf.length).toBe(0);
  });

  it('flush() on empty buffer returns an empty array', () => {
    const buf = new EventBuffer<number>();
    expect(buf.flush()).toEqual([]);
  });

  it('keeps `length` in sync with `queue.length` across put/take/flush', () => {
    const buf = new EventBuffer<number>();
    buf.put(1);
    buf.put(2);
    expect(buf.length).toBe(2);
    buf.take();
    expect(buf.length).toBe(1);
    buf.flush();
    expect(buf.length).toBe(0);
  });
});
