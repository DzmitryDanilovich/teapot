import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { FieldValues, useForm, DefaultValues } from 'react-hook-form';
import { z } from 'zod';

import { applyServerErrors, Errors } from './clientFormErrorsService';

interface Props<TValues extends FieldValues, TInput extends FieldValues> {
    schema: z.ZodType<TValues, TInput>;
    action: (values: TValues) => Promise<{ errors: Errors<TInput> }>;
    defaultValues?: DefaultValues<TInput>;
}

export const useCustomForm = <
    TValues extends FieldValues,
    TInput extends FieldValues,
>(
    props: Props<TValues, TInput>,
) => {
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<TInput, unknown, TValues>({
        resolver: zodResolver(props.schema),
        mode: 'onBlur',
        criteriaMode: 'all',
        defaultValues: props.defaultValues,
    });

    const onSubmit = handleSubmit((values) => {
        startTransition(async () => {
            const result = await props.action(values);
            if (!result?.errors) {
                return;
            }

            applyServerErrors(setError, result.errors);
        });
    });

    return {
        register,
        onSubmit,
        errors,
        isPending,
        control,
    };
};
