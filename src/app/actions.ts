'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Tea } from '@/generated/prisma/browser';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export interface LogInValues {
    email: string;
    password: string;
};

export interface SignUpValues extends LogInValues {
    name: string;
};

export const logIn = async (previousState: { error: string; values: LogInValues }, formData: FormData) => {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const schema = z.object({
        email: z.email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    });

    const parsedData = schema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
            values: rawData as LogInValues,
        };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email: parsedData.data.email,
                password: parsedData.data.password,
            },
        });
    } catch (error: unknown) {
        return {
            error: (error as Error).message || 'An error occurred during login',
            values: rawData as LogInValues,
        };
    }

    redirect('/'); 
};

export const signUp = async (previousState: { error: string; values: SignUpValues }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.email('Invalid email address'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/\d/, 'Password must contain at least one number')
            .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    });

    const parsedData = schema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
            values: rawData as SignUpValues,
        };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name:  parsedData.data.name,
                email: parsedData.data.email,
                password: parsedData.data.password,
            },
        });
    } catch (error: unknown) {
        return {
            error: (error as Error).message || 'An error occurred during signup',
            values: rawData as SignUpValues,
        };
    }

    redirect('/'); 
};

export const logOffAction = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        });
    } catch (error: unknown) {
        return { error: (error as Error).message || 'An error occurred during log off' };
    }

    redirect('/login');
};

export const logTea = async (previousState: { error: string }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        origin: formData.get('origin'),
        storeUrl: formData.get('storeUrl'),
    };

    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        type: z.string().min(1, 'Type is required'),
        origin: z.string().optional(),
        storeUrl: z.url('Store URL must be a valid URL').optional(),
    });

    const parsedData = schema.safeParse(rawData);

    if (!parsedData.success) {
        return {
            error: parsedData.error.issues.map((issue) => issue.message).join(', '),
            values: rawData as Partial<Tea>,
        };
    }

    await prisma.tea.create({
        data: parsedData.data,
    });

    redirect('/teas');
};