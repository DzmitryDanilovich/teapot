import Link from 'next/link';
import LogOff from './logOff';
import { getSession } from '@/lib/session';

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getSession();
    const isAuthenticated = !!session;

    return (
        <html lang="en">
            <body>
                <Link href="/">Home</Link>
                <div>
                    {isAuthenticated ? (
                        <LogOff/>
                    ) : (
                        <Link href="/login">Log In</Link>
                    )}
                </div>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;