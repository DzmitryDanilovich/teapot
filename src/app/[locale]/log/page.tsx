import { useTranslations } from 'next-intl';

import TeaEditCard from '@/components/teaEditCard';

import { logTea } from './actions';

const Log = () => {
    const t = useTranslations('LogPage');

    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <TeaEditCard
                title={t('logTea')}
                initialState={null}
                action={logTea}
            />
        </div>
    );
};

export default Log;
