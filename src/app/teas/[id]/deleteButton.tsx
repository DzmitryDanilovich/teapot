'use client';

import { Button } from '@/components/ui/button';

import { deleteTea } from './actions';

interface Props {
    teaId: string;
}

const DeleteButton = ({ teaId }: Props) => {
    const handleDelete = () => {
        void deleteTea(teaId);
    };

    return (
        <Button variant='destructive' onClick={handleDelete}>
            Delete
        </Button>
    );
};

export default DeleteButton;
