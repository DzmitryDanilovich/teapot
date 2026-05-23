'use server';

import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { Tea } from '@/generated/prisma/browser';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

const editTeaSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    origin: z.string().optional(),
    storeUrl: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.url('Store URL must be a valid URL').optional()
    ),  
});

export const editTea = async (teaId: string, previousState: { error: string }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const parsedData = editTeaSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
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