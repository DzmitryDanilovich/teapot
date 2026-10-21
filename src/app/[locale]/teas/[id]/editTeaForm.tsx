'use client';

import { useTranslations } from 'next-intl';

import TeaEditCard from '@/common/teaEditCard';
import { EditTeaValues } from '@/common/teaEditCard/schemas';
import type { Tea } from '@/generated/prisma/browser';

import { editTea } from './actions';

interface Props {
    tea: Tea;
}

const EditTeaForm = ({ tea }: Props) => {
    const t = useTranslations('TeasPage');

    const boundEditTea = editTea.bind(null, tea.id);

    const values: Partial<EditTeaValues> = {
        name: tea.name,
        type: tea.type ?? undefined,
        origin: tea.origin ?? undefined,
        storeUrl: tea.storeUrl ?? undefined,
    };

    return (
        <TeaEditCard
            title={t('editTea')}
            values={values}
            action={boundEditTea}
        />
    );
};

export default EditTeaForm;
