import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18nProvider from '@test/i18nProvider';
import { getStubTea } from '@test/tea';

import TeaEditCard from './teaEditCard';

describe('TeaEditCard', () => {
    it('should render the TeaEditCard component', () => {
        // arrange
        const tea = getStubTea();

        // act
        render(
            <TeaEditCard
                title='Test Title'
                initialState={{ values: tea, errors: {} }}
                action={vi.fn()}
            />,
            { wrapper: i18nProvider },
        );

        // assert
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByDisplayValue(tea.name)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('Green');
        expect(screen.getByDisplayValue(tea.origin!)).toBeInTheDocument();
        expect(screen.getByDisplayValue(tea.storeUrl!)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Save' }),
        ).toBeInTheDocument();
    });

    it('should render the TeaEditCard component with empty values', () => {
        // act
        render(
            <TeaEditCard
                title='Test Title'
                initialState={{ values: {}, errors: {} }}
                action={vi.fn()}
            />,
            { wrapper: i18nProvider },
        );

        // assert
        expect(screen.getByPlaceholderText('Name')).toHaveValue('');
        expect(screen.getByRole('combobox')).toHaveValue('');
        expect(screen.getByPlaceholderText('Origin')).toHaveValue('');
        expect(screen.getByPlaceholderText('Store URL')).toHaveValue('');
    });

    it.each([
        {
            inputField: 'name',
            expectedError: 'Name is required',
        },
        {
            inputField: 'type',
            expectedError: 'Valid type is required',
        },
        {
            inputField: 'origin',
            expectedError: 'Origin is required',
        },
        {
            inputField: 'storeUrl',
            expectedError: 'Store URL must be a valid URL',
        },
    ])(
        'should display error message for invalid $inputField',
        async ({ inputField, expectedError }) => {
            // arrange
            const tea = getStubTea();
            const onAction = vi.fn().mockResolvedValueOnce({
                values: tea,
                errors: {
                    [inputField]: [expectedError],
                },
            });
            render(
                <TeaEditCard
                    title='Test Title'
                    initialState={{ values: tea, errors: {} }}
                    action={onAction}
                />,
                { wrapper: i18nProvider },
            );

            // act
            await userEvent.click(screen.getByRole('button', { name: 'Save' }));

            // assert
            expect(await screen.findByText(expectedError)).toBeInTheDocument();
        },
    );

    it('should display form error message', async () => {
        // arrange
        const tea = getStubTea();
        const onAction = vi.fn().mockResolvedValueOnce({
            values: tea,
            errors: {
                form: ['Form error'],
            },
        });
        render(
            <TeaEditCard
                title='Test Title'
                initialState={{ values: tea, errors: {} }}
                action={onAction}
            />,
            { wrapper: i18nProvider },
        );

        // act
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));

        // assert
        expect(await screen.findByText('Form error')).toBeInTheDocument();
    });

    it('should update type field when a new type is selected', async () => {
        // arrange
        const tea = getStubTea();
        render(
            <TeaEditCard
                title='Test Title'
                initialState={{ values: tea, errors: {} }}
                action={vi.fn()}
            />,
            { wrapper: i18nProvider },
        );

        // act — open the combobox popup, then click the option
        const typeCombobox = screen.getByRole('combobox');
        await userEvent.click(typeCombobox);
        await userEvent.click(
            await screen.findByRole('option', { name: 'Black' }),
        );

        // assert
        expect(typeCombobox).toHaveValue('Black');
    });
});
