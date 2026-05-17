'use server'

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export const deleteTea = async (id: string) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    };

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
