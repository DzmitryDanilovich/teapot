'use server';

import { parseWithZod } from '@conform-to/zod/v4';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { redirect } from '@/i18n/redirect';
import { auth } from '@/lib/auth';

import { createLogInSchema, createSignUpSchema } from './schemas';

export const logIn = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('LogInForm');
    const logInSchema = createLogInSchema(t);

    const submission = parseWithZod(formData, { schema: logInSchema });

    if (submission.status !== 'success') {
        return submission.reply({ hideFields: ['password'] });
    }

    try {
        await auth.api.signInEmail({
            body: { ...submission.value },
            headers: await headers(),
        });
    } catch (error: unknown) {
        return submission.reply({
            formErrors: [(error as Error).message || t('logInError')],
            hideFields: ['password'],
        });
    }

    return await redirect('/');
};

export const signUp = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('LogInForm');
    const signUpSchema = createSignUpSchema(t);

    const submission = parseWithZod(formData, { schema: signUpSchema });

    if (submission.status !== 'success') {
        return submission.reply({ hideFields: ['password'] });
    }

    try {
        await auth.api.signUpEmail({
            body: { ...submission.value },
            headers: await headers(),
        });
    } catch (error: unknown) {
        return submission.reply({
            formErrors: [(error as Error).message || t('signUpError')],
            hideFields: ['password'],
        });
    }

    return await redirect('/');
};
