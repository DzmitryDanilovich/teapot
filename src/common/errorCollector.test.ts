import { collectErrors } from './errorCollector';

describe('collectErrors', () => {
    it('should collect a field errors', () => {
        // arrange
        const issues = [
            {
                message: 'Name is required',
                path: ['name'],
            },
        ];

        // act
        const errors = collectErrors(issues as any);

        // assert
        expect(errors).toEqual({
            name: ['Name is required'],
        });
    });

    it('should collect form errors', () => {
        // arrange
        const issues = [
            {
                message: 'An error occurred during login',
                path: [],
            },
        ];

        // act
        const errors = collectErrors(issues as any);

        // assert
        expect(errors).toEqual({
            form: ['An error occurred during login'],
        });
    });
});
