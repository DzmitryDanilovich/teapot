import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

const Home = () => {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <Button asChild className='max-w-sm min-w-sm'>
                <Link href='/teas'>{t('goToTeas')}</Link>
            </Button>
            <Button asChild className='max-w-sm min-w-sm'>
                <Link href='/log'>{t('log')}</Link>
            </Button>
        </div>
    );
};

export default Home;
