import { notFound, redirect } from 'next/navigation';

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
        redirect('/login');
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
