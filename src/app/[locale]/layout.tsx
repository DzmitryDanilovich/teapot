import './globals.css';

import { Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { getSession } from '@/lib/session';
import { cn } from '@/lib/utils';

import NavigationMenuComponent from './navigationMenu';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

const RootLayout = async ({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) => {
    const session = await getSession();
    const isAuthenticated = !!session;

    const locale = (await params).locale || routing.defaultLocale;
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            className={cn('font-sans', montserrat.variable)}
            suppressHydrationWarning
        >
            <body className='flex min-h-screen flex-col'>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages}>
                        <NavigationMenuComponent
                            isAuthenticated={isAuthenticated}
                        />
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
