'use client';

import { Languages } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type Language = (typeof routing.locales)[number];

const languageNames: Record<Language, string> = {
    en: 'English',
    pl: 'Polski',
    be: 'Беларуская',
    ru: 'Русский',
};

const LanguageSelector = () => {
    const t = useTranslations('Language');

    const language = useLocale();

    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (locale: Language) => {
        router.replace(pathname, { locale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    <Languages className='h-4 w-4' />
                    {t('language')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
                <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    // @ts-expect-error the type is always Language, but the shadcn component hardcodes string
                    onValueChange={changeLanguage}
                    value={language}
                >
                    {routing.locales.map((locale) => (
                        <DropdownMenuRadioItem key={locale} value={locale}>
                            <span className='flex items-center gap-2'>
                                <span>{languageNames[locale]}</span>
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;
