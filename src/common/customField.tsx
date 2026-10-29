'use client';

import { FieldMetadata, getInputProps } from '@conform-to/react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface Props<TSchema> {
    field: FieldMetadata<TSchema>;
    label?: string;
    placeholder?: string;
    fieldType: 'text' | 'email' | 'password';
}

export const CustomField = <TSchema,>({
    field,
    label,
    fieldType,
    placeholder,
}: Props<TSchema>) => (
    <Field data-invalid={!field.valid}>
        {label && <FieldLabel htmlFor={field.id}>{label}</FieldLabel>}
        <Input
            {...getInputProps(field, {
                type: fieldType,
            })}
            placeholder={placeholder}
        />
        <FieldError
            id={field.errorId}
            errors={field.errors?.map((e) => ({
                message: e,
            }))}
        />
    </Field>
);
