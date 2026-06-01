import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
    auth: vi.fn(),
}));

const mockAuth = vi.mocked(auth);

vi.mock('better-auth/next-js', () => ({
    toNextJsHandler: vi.fn().mockReturnValue({ GET: vi.fn(), POST: vi.fn() }),
}));

const mockToNextJsHandler = vi.mocked(toNextJsHandler);

describe('auth API route', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('should use auth API handler', async () => {
        // act
        await import('./route');

        // assert
        expect(mockToNextJsHandler).toHaveBeenCalledWith(mockAuth);
    });
});
