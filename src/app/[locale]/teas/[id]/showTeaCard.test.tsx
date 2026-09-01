import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js';
import { format } from 'date-fns/format';

import i18nProvider from '@test/i18nProvider';
import { getStubTea } from '@test/tea';

import ShowTeaCard from './showTeaCard';

describe('ShowTeaCard', () => {
    it('should render the ShowTeaCard component', () => {
        // arrange
        const tea = getStubTea();

        // act
        render(<ShowTeaCard tea={tea} onEdit={() => {}} />, {
            wrapper: i18nProvider,
        });

        // assert
        expect(screen.getByText(tea.name)).toBeInTheDocument();
        expect(screen.getByText(tea.type!)).toBeInTheDocument();
        expect(screen.getByText(tea.origin!)).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', tea.storeUrl);
        expect(
            screen.getByText(format(tea.createdAt, 'dd.MM.yyyy')),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Edit' }),
        ).toBeInTheDocument();
    });

    it('should not render origin and storeUrl if they are not provided', () => {
        // arrange
        const tea = {
            ...getStubTea(),
            origin: null,
            storeUrl: null,
        };

        // act
        render(<ShowTeaCard tea={tea} onEdit={() => {}} />, {
            wrapper: i18nProvider,
        });

        // assert
        expect(screen.queryByText('Origin:')).not.toBeInTheDocument();
        expect(screen.queryByText('Store URL:')).not.toBeInTheDocument();
    });

    it('should call edit handler when Edit button is clicked', async () => {
        // arrange
        const tea = getStubTea();
        const onEdit = vi.fn();

        render(<ShowTeaCard tea={tea} onEdit={onEdit} />, {
            wrapper: i18nProvider,
        });

        // act
        const editButton = screen.getByRole('button', { name: 'Edit' });
        await userEvent.click(editButton);

        // assert
        expect(onEdit).toHaveBeenCalled();
    });
});
