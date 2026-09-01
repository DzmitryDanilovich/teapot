import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18nProvider from '@test/i18nProvider';
import { routerMock } from '@test/mocks/navigation';

import LanguageSelector from './languageSelector';

vi.mock('@/i18n/navigation', async () => ({
    ...(await vi.importActual<typeof import('@/i18n/navigation')>(
        '@/i18n/navigation',
    )),
    useRouter: () => routerMock,
    usePathname: () => 'testPathname',
}));

vi.mock('@/i18n/routing', async () => ({
    ...(await vi.importActual<typeof import('@/i18n/routing')>(
        '@/i18n/routing',
    )),
    routing: {
        locales: ['en', 'pl', 'be', 'ru'],
    },
}));

describe('LanguageSelector', () => {
    it('should render the LanguageSelector component', () => {
        // act
        render(<LanguageSelector />, { wrapper: i18nProvider });

        // assert
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should change the language when a new language is selected', async () => {
        // act
        render(<LanguageSelector />, { wrapper: i18nProvider });

        const select = screen.getByRole('button');
        await userEvent.click(select);

        const newLanguageOption = screen.getByText('Polski');
        await userEvent.click(newLanguageOption);

        // assert
        expect(routerMock.replace).toHaveBeenCalledWith('testPathname', {
            locale: 'pl',
        });
    });
});
