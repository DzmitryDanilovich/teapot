import { z } from 'zod';

import type { Translator } from '@/i18n/types';

export type LogInValues = z.infer<ReturnType<typeof createLogInSchema>>;
export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export const createLogInSchema = (t: Translator<'LogInForm'>) =>
    z.object({
        email: z.email(t('invalidEmailAddress')),
        password: z.string().min(1, t('passwordIsRequired')),
    });

export const createSignUpSchema = (t: Translator<'LogInForm'>) =>
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
