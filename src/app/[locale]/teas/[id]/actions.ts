'use server';

import { parseWithZod } from '@conform-to/zod/v4';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createEditTeaSchema } from '@/common/teaEditCard/schemas';
import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const deleteTea = async (id: string) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    const tea = await prisma.tea.findUnique({
        where: { id },
    });

    if (!tea || tea.userId !== userId) {
        notFound();
    }

    await prisma.tea.delete({
        where: { id },
    });

    return await redirect('/teas');
};

export const editTea = async (
    teaId: string,
    _previousState: unknown,
    formData: FormData,
) => {
    const t = await getTranslations('EditTeaForm');
    const editTeaSchema = createEditTeaSchema(t);

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    const tea = await prisma.tea.findUnique({
        where: { id: teaId },
    });

    if (!tea || tea.userId !== userId) {
        notFound();
    }

    const submission = parseWithZod(formData, { schema: editTeaSchema });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    await prisma.tea.update({
        where: { id: teaId },
        data: {
            ...submission.value,
        },
    });

    return await redirect(`/teas/${teaId}`);
};
