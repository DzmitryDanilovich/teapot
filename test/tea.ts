import { EditTeaValues } from '@/common/teaEditCard/schemas';
import { Tea } from '@/generated/prisma/browser';

export const stubTeaId = 'e158b290-c4db-4057-97a6-00e00b94193d';

const stubTea: Tea = {
    id: stubTeaId,
    name: 'Green Tea',
    type: 'green',
    origin: 'China',
    storeUrl: 'https://example.com/green-tea',
    userId: 'cd49bde0-085e-44c5-8674-06e2815a4734',
    createdAt: new Date(),
};

export const getStubTea = (): Tea => ({ ...stubTea });

export const getStubTeaValues = (): EditTeaValues => ({
    name: stubTea.name,
    type: stubTea.type!,
    origin: stubTea.origin ?? undefined,
    storeUrl: stubTea.storeUrl ?? undefined,
});
