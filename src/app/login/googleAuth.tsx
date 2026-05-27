'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

const GoogleAuth = () => {
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
                    'An error occurred during Google sign-in',
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
            <Button disabled={isPending} type='button' onClick={handleClick}>
                Log In with Google
            </Button>
        </>
    );
};

export default GoogleAuth;
