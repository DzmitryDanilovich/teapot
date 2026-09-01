'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useState } from 'react';

import type { Errors } from '@/common/errorCollector';
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
import { Tea, TeaType } from '@/generated/prisma/browser';

interface State {
    values: Partial<Tea>;
    errors: Errors<Partial<Tea>>;
}

interface Props {
    title: string;
    initialState: State | null;
    action: (previousState: State | null, formData: FormData) => Promise<State>;
}

const TeaEditCard = ({ title, initialState, action }: Props) => {
    const tTea = useTranslations('Tea');
    const tTeaType = useTranslations('TeaType');
    const tCommon = useTranslations('Common');

    const [state, formAction, isPending] = useActionState(action, initialState);
    const [type, setType] = useState<TeaType | null>(
        state?.values.type || null,
    );

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            {state?.errors?.form && (
                <p className='text-destructive mb-4 text-sm'>
                    {state.errors.form.join(', ')}
                </p>
            )}
            <CardContent>
                <form id='logTeaForm' action={formAction}>
                    <FieldGroup>
                        <Field>
                            <Input
                                type='text'
                                name='name'
                                defaultValue={state?.values?.name}
                                placeholder={tTea('name')}
                            />
                            <FieldError
                                errors={state?.errors?.name?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field>
                            <Combobox
                                name='type'
                                items={Object.values(TeaType)}
                                value={type}
                                onValueChange={setType}
                                itemToStringLabel={(item) =>
                                    item && tTeaType(item)
                                }
                                required
                            >
                                <ComboboxInput placeholder={tTea('type')} />
                                <ComboboxContent>
                                    {Object.values(TeaType).map((tea) => (
                                        <ComboboxItem key={tea} value={tea}>
                                            {tTeaType(tea)}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxContent>
                            </Combobox>
                            <FieldError
                                errors={state?.errors?.type?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field>
                            <Input
                                type='text'
                                name='origin'
                                defaultValue={state?.values?.origin || ''}
                                placeholder={tTea('origin')}
                            />
                            <FieldError
                                errors={state?.errors?.origin?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                        <Field>
                            <Input
                                type='text'
                                name='storeUrl'
                                defaultValue={state?.values?.storeUrl || ''}
                                placeholder={tTea('storeUrl')}
                            />
                            <FieldError
                                errors={state?.errors?.storeUrl?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={isPending} type='submit' form='logTeaForm'>
                    {tCommon('save')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TeaEditCard;
