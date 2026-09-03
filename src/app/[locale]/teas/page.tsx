import { getTranslations } from 'next-intl/server';

import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import TeaList from './teaList';

const Teas = async () => {
    const t = await getTranslations('TeasPage');

    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        return await redirect('/login');
    }

    const teas = await prisma.tea.findMany({
        where: {
            userId: userId,
        },
    });

    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <h1 className='text-2xl font-bold'>{t('teasCollection')}</h1>
            <TeaList teas={teas} />
        </div>
    );
};

export default Teas;
