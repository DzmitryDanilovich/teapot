'use client';

import { useTranslations } from 'next-intl';

import TeaEditCard from '@/components/teaEditCard';
import type { Tea } from '@/generated/prisma/browser';

import { editTea } from './actions';

interface Props {
    tea: Tea;
}

const EditTeaForm = ({ tea }: Props) => {
    const t = useTranslations('TeasPage');

    const boundEditTea = editTea.bind(null, tea.id);

    return (
        <TeaEditCard
            title={t('editTea')}
            initialState={{ values: tea, errors: {} }}
            action={boundEditTea}
        />
    );
};

export default EditTeaForm;
