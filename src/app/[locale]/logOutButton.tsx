'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';

import { logOffAction } from './actions';

const LogOutButton = () => {
    const t = useTranslations('LogIn');

    const [state, action, isPending] = useActionState(logOffAction, {
        error: '',
    });

    return (
        <>
            {state.error && (
                <p className='text-destructive mb-4 text-sm'>{state.error}</p>
            )}
            <form action={action}>
                <Button variant='outline' disabled={isPending} type='submit'>
                    {t('logOut')}
                </Button>
            </form>
        </>
    );
};

export default LogOutButton;
