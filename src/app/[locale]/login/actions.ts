'use server';

import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import z from 'zod';

import { redirect } from '@/i18n/redirect';
import { auth } from '@/lib/auth';

import {
    createLogInSchema,
    createSignUpSchema,
    type LogInValues,
    type SignUpValues,
} from './schemas';

export const logIn = async (values: LogInValues) => {
    const t = await getTranslations('LogInForm');
    const logInSchema = createLogInSchema(t);

    const parsedData = logInSchema.safeParse(values);

    if (!parsedData.success) {
        return {
            errors: z.flattenError(parsedData.error),
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
                formErrors: [(error as Error).message || t('logInError')],
                fieldErrors: {},
            },
        };
    }

    return await redirect('/');
};

export const signUp = async (values: SignUpValues) => {
    const t = await getTranslations('LogInForm');
    const signUpSchema = createSignUpSchema(t);

    const parsedData = signUpSchema.safeParse(values);

    if (!parsedData.success) {
        return {
            errors: z.flattenError(parsedData.error),
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
                formErrors: [(error as Error).message || t('signUpError')],
                fieldErrors: {},
            },
        };
    }

    return await redirect('/');
};
