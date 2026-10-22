'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import {
    createEditTeaSchema,
    type EditTeaValues,
} from '@/common/teaEditCard/schemas';
import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const logTea = async (values: EditTeaValues) => {
    const t = await getTranslations('EditTeaAction');
    const logTeaSchema = createEditTeaSchema(t);

    const parsedData = logTeaSchema.safeParse(values);

    if (!parsedData.success) {
        return {
            errors: z.flattenError(parsedData.error),
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
