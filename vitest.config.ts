import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        globals: true,

        environment: 'jsdom',

        include: ['src/{app,common,components}/**/*.test.{ts,tsx}'],
        exclude: [
            'src/components/ui/**/*',
            'src/components/theme-provider.tsx',
        ],

        clearMocks: true,
        restoreMocks: true,

        setupFiles: ['test/vitest.setup.ts'],

        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage/vitest',
            reporter: ['text', 'html', 'lcov'],

            include: ['src/{app,common,components}/**/*.{ts,tsx}'],
            exclude: [
                'src/app/**/{layout,page}.tsx',
                'src/components/ui/**/*',
                'src/components/theme-provider.tsx',
            ],
        },
    },
});
