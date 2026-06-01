import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import TeaList from './teaList';

const Teas = async () => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    }

    const teas = await prisma.tea.findMany({
        where: {
            userId: userId,
        },
    });

    return (
        <>
            <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
                <h1 className='text-2xl font-bold'>Teas collection</h1>
                <TeaList teas={teas} />
            </div>
        </>
    );
};

export default Teas;
