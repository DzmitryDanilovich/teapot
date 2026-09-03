import { redirect } from '@/i18n/redirect';
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

vi.mock('@/i18n/redirect', () => ({
    redirect: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);

vi.mock('next-intl/server', () => ({
    getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

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
            expectedError: 'nameIsRequired',
        },
        {
            inputField: 'type',
            inputData: {
                name: 'Green Tea',
                origin: 'China',
                storeUrl: '',
            },
            expectedError: 'validTypeIsRequired',
        },
        {
            inputField: 'storeUrl',
            inputData: {
                name: 'Green Tea',
                type: 'green',
                origin: 'China',
                storeUrl: 'invalid-url',
            },
            expectedError: 'storeUrlMustBeValid',
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
