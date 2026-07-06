import { execSync } from 'node:child_process';

const globalSetup = () => {
    if (!process.env.DATABASE_URL?.endsWith('5433/teapot')) {
        throw new Error('DATABASE_URL does not point to the test database.');
    }

    execSync('pnpm prisma migrate reset --force', { stdio: 'inherit' });
};

export default globalSetup;
