'use client';

import { getFormProps, getInputProps } from '@conform-to/react';
import { useTranslations } from 'next-intl';

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

    const schema = createSignUpSchema(tForm);

    const { form, fields, isPending, formAction } = useCustomForm({
        schema,
        action: signUp,
        id: 'signUpForm',
    });

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{t('signUp')}</CardTitle>
            </CardHeader>
            <CardContent>
                {form.errors && (
                    <p
                        role='alert'
                        id={form.errorId}
                        className='text-destructive mb-4 text-sm'
                    >
                        {form.errors.join('; ')}
                    </p>
                )}
                <form {...getFormProps(form)} action={formAction}>
                    <FieldGroup>
                        <Field data-invalid={!fields.name.valid}>
                            <FieldLabel htmlFor={fields.name.id}>
                                {t('name')}
                            </FieldLabel>
                            <Input
                                {...getInputProps(fields.name, {
                                    type: 'text',
                                })}
                            />
                            <FieldError
                                id={fields.name.errorId}
                                errors={fields.name.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>

                        <Field data-invalid={!fields.email.valid}>
                            <FieldLabel htmlFor={fields.email.id}>
                                {t('email')}
                            </FieldLabel>
                            <Input
                                {...getInputProps(fields.email, {
                                    type: 'email',
                                })}
                            />
                            <FieldError
                                id={fields.email.errorId}
                                errors={fields.email.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>

                        <Field data-invalid={!fields.password.valid}>
                            <FieldLabel htmlFor={fields.password.id}>
                                {t('password')}
                            </FieldLabel>
                            <Input
                                {...getInputProps(fields.password, {
                                    type: 'password',
                                })}
                            />
                            <FieldError
                                id={fields.password.errorId}
                                errors={fields.password.errors?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={isPending} type='submit' form={form.id}>
                    {t('signUp')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SignUpForm;
