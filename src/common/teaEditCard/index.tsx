'use client';
import {
    DefaultValue,
    getFormProps,
    getInputProps,
    useInputControl,
} from '@conform-to/react';
import { SubmissionResult } from '@conform-to/zod/v4';
import { useTranslations } from 'next-intl';

import { isTeaType } from '@/common/typeGuards/teaType';
import { useCustomForm } from '@/common/useCustomForm';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
} from '@/components/ui/combobox';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { TeaType } from '@/generated/prisma/browser';

import { createEditTeaSchema, type EditTeaValues } from './schemas';

interface Props {
    title: string;
    initialState: DefaultValue<EditTeaValues>;
    action: (
        previousState: unknown,
        formData: FormData,
    ) => Promise<SubmissionResult>;
}

const TeaEditCard = ({ title, initialState, action }: Props) => {
    const tTea = useTranslations('Tea');
    const tTeaType = useTranslations('TeaType');
    const tEditTeaForm = useTranslations('EditTeaForm');
    const tCommon = useTranslations('Common');

    const schema = createEditTeaSchema(tEditTeaForm);

    const { form, fields, isPending, formAction } = useCustomForm({
        schema,
        action,
        defaultValue: initialState,
        id: 'logTeaForm',
    });

    const type = useInputControl(fields.type);

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            {form.errors && (
                <p
                    role='alert'
                    id={form.errorId}
                    className='text-destructive mb-4 text-sm'
                >
                    {form.errors.join(', ')}
                </p>
            )}
            <CardContent>
                <form {...getFormProps(form)} action={formAction}>
                    <FieldGroup>
                        <Field data-invalid={!fields.name.valid}>
                            <Input
                                {...getInputProps(fields.name, {
                                    type: 'text',
                                })}
                                placeholder={tTea('name')}
                            />
                            <FieldError
                                id={fields.name.errorId}
                                errors={fields.name.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field data-invalid={!fields.type.valid}>
                            <Combobox
                                name={fields.type.name}
                                items={Object.values(TeaType)}
                                value={type.value}
                                onValueChange={(value) =>
                                    type.change(value ?? '')
                                }
                                itemToStringLabel={(value) =>
                                    isTeaType(value) ? tTeaType(value) : ''
                                }
                                required
                            >
                                <ComboboxInput
                                    onBlur={type.blur}
                                    placeholder={tTea('type')}
                                />
                                <ComboboxContent>
                                    {Object.values(TeaType).map((tea) => (
                                        <ComboboxItem key={tea} value={tea}>
                                            {tTeaType(tea)}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxContent>
                            </Combobox>
                            <FieldError
                                id={fields.type.errorId}
                                errors={fields.type.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field>
                            <Input
                                {...getInputProps(fields.origin, {
                                    type: 'text',
                                })}
                                placeholder={tTea('origin')}
                            />
                            <FieldError
                                id={fields.origin.errorId}
                                errors={fields.origin.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field>
                            <Input
                                {...getInputProps(fields.storeUrl, {
                                    type: 'text',
                                })}
                                placeholder={tTea('storeUrl')}
                            />
                            <FieldError
                                id={fields.storeUrl.errorId}
                                errors={fields.storeUrl.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={isPending} type='submit' form={form.id}>
                    {tCommon('save')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TeaEditCard;
