'use client';

import type { Tea } from '@/generated/prisma/browser';
import { editTea } from './actions';
import TeaEditCard from '@/components/teaEditCard';

interface Props {
    tea: Tea;
}

const EditTeaForm = ({ tea }: Props) => {
    const boundEditTea = editTea.bind(null, tea.id);

    return (
        <TeaEditCard
            title='Edit Tea'
            initialState={{ values: tea, errors: {} }}
            action={boundEditTea}
        />
    );
};

export default EditTeaForm;
