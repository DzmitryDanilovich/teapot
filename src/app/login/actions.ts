'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';

export interface LogInValues {
    email: string;
    password: string;
};

export interface SignUpValues extends LogInValues {
    name: string;
};

const logInSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const logIn = async (previousState: { error: string; values: LogInValues }, formData: FormData) => {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsedData = logInSchema.safeParse(rawData);

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

const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
});

export const signUp = async (previousState: { error: string; values: SignUpValues }, formData: FormData) => {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const parsedData = signUpSchema.safeParse(rawData);

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
