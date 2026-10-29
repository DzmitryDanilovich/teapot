'use client';

import { getFormProps } from '@conform-to/react';
import { useTranslations } from 'next-intl';

import { CustomField } from '@/common/customField';
import { useCustomForm } from '@/common/useCustomForm';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';

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
                        <CustomField
                            field={fields.name}
                            label={t('name')}
                            fieldType='text'
                        />

                        <CustomField
                            field={fields.email}
                            label={t('email')}
                            fieldType='email'
                        />

                        <CustomField
                            field={fields.password}
                            label={t('password')}
                            fieldType='password'
                        />
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
