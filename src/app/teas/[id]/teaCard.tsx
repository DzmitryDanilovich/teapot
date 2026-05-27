'use client';

import { useState } from 'react';
import { Tea } from '@/generated/prisma/browser';
import EditTeaForm from './editTeaForm';
import ShowTeaCard from './showTeaCard';

interface Props {
    tea: Tea;
}

const TeaCard = ({ tea }: Props) => {
    const [isEditMode, setIsEditMode] = useState(false);

    return isEditMode ? (
        <EditTeaForm tea={tea} />
    ) : (
        <ShowTeaCard tea={tea} onEdit={() => setIsEditMode(true)} />
    );
};

export default TeaCard;
