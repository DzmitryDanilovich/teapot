'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';

import { logOffAction } from './actions';

const LogOutButton = () => {
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
                    Log Out
                </Button>
            </form>
        </>
    );
};

export default LogOutButton;
