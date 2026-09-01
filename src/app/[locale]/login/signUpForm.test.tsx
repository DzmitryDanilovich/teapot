import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18nProvider from '@test/i18nProvider';

import { signUp } from './actions';
import SignUpForm from './signUpForm';

vi.mock('./actions', () => ({
    signUp: vi.fn(),
}));

const mockSignUp = vi.mocked(signUp);

describe('SignUpForm', () => {
    it('should render the sign up form', () => {
        // act
        render(<SignUpForm />, { wrapper: i18nProvider });

        // assert
        expect(
            screen.getByRole('button', { name: 'Sign Up' }),
        ).toBeInTheDocument();
    });

    it('should submit the form with name, email, and password', async () => {
        // arrange
        const expectedFormData = new FormData();
        expectedFormData.append('name', 'testuser');
        expectedFormData.append('email', 'test@example.com');
        expectedFormData.append('password', '12qw!@QW');
        render(<SignUpForm />, { wrapper: i18nProvider });

        // act
        const nameInput = screen.getByLabelText('Name');
        await userEvent.type(nameInput, 'testuser');
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Sign Up' });
        await userEvent.click(submitButton);

        // assert
        expect(mockSignUp).toHaveBeenCalledWith(null, expectedFormData);
    });

    it('should preserve values in the form fields', async () => {
        // arrange
        mockSignUp.mockResolvedValueOnce({
            errors: {
                form: ['Form error'],
            },
            values: {
                name: 'testuser',
                email: 'test@example.com',
                password: '12qw!@QW',
            },
        });
        render(<SignUpForm />, { wrapper: i18nProvider });

        // act
        const nameInput = screen.getByLabelText('Name');
        await userEvent.type(nameInput, 'testuser');
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Sign Up' });
        await userEvent.click(submitButton);

        // assert
        expect(screen.getByLabelText('Name')).toHaveValue('testuser');
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('12qw!@QW');
    });

    it.each([
        {
            inputField: 'name',
            expectedError: 'Name is required',
        },
        {
            inputField: 'email',
            expectedError: 'Invalid email address',
        },
        {
            inputField: 'password',
            expectedError: 'Password is too short',
        },
    ])(
        'should display error message for invalid $inputField',
        async ({ inputField, expectedError }) => {
            // arrange
            mockSignUp.mockResolvedValueOnce({
                errors: {
                    [inputField]: [expectedError],
                },
                values: {
                    name: 'testuser',
                    email: 'test@example.com',
                    password: '12qw!@QW',
                },
            });
            render(<SignUpForm />, { wrapper: i18nProvider });

            // act
            const nameInput = screen.getByLabelText('Name');
            await userEvent.type(nameInput, 'testuser');
            const emailInput = screen.getByLabelText('Email');
            await userEvent.type(emailInput, 'test@example.com');
            const passwordInput = screen.getByLabelText('Password');
            await userEvent.type(passwordInput, '12qw!@QW');
            const submitButton = screen.getByRole('button', {
                name: 'Sign Up',
            });
            await userEvent.click(submitButton);

            // assert
            expect(await screen.findByText(expectedError)).toBeInTheDocument();
        },
    );

    it('should display form error message', async () => {
        // arrange
        mockSignUp.mockResolvedValueOnce({
            errors: {
                form: ['Form error'],
            },
            values: {
                name: 'testuser',
                email: 'test@example.com',
                password: '12qw!@QW',
            },
        });
        render(<SignUpForm />, { wrapper: i18nProvider });

        // act
        const nameInput = screen.getByLabelText('Name');
        await userEvent.type(nameInput, 'testuser');
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Sign Up' });
        await userEvent.click(submitButton);

        // assert
        expect(await screen.findByText('Form error')).toBeInTheDocument();
    });
});
