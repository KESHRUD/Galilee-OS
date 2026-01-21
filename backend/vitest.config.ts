import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      // ✅ Fix reflect-metadata import for TypeORM
      'reflect-metadata': 'reflect-metadata',
    },
  },
});
