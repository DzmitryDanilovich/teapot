import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { logIn } from './actions';
import LogInForm from './logInForm';

vi.mock('./actions', () => ({
    logIn: vi.fn(),
}));

const mockLogIn = vi.mocked(logIn);

describe('LogInForm', () => {
    it('should render the login form', () => {
        // act
        render(<LogInForm />);

        // assert
        expect(
            screen.getByRole('button', { name: 'Log In' }),
        ).toBeInTheDocument();
    });

    it('should submit the form with email and password', async () => {
        // arrange
        const expectedFormData = new FormData();
        expectedFormData.append('email', 'test@example.com');
        expectedFormData.append('password', '12qw!@QW');
        render(<LogInForm />);

        // act
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Log In' });
        await userEvent.click(submitButton);

        // assert
        expect(mockLogIn).toHaveBeenCalledWith(null, expectedFormData);
    });

    it('should preserve values in the form fields', async () => {
        // arrange
        mockLogIn.mockResolvedValueOnce({
            errors: {
                form: ['Form error'],
            },
            values: {
                email: 'test@example.com',
                password: '12qw!@QW',
            },
        });
        render(<LogInForm />);

        // act
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Log In' });
        await userEvent.click(submitButton);

        // assert
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('12qw!@QW');
    });

    it.each([
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
            mockLogIn.mockResolvedValueOnce({
                errors: {
                    [inputField]: [expectedError],
                },
                values: { email: 'test@example.com', password: '12qw!@QW' },
            });
            render(<LogInForm />);

            // act
            const emailInput = screen.getByLabelText('Email');
            await userEvent.type(emailInput, 'test@example.com');
            const passwordInput = screen.getByLabelText('Password');
            await userEvent.type(passwordInput, '12qw!@QW');
            const submitButton = screen.getByRole('button', { name: 'Log In' });
            await userEvent.click(submitButton);

            // assert
            expect(screen.getByText(expectedError)).toBeInTheDocument();
        },
    );

    it('should display form error message', async () => {
        // arrange
        mockLogIn.mockResolvedValueOnce({
            errors: {
                form: ['Form error'],
            },
            values: {
                email: 'test@example.com',
                password: '12qw!@QW',
            },
        });
        render(<LogInForm />);

        // act
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'test@example.com');
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12qw!@QW');
        const submitButton = screen.getByRole('button', { name: 'Log In' });
        await userEvent.click(submitButton);

        // assert
        expect(screen.getByText('Form error')).toBeInTheDocument();
    });
});
