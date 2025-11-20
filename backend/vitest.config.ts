import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
    },
  },
});
