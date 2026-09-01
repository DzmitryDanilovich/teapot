'use client';

import { SunMoon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const ThemeSelector = () => {
    const t = useTranslations('Theme');

    const { resolvedTheme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <Button
            aria-label={t('toggleTheme')}
            variant='outline'
            onClick={toggleTheme}
        >
            <SunMoon className='h-4 w-4' />
        </Button>
    );
};

export default ThemeSelector;
