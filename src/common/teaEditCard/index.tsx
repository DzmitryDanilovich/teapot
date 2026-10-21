'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { Errors, getErrorMessages } from '@/common/clientFormErrorsService';
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

import { createEditTeaSchema, EditTeaValues } from './schemas';

interface Props {
    title: string;
    values?: Partial<EditTeaValues>;
    action: (
        values: EditTeaValues,
    ) => Promise<{ errors: Errors<EditTeaValues> }>;
}

const TeaEditCard = ({ title, values, action }: Props) => {
    const tTea = useTranslations('Tea');
    const tTeaType = useTranslations('TeaType');
    const tCommon = useTranslations('Common');

    const tEditTeaAction = useTranslations('EditTeaAction');
    const schema = useMemo(
        () => createEditTeaSchema(tEditTeaAction),
        [tEditTeaAction],
    );

    const { register, onSubmit, errors, isPending, control } = useCustomForm({
        schema,
        action,
        defaultValues: values,
    });

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            {errors?.root && (
                <p
                    role='alert'
                    className='text-destructive mb-4 text-sm whitespace-pre-wrap'
                >
                    {errors.root.message}
                </p>
            )}
            <CardContent>
                <form
                    id='logTeaForm'
                    onSubmit={(event) => void onSubmit(event)}
                >
                    <FieldGroup>
                        <Field>
                            <Input
                                type='text'
                                id='name'
                                {...register('name')}
                                placeholder={tTea('name')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.name)}
                            />
                        </Field>
                        <Field>
                            <Controller
                                control={control}
                                name='type'
                                render={({ field }) => (
                                    <Combobox
                                        name='type'
                                        items={Object.values(TeaType)}
                                        value={field.value ?? null}
                                        onValueChange={field.onChange}
                                        itemToStringLabel={(item) =>
                                            item && tTeaType(item)
                                        }
                                    >
                                        <ComboboxInput
                                            placeholder={tTea('type')}
                                        />
                                        <ComboboxContent>
                                            {Object.values(TeaType).map(
                                                (tea) => (
                                                    <ComboboxItem
                                                        key={tea}
                                                        value={tea}
                                                    >
                                                        {tTeaType(tea)}
                                                    </ComboboxItem>
                                                ),
                                            )}
                                        </ComboboxContent>
                                    </Combobox>
                                )}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.type)}
                            />
                        </Field>
                        <Field>
                            <Input
                                type='text'
                                id='origin'
                                {...register('origin')}
                                placeholder={tTea('origin')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.origin)}
                            />
                        </Field>
                        <Field>
                            <Input
                                type='text'
                                id='storeUrl'
                                {...register('storeUrl')}
                                placeholder={tTea('storeUrl')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.storeUrl)}
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
