'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { getErrorMessages } from '@/common/clientFormErrorsService';
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
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { logIn } from './actions';
import { createLogInSchema } from './schemas';

const LogInForm = () => {
    const t = useTranslations('LogIn');
    const tForm = useTranslations('LogInForm');
    const schema = useMemo(() => createLogInSchema(tForm), [tForm]);

    const { register, onSubmit, errors, isPending } = useCustomForm({
        schema,
        action: logIn,
    });

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{t('logIn')}</CardTitle>
            </CardHeader>
            <CardContent>
                {errors.root && (
                    <p
                        role='alert'
                        className='text-destructive mb-4 text-sm whitespace-pre-line'
                    >
                        {errors.root?.message}
                    </p>
                )}
                <form id='loginForm' onSubmit={(event) => void onSubmit(event)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='email'>
                                {t('email')}
                            </FieldLabel>
                            <Input
                                type='email'
                                id='email'
                                {...register('email')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.email)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor='password'>
                                {t('password')}
                            </FieldLabel>
                            <Input
                                type='password'
                                id='password'
                                {...register('password')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.password)}
                            />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={isPending} type='submit' form='loginForm'>
                    {t('logIn')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LogInForm;
