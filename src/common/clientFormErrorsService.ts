import type {
    FieldError,
    FieldValues,
    Path,
    UseFormSetError,
} from 'react-hook-form';

export type Errors<T> = {
    formErrors: string[];
    fieldErrors: Partial<Record<keyof T, string[] | undefined>>;
};

export const applyServerErrors = <T extends FieldValues>(
    setError: UseFormSetError<T>,
    errors: Errors<T>,
) => {
    for (const [field, messages] of Object.entries(errors.fieldErrors)) {
        setError(field as Path<T>, {
            type: 'server',
            types: { server: messages },
        });
    }

    if (errors.formErrors?.length) {
        setError('root', {
            message: errors.formErrors.join('\n'),
        });
    }
};

export const getErrorMessages = (error?: FieldError): { message: string }[] => {
    if (!error) {
        return [];
    }

    if (error.types) {
        return Object.values(error.types)
            .flat()
            .filter((message): message is string => typeof message === 'string')
            .map((message) => ({ message }));
    }

    return error.message ? [{ message: error.message }] : [];
};
