import { render, screen } from '@testing-library/react';

import NavigationMenuComponent from './navigationMenu';

describe('NavigationMenuComponent', () => {
    it('should render the navigation menu with login link when not authenticated', () => {
        // arrange
        const isAuthenticated = false;

        // act
        render(<NavigationMenuComponent isAuthenticated={isAuthenticated} />);

        // assert
        expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('should render the navigation menu with logout link when authenticated', () => {
        // arrange
        const isAuthenticated = true;

        // act
        render(<NavigationMenuComponent isAuthenticated={isAuthenticated} />);

        // assert
        expect(screen.getByText('Log Out')).toBeInTheDocument();
    });
});
