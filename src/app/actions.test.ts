import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

import { logOffAction } from './actions';

const { mockHeaders } = vi.hoisted(() => ({
    mockHeaders: { 'x-test-header': 'test-value' },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(mockHeaders),
}));

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

describe('logOffAction', () => {
    it('should call pass headers to the signOut function', async () => {
        // arrange
        vi.spyOn(auth.api, 'signOut').mockResolvedValueOnce({} as any);

        // act
        await logOffAction();

        // assert
        expect(auth.api.signOut).toHaveBeenCalledWith({ headers: mockHeaders });
    });

    it('should return an error message if sign out fails', async () => {
        // arrange
        const mockError = new Error('Sign out failed');
        vi.spyOn(auth.api, 'signOut').mockRejectedValueOnce(mockError);

        // act
        const result = await logOffAction();

        // assert
        expect(result).toEqual({ error: 'Sign out failed' });
    });

    it('should return default message if sign out fails', async () => {
        // arrange
        const mockError = new Error();
        vi.spyOn(auth.api, 'signOut').mockRejectedValueOnce(mockError);

        // act
        const result = await logOffAction();

        // assert
        expect(result).toEqual({
            error: 'An error occurred during log off',
        });
    });

    it('should redirect to /login on successful sign out', async () => {
        // arrange
        vi.spyOn(auth.api, 'signOut').mockResolvedValueOnce({} as any);

        // act
        await logOffAction();

        // assert
        expect(redirect).toHaveBeenCalledWith('/login');
    });
});
