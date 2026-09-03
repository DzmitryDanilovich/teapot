import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';

import { authClient } from '@/lib/auth-client';
import i18nProvider from '@test/i18nProvider';

import GoogleAuth from './googleAuth';

vi.mock('@/lib/auth-client', () => ({
    authClient: {
        signIn: {
            social: vi.fn(),
        },
    },
}));

const mockSignInSocial = vi.mocked(authClient.signIn.social);

describe('GoogleAuth', () => {
    it('should render the GoogleAuth component', () => {
        // act
        render(<GoogleAuth />, { wrapper: i18nProvider });

        // assert
        expect(screen.getByText('Log in with Google')).toBeInTheDocument();
    });

    it.each([
        {
            inputMessage: '',
            expectedMessage: 'An error occurred during Google login',
        },
        { inputMessage: 'Test error', expectedMessage: 'Test error' },
    ])(
        'should render the GoogleAuth component with error message: $inputMessage',
        async ({ inputMessage, expectedMessage }) => {
            // arrange
            mockSignInSocial.mockResolvedValueOnce({
                error: {
                    message: inputMessage,
                },
            });

            // act
            render(<GoogleAuth />, { wrapper: i18nProvider });
            const button = screen.getByRole('button');
            await userEvent.click(button);

            // assert
            expect(
                await screen.findByText(expectedMessage),
            ).toBeInTheDocument();
        },
    );

    it('should disable the button while pending', async () => {
        // arrange
        let resolvePromise: (value: { error: null }) => void;
        const pendingPromise = new Promise<{ error: null }>((resolve) => {
            resolvePromise = resolve;
        });
        mockSignInSocial.mockReturnValueOnce(pendingPromise as any);
        onTestFinished(() => {
            resolvePromise({ error: null });
        });

        // act
        render(<GoogleAuth />, { wrapper: i18nProvider });

        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should re-enable the button after pending', async () => {
        // arrange
        mockSignInSocial.mockResolvedValueOnce({});

        // act
        render(<GoogleAuth />, { wrapper: i18nProvider });

        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(screen.getByRole('button')).toBeEnabled();
    });

    it('should call auth client with correct parameters', async () => {
        // arrange
        mockSignInSocial.mockResolvedValueOnce({});

        // act
        render(<GoogleAuth />, { wrapper: i18nProvider });
        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(mockSignInSocial).toHaveBeenCalledWith({
            provider: 'google',
            callbackURL: '/',
        });
    });
});
