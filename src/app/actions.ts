'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

export const logOffAction = async () => {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
    } catch (error: unknown) {
        return {
            error:
                (error as Error).message || 'An error occurred during log off',
        };
    }

    redirect('/login');
};
