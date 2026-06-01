import { notFound, redirect } from 'next/navigation';

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
    redirect: vi.fn(),
    notFound: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);
const mockNotFound = vi.mocked(notFound);

beforeAll(() => {
    mockTeaFindUnique.mockResolvedValueOnce(getStubTea());
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
    const getEditedTeaFormData = () => {
        const formData = new FormData();
        formData.append('name', 'Green Tea Updated');
        formData.append('type', 'green');
        formData.append('origin', 'China');
        formData.append('storeUrl', 'https://example.com/green-tea');
        return formData;
    };

    it('should edit tea successfully with valid data', async () => {
        // arrange
        const formData = getEditedTeaFormData();

        // act
        await editTea(stubTeaId, null, formData);

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
        const formData = getEditedTeaFormData();
        formData.append('storeUrl', 'https://example.com/green-tea');

        // act
        await editTea(stubTeaId, null, formData);

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
            const result = await editTea(stubTeaId, null, formData);

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

        const formData = getEditedTeaFormData();

        // act
        await editTea(stubTeaId, null, formData);

        // assert
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('should return not found if tea does not exist or does not belong to user', async () => {
        // arrange
        mockGetSession.mockResolvedValueOnce({
            user: { id: 'wrong-user-id' },
        } as any);
        mockTeaFindUnique.mockResolvedValueOnce(null);

        const formData = getEditedTeaFormData();

        // act
        await editTea(stubTeaId, null, formData);

        // assert
        expect(mockNotFound).toHaveBeenCalled();
    });
});
