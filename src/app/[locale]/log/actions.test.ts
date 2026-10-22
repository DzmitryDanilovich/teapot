import type { EditTeaValues } from '@/common/teaEditCard/schemas';
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
        const values: EditTeaValues = {
            name: 'Green Tea',
            type: 'green',
            origin: 'China',
            storeUrl: 'https://example.com/green-tea',
        };

        // act
        await logTea(values);

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
        const values: EditTeaValues = {
            name: 'Green Tea',
            type: 'green',
            origin: 'China',
            storeUrl: 'https://example.com/green-tea',
        };

        // act
        await logTea(values);

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
            const values: EditTeaValues = {
                name: inputData.name || '',
                type: (inputData.type || '') as EditTeaValues['type'],
                origin: inputData.origin || '',
                storeUrl: inputData.storeUrl || '',
            };

            // act
            const result = await logTea(values);

            // assert
            expect(result).toEqual({
                errors: {
                    fieldErrors: {
                        [inputField]: [expectedError],
                    },
                    formErrors: [],
                },
            });
        },
    );

    it('should redirect to /login if user is not authenticated', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce(null);
        const values: EditTeaValues = {
            name: 'Green Tea',
            type: 'green',
            origin: 'China',
            storeUrl: 'https://example.com/green-tea',
        };

        // act
        await logTea(values);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
});
