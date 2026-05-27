'use server';

import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Tea } from '@/generated/prisma/browser';
import { collectErrors } from '@/common/errorCollector';

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
        redirect('/teas');
    }

    await prisma.tea.delete({
        where: { id },
    });

    redirect('/teas');
};

const editTeaSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
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

    await prisma.tea.update({
        where: { id: teaId },
        data: {
            ...parsedData.data,
        },
    });

    redirect(`/teas/${teaId}`);
};
