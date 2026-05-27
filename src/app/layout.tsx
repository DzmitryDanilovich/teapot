import { Montserrat } from 'next/font/google';
import './globals.css';
import { getSession } from '@/lib/session';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import NavigationMenuComponent from './navigationMenu';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getSession();
    const isAuthenticated = !!session;

    return (
        <html
            lang='en'
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
                    <NavigationMenuComponent
                        isAuthenticated={isAuthenticated}
                    />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
