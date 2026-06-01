import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { logTea } from './actions';

vi.mock('@/lib/session', () => ({
    getSession: vi.fn().mockResolvedValue({
        user: { id: 'user-id' },
    }),
}));

const mockGetSession = vi.mocked(getSession);

vi.mock('@/lib/prisma', () => ({
    default: {
        tea: {
            create: vi.fn().mockResolvedValue({}),
        },
    },
}));

const mockTeaCreate = vi.mocked(prisma.tea.create);

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);

describe('logTea action', () => {
    it('should log valid tea data', async () => {
        // arrange
        const formData = new FormData();
        formData.append('name', 'Green Tea');
        formData.append('type', 'green');
        formData.append('origin', 'China');
        formData.append('storeUrl', 'https://example.com/green-tea');

        // act
        await logTea(null, formData);

        // assert
        expect(mockTeaCreate).toHaveBeenCalledWith({
            data: {
                name: 'Green Tea',
                type: 'green',
                origin: 'China',
                storeUrl: 'https://example.com/green-tea',
                userId: 'user-id',
            },
        });
    });

    it('should redirect to /teas after logging tea', async () => {
        // arrange
        const formData = new FormData();
        formData.append('name', 'Green Tea');
        formData.append('type', 'green');
        formData.append('origin', 'China');
        formData.append('storeUrl', 'https://example.com/green-tea');

        // act
        await logTea(null, formData);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/teas');
    });

    it.each([
        {
            inputField: 'name',
            inputData: {
                type: 'green',
                origin: 'China',
                storeUrl: 'https://example.com/green-tea',
            },
            expectedError: 'Name is required',
        },
        {
            inputField: 'type',
            inputData: {
                name: 'Green Tea',
                origin: 'China',
                storeUrl: '',
            },
            expectedError: 'Valid type is required',
        },
        {
            inputField: 'storeUrl',
            inputData: {
                name: 'Green Tea',
                type: 'green',
                origin: 'China',
                storeUrl: 'invalid-url',
            },
            expectedError: 'Store URL must be a valid URL',
        },
    ])(
        `should return validation errors for invalid $inputField data`,
        async ({ inputField, inputData, expectedError }) => {
            // arrange
            const formData = new FormData();
            formData.append('name', inputData.name || '');
            formData.append('type', inputData.type || '');
            formData.append('origin', inputData.origin || '');
            formData.append('storeUrl', inputData.storeUrl || '');

            // act
            const result = await logTea(null, formData);

            // assert
            expect(result).toEqual({
                errors: {
                    [inputField]: [expectedError],
                },
                values: expect.objectContaining(inputData),
            });
        },
    );

    it('should redirect to /login if user is not authenticated', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce(null);
        const formData = new FormData();
        formData.append('name', 'Green Tea');
        formData.append('type', 'green');
        formData.append('origin', 'China');
        formData.append('storeUrl', 'https://example.com/green-tea');

        // act
        await logTea(null, formData);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
});
