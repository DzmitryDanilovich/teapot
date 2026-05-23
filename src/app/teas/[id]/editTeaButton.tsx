'use client';
import { redirect } from 'next/navigation';

interface Props {
    teaId: string;
}

const EditButton = ({ teaId }: Props) => {
    const handleEdit = async () => {
        redirect(`/teas/${teaId}/edit`);
    };

    return <button onClick={handleEdit}>Edit</button>;
};

export default EditButton;
