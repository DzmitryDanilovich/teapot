import { z } from 'zod';

import { TeaType } from '@/generated/prisma/browser';
import type { Translator } from '@/i18n/types';

export type EditTeaValues = z.infer<ReturnType<typeof createEditTeaSchema>>;

export const createEditTeaSchema = (t: Translator<'EditTeaForm'>) =>
    z.object({
        name: z.string(t('nameIsRequired')).min(1, t('nameIsRequired')),
        type: z.enum(TeaType, t('validTypeIsRequired')),
        origin: z.string().optional(),
        storeUrl: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z.url(t('storeUrlMustBeValid')).optional(),
        ),
    });
