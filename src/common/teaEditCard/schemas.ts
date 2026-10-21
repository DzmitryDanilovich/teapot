import { z } from 'zod';

import { TeaType } from '@/generated/prisma/browser';
import type { Translator } from '@/i18n/types';

export type EditTeaValues = z.infer<ReturnType<typeof createEditTeaSchema>>;

export const createEditTeaSchema = (t: Translator<'EditTeaAction'>) =>
    z.object({
        name: z.string().min(1, t('nameIsRequired')),
        type: z.enum(TeaType, t('validTypeIsRequired')),
        origin: z.string().optional(),
        storeUrl: z
            .union([z.literal(''), z.url(t('storeUrlMustBeValid'))])
            .transform((value) => value || undefined)
            .optional(),
    });
