import { render, screen } from '@testing-library/react';

import i18nProvider from '@test/i18nProvider';
import { routerMock } from '@test/mocks/navigation';

import NavigationMenuComponent from './navigationMenu';

vi.mock('@/i18n/navigation', async () => ({
    ...(await vi.importActual<typeof import('@/i18n/navigation')>(
        '@/i18n/navigation',
    )),
    useRouter: () => routerMock,
}));

describe('NavigationMenuComponent', () => {
    it('should render the navigation menu with login link when not authenticated', () => {
        // arrange
        const isAuthenticated = false;

        // act
        render(<NavigationMenuComponent isAuthenticated={isAuthenticated} />, {
            wrapper: i18nProvider,
        });

        // assert
        expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('should render the navigation menu with logout link when authenticated', () => {
        // arrange
        const isAuthenticated = true;

        // act
        render(<NavigationMenuComponent isAuthenticated={isAuthenticated} />, {
            wrapper: i18nProvider,
        });

        // assert
        expect(screen.getByText('Log Out')).toBeInTheDocument();
    });
});
