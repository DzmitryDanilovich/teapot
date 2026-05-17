'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Tea } from '@/generated/prisma/browser';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

const logTeaSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    origin: z.string().optional(),
    storeUrl: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.url('Store URL must be a valid URL').optional()
    ),
});

export const logTea = async (previousState: { error: string }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const parsedData = logTeaSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
            values: rawData as Partial<Tea>,
        };
    }

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return {
            error: 'User not authenticated',
            values: rawData as Partial<Tea>,
        };
    }

    await prisma.tea.create({
        data: {
            ...parsedData.data,
            userId,
        },
    });

    redirect('/teas');
};