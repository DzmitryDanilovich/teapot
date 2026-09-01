'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { collectErrors } from '@/common/errorCollector';
import { Tea, TeaType } from '@/generated/prisma/browser';
import { redirect } from '@/i18n/redirect';
import type { Translations } from '@/i18n/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

const createLogTeaSchema = (t: Translations) =>
    z.object({
        name: z.string().min(1, t('nameIsRequired')),
        type: z.enum(TeaType, t('validTypeIsRequired')),
        origin: z.string().optional(),
        storeUrl: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z.url(t('storeUrlMustBeValid')).optional(),
        ),
    });

type LogTeaValues = z.infer<ReturnType<typeof createLogTeaSchema>>;

export const logTea = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('EditTeaAction');
    const logTeaSchema = createLogTeaSchema(t);

    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const parsedData = logTeaSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            errors: collectErrors<LogTeaValues>(parsedData.error.issues),
            values: rawData as Partial<Tea>,
        };
    }

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    await prisma.tea.create({
        data: {
            ...parsedData.data,
            userId,
        },
    });

    return await redirect('/teas');
};
