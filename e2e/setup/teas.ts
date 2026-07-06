import { TeaType } from '@/generated/prisma/client';

export const SEED_TEA: {
    name: string;
    type: TeaType;
    origin: string;
    storeUrl: string;
} = {
    name: 'Green Tea',
    type: 'green',
    origin: 'China',
    storeUrl: 'https://www.example.com/green-tea',
};

export const EDITABLE_TEA: {
    name: string;
    type: TeaType;
    origin: string;
    storeUrl: string;
} = {
    name: 'Oolong Tea',
    type: 'oolong',
    origin: 'Taiwan',
    storeUrl: 'https://www.example.com/oolong-tea',
};

export const DELETABLE_TEA: {
    name: string;
    type: TeaType;
    origin: string;
    storeUrl: string;
} = {
    name: 'Black Tea',
    type: 'black',
    origin: 'India',
    storeUrl: 'https://www.example.com/black-tea',
};
