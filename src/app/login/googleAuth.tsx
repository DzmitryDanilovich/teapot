'use client'
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

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
            setError(result.error.message || 'An error occurred during Google sign-in');
        }

        setIsPending(false);

    };

    return (
        <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                disabled={isPending}
                type='button'
                onClick={handleClick}>
                    Log In with Google
            </button>
        </>
    );
};

export default GoogleAuth;