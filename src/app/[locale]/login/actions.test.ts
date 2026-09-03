import { redirect } from '@/i18n/redirect';
import { auth } from '@/lib/auth';

import { logIn, signUp } from './actions';

vi.mock('@/i18n/redirect', () => ({
    redirect: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);

vi.mock('next-intl/server', () => ({
    getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue({ 'x-test-header': 'test-value' }),
}));

describe('logIn', () => {
    it('should login successfully with valid credentials', async () => {
        // arrange
        vi.spyOn(auth.api, 'signInEmail').mockResolvedValueOnce({} as any);

        const formData = new FormData();
        formData.append('email', 'test@example.com');
        formData.append('password', '12qw!@QW');

        // act
        await logIn(null, formData);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it.each([
        {
            inputField: 'email',
            inputData: {
                email: 'invalid-email',
                password: '12qw!@QW',
            },
            expectedError: 'invalidEmailAddress',
        },
        {
            inputField: 'password',
            inputData: {
                email: 'test@example.com',
                password: '',
            },
            expectedError: 'passwordIsRequired',
        },
    ])(
        'should return an error for invalid $inputField',
        async ({ inputField, inputData, expectedError }) => {
            // arrange
            vi.spyOn(auth.api, 'signInEmail').mockResolvedValueOnce({} as any);

            const formData = new FormData();
            formData.append('email', inputData.email);
            formData.append('password', inputData.password);

            // act
            const result = await logIn(null, formData);

            // assert
            expect(result).toEqual({
                errors: {
                    [inputField]: [expectedError],
                },
                values: inputData,
            });
        },
    );

    it.each([
        { returnedError: 'Login failed', expectedError: 'Login failed' },
        { returnedError: '', expectedError: 'logInError' },
    ])(
        'should return an error message if login fails',
        async ({ returnedError, expectedError }) => {
            // arrange
            const mockError = new Error(returnedError);
            vi.spyOn(auth.api, 'signInEmail').mockRejectedValueOnce(mockError);

            const formData = new FormData();
            formData.append('email', 'test@example.com');
            formData.append('password', '12qw!@QW');

            // act
            const result = await logIn(null, formData);

            // assert
            expect(result).toEqual({
                errors: {
                    form: [expectedError],
                },
                values: {
                    email: 'test@example.com',
                    password: '12qw!@QW',
                },
            });
        },
    );
});

describe('signUp', () => {
    it('should sign up successfully with valid data', async () => {
        // arrange
        vi.spyOn(auth.api, 'signUpEmail').mockResolvedValueOnce({} as any);

        const mockName = 'Test User';
        const mockEmail = 'test@example.com';
        const mockPassword = '12qw!@QW';
        const formData = new FormData();
        formData.append('name', mockName);
        formData.append('email', mockEmail);
        formData.append('password', mockPassword);

        // act
        await signUp(null, formData);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it.each([
        {
            inputField: 'name',
            inputData: {
                name: '',
                email: 'test@example.com',
                password: '12qw!@QW',
            },
            expectedError: 'nameIsRequired',
        },
        {
            inputField: 'email',
            inputData: {
                name: 'Test User',
                email: 'invalid-email',
                password: '12qw!@QW',
            },
            expectedError: 'invalidEmailAddress',
        },
        {
            inputField: 'password',
            inputData: {
                name: 'Test User',
                email: 'test@example.com',
                password: '12qw!@Q',
            },
            expectedError: 'passwordLengthError',
        },
        {
            inputField: 'password',
            inputData: {
                name: 'Test User',
                email: 'test@example.com',
                password: '12qw12QW',
            },
            expectedError: 'passwordMustContainSpecialCharacter',
        },
        {
            inputField: 'password',
            inputData: {
                name: 'Test User',
                email: 'test@example.com',
                password: '12qw!@qw',
            },
            expectedError: 'passwordMustContainUppercase',
        },
        {
            inputField: 'password',
            inputData: {
                name: 'Test User',
                email: 'test@example.com',
                password: '12QW!@QW',
            },
            expectedError: 'passwordMustContainLowercase',
        },
        {
            inputField: 'password',
            inputData: {
                name: 'Test User',
                email: 'test@example.com',
                password: '!@qw!@QW',
            },
            expectedError: 'passwordMustContainNumber',
        },
    ])(
        'should return an error for invalid $inputField',
        async ({ inputField, inputData, expectedError }) => {
            // arrange
            vi.spyOn(auth.api, 'signUpEmail').mockResolvedValueOnce({} as any);

            const formData = new FormData();
            formData.append('name', inputData.name);
            formData.append('email', inputData.email);
            formData.append('password', inputData.password);

            // act
            const result = await signUp(null, formData);

            // assert
            expect(result).toEqual({
                errors: {
                    [inputField]: [expectedError],
                },
                values: inputData,
            });
        },
    );

    it.each([
        { returnedError: 'Signup failed', expectedError: 'Signup failed' },
        { returnedError: '', expectedError: 'An error occurred during signup' },
    ])(
        'should return an error message if signup fails',
        async ({ returnedError, expectedError }) => {
            // arrange
            const mockError = new Error(returnedError);
            vi.spyOn(auth.api, 'signUpEmail').mockRejectedValueOnce(mockError);

            const formData = new FormData();
            formData.append('name', 'Test User');
            formData.append('email', 'test@example.com');
            formData.append('password', '12qw!@QW');

            // act
            const result = await signUp(null, formData);

            // assert
            expect(result).toEqual({
                errors: {
                    form: [expectedError],
                },
                values: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: '12qw!@QW',
                },
            });
        },
    );
});
