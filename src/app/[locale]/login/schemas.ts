import { z } from 'zod';

import type { Translator } from '@/i18n/types';

export const createLogInSchema = (t: Translator<'LogInForm'>) =>
    z.object({
        email: z.email(t('invalidEmailAddress')),
        password: z
            .string(t('passwordIsRequired'))
            .min(1, t('passwordIsRequired')),
    });

export const createSignUpSchema = (t: Translator<'LogInForm'>) =>
    z.object({
        name: z.string(t('nameIsRequired')).min(1, t('nameIsRequired')),
        email: z.email(t('invalidEmailAddress')),
        password: z
            .string(t('passwordIsRequired'))
            .min(8, t('passwordLengthError', { minLength: '8' }))
            .regex(/[A-Z]/, t('passwordMustContainUppercase'))
            .regex(/[a-z]/, t('passwordMustContainLowercase'))
            .regex(/\d/, t('passwordMustContainNumber'))
            .regex(/[@$!%*?&]/, t('passwordMustContainSpecialCharacter')),
    });
