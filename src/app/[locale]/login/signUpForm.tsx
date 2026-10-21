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

import { signUp } from './actions';
import { createSignUpSchema } from './schemas';

const SignUpForm = () => {
    const t = useTranslations('LogIn');
    const tForm = useTranslations('LogInForm');
    const schema = useMemo(() => createSignUpSchema(tForm), [tForm]);

    const { register, onSubmit, errors, isPending } = useCustomForm({
        schema,
        action: signUp,
    });

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{t('signUp')}</CardTitle>
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
                <form
                    id='signUpForm'
                    onSubmit={(event) => void onSubmit(event)}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='name'>{t('name')}</FieldLabel>
                            <Input
                                type='text'
                                id='name'
                                {...register('name')}
                            />
                            <FieldError
                                errors={getErrorMessages(errors.name)}
                            />
                        </Field>

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
                <Button disabled={isPending} type='submit' form='signUpForm'>
                    {t('signUp')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SignUpForm;
