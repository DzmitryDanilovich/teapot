import { notFound } from 'next/navigation';

import { EditTeaValues } from '@/common/teaEditCard/schemas';
import { redirect } from '@/i18n/redirect';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { getStubTea, stubTeaId } from '@test/tea';

import { deleteTea, editTea } from './actions';

vi.mock('@/lib/session', () => ({
    getSession: vi.fn().mockResolvedValue({
        user: { id: 'cd49bde0-085e-44c5-8674-06e2815a4734' },
    }),
}));

const mockGetSession = vi.mocked(getSession);

vi.mock('@/lib/prisma', () => ({
    default: {
        tea: {
            delete: vi.fn().mockResolvedValue({}),
            update: vi.fn().mockResolvedValue({}),
            findUnique: vi.fn().mockResolvedValue({}),
        },
    },
}));

const mockTeaUpdate = vi.mocked(prisma.tea.update);
const mockTeaFindUnique = vi.mocked(prisma.tea.findUnique);

vi.mock('next/navigation', () => ({
    notFound: vi.fn(),
}));

vi.mock('@/i18n/redirect', () => ({
    redirect: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);
const mockNotFound = vi.mocked(notFound);

vi.mock('next-intl/server', () => ({
    getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

beforeEach(() => {
    mockTeaFindUnique.mockResolvedValue(getStubTea());
});

describe('deleteTea', () => {
    it('should delete tea successfully', async () => {
        // act
        await deleteTea(stubTeaId);

        // assert
        expect(prisma.tea.delete).toHaveBeenCalledWith({
            where: { id: stubTeaId },
        });
    });

    it('should redirect to /teas after deleting tea', async () => {
        // act
        await deleteTea(stubTeaId);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/teas');
    });

    it('should redirect to /login if user is not authenticated', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce(null);

        // act
        await deleteTea(stubTeaId);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('should return not found if tea does not exist or does not belong to user', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce({
            user: { id: 'wrong-user-id' },
        } as any);

        // act
        await deleteTea(stubTeaId);

        // assert
        expect(mockNotFound).toHaveBeenCalled();
    });
});

describe('editTea', () => {
    const getEditedTeaValues = (): EditTeaValues => ({
        name: 'Green Tea Updated',
        type: 'green',
        origin: 'China',
        storeUrl: 'https://example.com/green-tea',
    });

    it('should edit tea successfully with valid data', async () => {
        // arrange
        const values = getEditedTeaValues();

        // act
        await editTea(stubTeaId, values);

        // assert
        expect(mockTeaUpdate).toHaveBeenCalledWith({
            where: { id: stubTeaId },
            data: {
                name: 'Green Tea Updated',
                type: 'green',
                origin: 'China',
                storeUrl: 'https://example.com/green-tea',
            },
        });
    });

    it('should redirect to /teas after logging tea', async () => {
        // arrange
        const values = getEditedTeaValues();
        values.storeUrl = 'https://example.com/green-tea';

        // act
        await editTea(stubTeaId, values);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith(`/teas/${stubTeaId}`);
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
            const result = await editTea(stubTeaId, values);

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

        const values = getEditedTeaValues();

        // act
        await editTea(stubTeaId, values);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('should return not found if tea does not belong to user', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce({
            user: { id: 'wrong-user-id' },
        } as any);

        const values = getEditedTeaValues();

        // act
        await editTea(stubTeaId, values);

        // assert
        expect(mockNotFound).toHaveBeenCalled();
    });

    it('should return not found if tea does not exist', async () => {
        // arrange
        mockTeaFindUnique.mockResolvedValueOnce(null);

        const values = getEditedTeaValues();

        // act
        await editTea(stubTeaId, values);

        // assert
        expect(mockNotFound).toHaveBeenCalled();
    });
});
