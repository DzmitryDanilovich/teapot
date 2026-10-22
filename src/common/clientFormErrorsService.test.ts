import {
    applyServerErrors,
    getErrorMessages,
    type Errors,
} from './clientFormErrorsService';

describe('applyServerErrors', () => {
    it('should apply server errors to the form', () => {
        // arrange
        const setError = vi.fn();
        const errors: Errors<{ field: string }> = {
            formErrors: ['form error'],
            fieldErrors: {
                field: ['field error'],
            },
        };

        // act
        applyServerErrors(setError, errors);

        // assert
        expect(setError).toHaveBeenCalledWith('field', {
            type: 'server',
            types: { server: ['field error'] },
        });
        expect(setError).toHaveBeenCalledWith('root', {
            message: 'form error',
        });
    });
});

describe('getErrorMessages', () => {
    it('should return error messages from a FieldError with types', () => {
        // arrange
        const error = {
            type: 'server',
            types: {
                server: ['field error'],
            },
        };

        // act
        const result = getErrorMessages(error);

        // assert
        expect(result).toEqual([{ message: 'field error' }]);
    });

    it('should return error message from a FieldError with message', () => {
        // arrange
        const error = {
            type: 'server',
            message: 'field error',
        };

        // act
        const result = getErrorMessages(error);

        // assert
        expect(result).toEqual([{ message: 'field error' }]);
    });

    it('should return an empty array if no error is provided', () => {
        // arrange, act
        const result = getErrorMessages(undefined);

        // assert
        expect(result).toEqual([]);
    });

    it('should return an empty array if the error has no message or types', () => {
        // arrange
        const error = {
            type: 'server',
        };

        // act
        const result = getErrorMessages(error);

        // assert
        expect(result).toEqual([]);
    });
});
