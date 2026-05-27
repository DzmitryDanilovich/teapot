import type { z } from 'zod';

export type Errors<T> = {
    [K in keyof T | 'form']?: string[];
};

export const collectErrors = <T>(issues: z.core.$ZodIssue[]): Errors<T> => {
    return issues.reduce<Errors<T>>((acc, issue) => {
        const field = issue.path[0] as keyof T;

        if (!acc[field]) {
            acc[field] = [];
        }

        if (field) {
            acc[field].push(issue.message);
            return acc;
        }

        if (!acc.form) {
            acc.form = [];
        }

        acc.form.push(issue.message);
        return acc;
    }, {});
};
