import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

import LanguageSelector from './languageSelector';
import LogOutButton from './logOutButton';
import ThemeSelector from './themeSelector';

interface Props {
    isAuthenticated: boolean;
}

const NavigationMenuComponent = ({ isAuthenticated }: Props) => {
    const t = useTranslations('LogIn');

    return (
        <header className='flex h-16 items-center justify-between border-b px-6'>
            <Button asChild variant='ghost'>
                <Link href='/'>Teapot</Link>
            </Button>

            <div className='flex gap-4'>
                <ThemeSelector />
                <LanguageSelector />
                {isAuthenticated ? (
                    <LogOutButton />
                ) : (
                    <Button asChild>
                        <Link href='/login'>{t('logIn')}</Link>
                    </Button>
                )}
            </div>
        </header>
    );
};

export default NavigationMenuComponent;
