'use client';

import { deleteTea } from "./actions";

interface DeleteButtonProps {
    teaId: string;
}

const DeleteButton = ({ teaId }: DeleteButtonProps) => {
    const handleDelete = async () => {
        await deleteTea(teaId);
    };

    return (
        <button onClick={handleDelete}>Delete</button>
    );
};

export default DeleteButton;