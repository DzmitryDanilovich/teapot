'use server';

import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import { collectErrors } from '@/common/errorCollector';
import { Tea, TeaType } from '@/generated/prisma/browser';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const deleteTea = async (id: string) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
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

    redirect('/teas');
};

const editTeaSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(TeaType, 'Valid type is required'),
    origin: z.string().optional(),
    storeUrl: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.url('Store URL must be a valid URL').optional(),
    ),
});

type EditTeaValues = z.infer<typeof editTeaSchema>;

export const editTea = async (
    teaId: string,
    _previousState: unknown,
    formData: FormData,
) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
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

    redirect(`/teas/${teaId}`);
};
