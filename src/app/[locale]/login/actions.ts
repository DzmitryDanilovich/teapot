'use server';

import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { collectErrors } from '@/common/errorCollector';
import { redirect } from '@/i18n/redirect';
import type { Translations } from '@/i18n/types';
import { auth } from '@/lib/auth';

const createLogInSchema = (t: Translations) =>
    z.object({
        email: z.email(t('invalidEmailAddress')),
        password: z.string().min(1, t('passwordIsRequired')),
    });

type LogInValues = z.infer<ReturnType<typeof createLogInSchema>>;

export const logIn = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('LogInActions');
    const logInSchema = createLogInSchema(t);

    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsedData = logInSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            errors: collectErrors<LogInValues>(parsedData.error.issues),
            values: rawData as LogInValues,
        };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email: parsedData.data.email,
                password: parsedData.data.password,
            },
            headers: await headers(),
        });
    } catch (error: unknown) {
        return {
            errors: {
                form: [(error as Error).message || t('logInError')],
            },
            values: rawData as LogInValues,
        };
    }

    return await redirect('/');
};

const createSignUpSchema = (t: Translations) =>
    z.object({
        name: z.string().min(1, t('nameIsRequired')),
        email: z.email(t('invalidEmailAddress')),
        password: z
            .string()
            .min(8, t('passwordLengthError', { minLength: '8' }))
            .regex(/[A-Z]/, t('passwordMustContainUppercase'))
            .regex(/[a-z]/, t('passwordMustContainLowercase'))
            .regex(/\d/, t('passwordMustContainNumber'))
            .regex(/[@$!%*?&]/, t('passwordMustContainSpecialCharacter')),
    });

export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export const signUp = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('LogInActions');
    const signUpSchema = createSignUpSchema(t);

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsedData = signUpSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            errors: collectErrors<SignUpValues>(parsedData.error.issues),
            values: rawData as SignUpValues,
        };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name: parsedData.data.name,
                email: parsedData.data.email,
                password: parsedData.data.password,
            },
            headers: await headers(),
        });
    } catch (error: unknown) {
        return {
            errors: {
                form: [
                    (error as Error).message ||
                        'An error occurred during signup',
                ],
            },
            values: rawData as SignUpValues,
        };
    }

    return await redirect('/');
};
