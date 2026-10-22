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

        const values = {
            email: 'test@example.com',
            password: '12qw!@QW',
        };

        // act
        await logIn(values);

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

            const values = {
                email: inputData.email,
                password: inputData.password,
            };

            // act
            const result = await logIn(values);

            // assert
            expect(result).toEqual({
                errors: {
                    fieldErrors: {
                        [inputField]: [expectedError],
                    },
                    formErrors: [],
                },
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

            const values = {
                email: 'test@example.com',
                password: '12qw!@QW',
            };

            // act
            const result = await logIn(values);

            // assert
            expect(result).toEqual({
                errors: {
                    formErrors: [expectedError],
                    fieldErrors: {},
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

        const values = {
            name: mockName,
            email: mockEmail,
            password: mockPassword,
        };

        // act
        await signUp(values);

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

            const values = {
                name: inputData.name,
                email: inputData.email,
                password: inputData.password,
            };

            // act
            const result = await signUp(values);

            // assert
            expect(result).toEqual({
                errors: {
                    fieldErrors: {
                        [inputField]: [expectedError],
                    },
                    formErrors: [],
                },
            });
        },
    );

    it.each([
        { returnedError: 'Signup failed', expectedError: 'Signup failed' },
        { returnedError: '', expectedError: 'signUpError' },
    ])(
        'should return an error message if signup fails',
        async ({ returnedError, expectedError }) => {
            // arrange
            const mockError = new Error(returnedError);
            vi.spyOn(auth.api, 'signUpEmail').mockRejectedValueOnce(mockError);

            const values = {
                name: 'Test User',
                email: 'test@example.com',
                password: '12qw!@QW',
            };

            // act
            const result = await signUp(values);

            // assert
            expect(result).toEqual({
                errors: {
                    fieldErrors: {},
                    formErrors: [expectedError],
                },
            });
        },
    );
});
