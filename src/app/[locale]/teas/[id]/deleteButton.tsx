'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { deleteTea } from './actions';

interface Props {
    teaId: string;
}

const DeleteButton = ({ teaId }: Props) => {
    const t = useTranslations('Common');

    const handleDelete = () => {
        void deleteTea(teaId);
    };

    return (
        <Button variant='destructive' onClick={handleDelete}>
            {t('delete')}
        </Button>
    );
};

export default DeleteButton;
