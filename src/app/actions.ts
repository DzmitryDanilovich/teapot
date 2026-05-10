'use server';

import { Tea } from '@/generated/prisma/browser';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const logTea = async (initialState: { error: string }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        type: z.string().min(1, 'Type is required'),
        origin: z.string().optional(),
        storeUrl: z.url('Store URL must be a valid URL').optional(),
    });

    const parsedData = schema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
            values: rawData as Partial<Tea>,
        };
    }

    await prisma.tea.create({
        data: parsedData.data,
    });

    redirect('/teas');
};