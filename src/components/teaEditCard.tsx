'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
} from '@/components/ui/combobox';
import teaTypes from '@/common/teaTypes';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import type { Errors } from '@/common/errorCollector';
import { Tea } from '@/generated/prisma/browser';
import { useActionState } from 'react';

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
    const [state, formAction, isPending] = useActionState(action, initialState);

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
                                placeholder='Tea Name'
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
                                items={teaTypes}
                                value={state?.values?.type}
                                required
                            >
                                <ComboboxInput placeholder='Tea Type' />
                                <ComboboxContent>
                                    {teaTypes.map((tea) => (
                                        <ComboboxItem key={tea} value={tea}>
                                            {tea}
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
                                placeholder='Tea Origin'
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
                                placeholder='Store URL'
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
                    Save
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TeaEditCard;
