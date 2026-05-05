import { defineConfig } from 'vitest/config';

// Pure-JS tests for the model utilities. The hooks/ and ui/ trees require
// react + reactfire + tailwind runtime, which is intentionally out of
// scope here; consumers exercise those at integration time in their own
// apps.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['model/**/*.test.ts', 'utils/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov'],
      include: ['model/**/*.ts', 'utils/**/*.ts'],
      exclude: ['**/*.test.ts'],
    },
  },
});
