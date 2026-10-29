import { TeaType } from '@/generated/prisma/browser';

export const isTeaType = (value: unknown): value is TeaType => {
    return Object.values(TeaType).includes(value as TeaType);
};
