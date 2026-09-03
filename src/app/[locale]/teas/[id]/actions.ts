'use server';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { collectErrors } from '@/common/errorCollector';
import { Tea, TeaType } from '@/generated/prisma/browser';
import { redirect } from '@/i18n/redirect';
import { Translations } from '@/i18n/types';
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

const createEditTeaSchema = (t: Translations) =>
    z.object({
        name: z.string().min(1, t('nameIsRequired')),
        type: z.enum(TeaType, t('validTypeIsRequired')),
        origin: z.string().optional(),
        storeUrl: z.preprocess(
            (value) => (value === '' ? undefined : value),
            z.url(t('storeUrlMustBeValid')).optional(),
        ),
    });

type EditTeaValues = z.infer<ReturnType<typeof createEditTeaSchema>>;

export const editTea = async (
    teaId: string,
    _previousState: unknown,
    formData: FormData,
) => {
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

    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const parsedData = editTeaSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            errors: collectErrors<EditTeaValues>(parsedData.error.issues),
            values: rawData as Partial<Tea>,
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
