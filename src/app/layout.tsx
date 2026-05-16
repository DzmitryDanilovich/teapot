import { headers } from 'next/headers';
import Link from 'next/link';
import { auth } from '@/lib/auth'
import LogOff from './logOff';

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
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