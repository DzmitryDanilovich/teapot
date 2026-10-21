'use server';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import {
    createEditTeaSchema,
    EditTeaValues,
} from '@/common/teaEditCard/schemas';
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

export const editTea = async (teaId: string, values: EditTeaValues) => {
    const t = await getTranslations('EditTeaAction');
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

    const parsedData = editTeaSchema.safeParse(values);

    if (!parsedData.success) {
        return {
            errors: z.flattenError(parsedData.error),
        };
    }

    await prisma.tea.update({
        where: { id: teaId },
        data: {
            ...parsedData.data,
        },
    });

    return await redirect(`/teas/${teaId}`);
};
