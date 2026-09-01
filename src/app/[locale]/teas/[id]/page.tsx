import { notFound } from 'next/navigation';

import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import TeaCard from './teaCard';

interface Props {
    params: Promise<{ id: string }>;
}

const Tea = async ({ params }: Props) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    const { id } = await params;
    const tea = await prisma.tea.findUnique({
        where: { id },
    });

    if (!tea || tea.userId !== userId) {
        notFound();
    }

    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <TeaCard tea={tea} />
        </div>
    );
};

export default Tea;
