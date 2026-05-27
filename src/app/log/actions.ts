'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Tea } from '@/generated/prisma/browser';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { collectErrors } from '@/common/errorCollector';

const logTeaSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    origin: z.string().optional(),
    storeUrl: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.url('Store URL must be a valid URL').optional(),
    ),
});

type LogTeaValues = z.infer<typeof logTeaSchema>;

export const logTea = async (_previousState: unknown, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const parsedData = logTeaSchema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            errors: collectErrors<LogTeaValues>(parsedData.error.issues),
            values: rawData as Partial<Tea>,
        };
    }

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    }

    await prisma.tea.create({
        data: {
            ...parsedData.data,
            userId,
        },
    });

    redirect('/teas');
};
