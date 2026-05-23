'use client';
import { deleteTea } from './actions';

interface Props {
    teaId: string;
}

const DeleteButton = ({ teaId }: Props) => {
    const handleDelete = async () => {
        await deleteTea(teaId);
    };

    return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteButton;
