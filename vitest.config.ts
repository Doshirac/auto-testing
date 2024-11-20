import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
      dir: './tests/unit',
      coverage: {
        include: ['src/*.ts'],
        provider: 'v8'
      },
    },
})