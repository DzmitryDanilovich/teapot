'use server';

import { parseWithZod } from '@conform-to/zod/v4';
import { getTranslations } from 'next-intl/server';

import { createEditTeaSchema } from '@/common/teaEditCard/schemas';
import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const logTea = async (_previousState: unknown, formData: FormData) => {
    const t = await getTranslations('EditTeaForm');
    const logTeaSchema = createEditTeaSchema(t);

    const submission = parseWithZod(formData, { schema: logTeaSchema });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    await prisma.tea.create({
        data: {
            ...submission.value,
            userId,
        },
    });

    return await redirect('/teas');
};
