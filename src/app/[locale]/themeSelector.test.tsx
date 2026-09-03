import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18nProvider from '@test/i18nProvider';

import ThemeSelector from './themeSelector';

let resolvedTheme = 'light';
const setTheme = vi.fn();

vi.mock('next-themes', () => ({
    useTheme: () => ({
        resolvedTheme,
        setTheme,
    }),
}));

describe('ThemeSelector', () => {
    it('should render the ThemeSelector component', () => {
        // act
        render(<ThemeSelector />, { wrapper: i18nProvider });

        // assert
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should toggle the theme when the button is clicked', async () => {
        // act
        render(<ThemeSelector />, { wrapper: i18nProvider });

        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(setTheme).toHaveBeenCalledWith('dark');
    });

    it('should toggle the theme back to light when the button is clicked again', async () => {
        // arrange
        vi.mocked(setTheme).mockClear();
        resolvedTheme = 'dark';

        // act
        render(<ThemeSelector />, { wrapper: i18nProvider });

        const button = screen.getByRole('button');
        await userEvent.click(button);

        // assert
        expect(setTheme).toHaveBeenCalledWith('light');
    });
});
