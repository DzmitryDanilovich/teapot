'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const GoogleAuth = () => {
    const t = useTranslations('LogIn');

    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        setIsPending(true);
        setError(null);

        const result = await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/',
        });

        if (result.error) {
            setError(
                result.error.message ||
                    t('errorDuringLoginWith', { provider: 'Google' }),
            );
        }

        setIsPending(false);
    };

    return (
        <>
            {error && (
                <p role='alert' className='text-destructive mb-4 text-sm'>
                    {error}
                </p>
            )}
            <Button
                disabled={isPending}
                type='button'
                onClick={() => void handleClick()}
            >
                {t('logInWith', { provider: 'Google' })}
            </Button>
        </>
    );
};

export default GoogleAuth;
