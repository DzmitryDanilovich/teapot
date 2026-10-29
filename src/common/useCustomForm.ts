import { useForm } from '@conform-to/react';
import type { DefaultValue } from '@conform-to/react';
import {
    parseWithZod,
    getZodConstraint,
    SubmissionResult,
} from '@conform-to/zod/v4';
import { useActionState, useTransition } from 'react';
import { z } from 'zod';

interface Props<TSchema extends z.ZodObject> {
    schema: TSchema;
    action: (
        previousState: unknown,
        values: FormData,
    ) => Promise<SubmissionResult>;
    defaultValue?: DefaultValue<z.input<TSchema>>;
    id: string;
}

export const useCustomForm = <TSchema extends z.ZodObject>({
    schema,
    action,
    defaultValue,
    id,
}: Props<TSchema>) => {
    const [state, formAction] = useActionState(action, null);
    const [isPending, startTransition] = useTransition();

    const [form, fields] = useForm({
        id: id,
        lastResult: state,
        defaultValue: defaultValue,
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        constraint: getZodConstraint(schema),
        onValidate({ formData }) {
            return parseWithZod(formData, { schema });
        },
        onSubmit(event, { formData }) {
            event.preventDefault();
            startTransition(() => {
                formAction(formData);
            });
        },
    });

    return { form, fields, isPending, formAction };
};
