import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { onTestFinished } from 'vitest';

import i18nProvider from '@test/i18nProvider';

import { logOffAction } from './actions';
import LogOutButton from './logOutButton';

vi.mock('./actions', () => ({
    logOffAction: vi.fn(),
}));

const mockLogOff = vi.mocked(logOffAction);

describe('LogOutButton', () => {
    it('should render the button', () => {
        // act
        render(<LogOutButton />, { wrapper: i18nProvider });

        // assert
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should disable the button when pending', async () => {
        // arrange
        const deferred = Promise.withResolvers<{ error: string }>();
        mockLogOff.mockReturnValue(deferred.promise);
        onTestFinished(() => {
            deferred.resolve({ error: '' });
        });

        // act
        render(<LogOutButton />, { wrapper: i18nProvider });
        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(button).toBeDisabled(); // mid-flight
    });

    it('should show error message', async () => {
        // arrange
        const state = Promise.resolve<{ error: string }>({
            error: 'Failed to log out',
        });
        mockLogOff.mockReturnValue(state);

        // act
        render(<LogOutButton />, { wrapper: i18nProvider });
        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(
            await screen.findByText('Failed to log out'),
        ).toBeInTheDocument();
    });
});
