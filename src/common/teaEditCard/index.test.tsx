import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18nProvider from '@test/i18nProvider';
import { getStubTeaValues } from '@test/tea';

import TeaEditCard from '.';

describe('TeaEditCard', () => {
    it('should render the TeaEditCard component', () => {
        // arrange
        const teaValues = getStubTeaValues();

        // act
        render(
            <TeaEditCard
                title='Test Title'
                values={teaValues}
                action={vi.fn()}
            />,
            { wrapper: i18nProvider },
        );

        // assert
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByDisplayValue(teaValues.name)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('Green');
        expect(screen.getByDisplayValue(teaValues.origin!)).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(teaValues.storeUrl!),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Save' }),
        ).toBeInTheDocument();
    });

    it('should render the TeaEditCard component with empty values', () => {
        // act
        render(<TeaEditCard title='Test Title' action={vi.fn()} />, {
            wrapper: i18nProvider,
        });

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
            const teaValues = getStubTeaValues();
            const onAction = vi.fn().mockResolvedValueOnce({
                errors: {
                    fieldErrors: {
                        [inputField]: [expectedError],
                    },
                    formErrors: [],
                },
            });

            render(
                <TeaEditCard
                    title='Test Title'
                    values={teaValues}
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
        const teaValues = getStubTeaValues();
        const onAction = vi.fn().mockResolvedValueOnce({
            errors: {
                fieldErrors: {},
                formErrors: ['Form error'],
            },
        });
        render(
            <TeaEditCard
                title='Test Title'
                values={teaValues}
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
        const teaValues = getStubTeaValues();
        render(
            <TeaEditCard
                title='Test Title'
                values={teaValues}
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
