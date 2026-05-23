import prisma from '@/lib/prisma';
import EditTeaForm from './editTeaForm';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

interface Props {
    params: Promise<{ id: string }>;
}

const EditTeaPage = async ({ params }: Props) => {
    const { id } = await params;

    const session = await getSession();
    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    }

    const tea = await prisma.tea.findUnique({
        where: { id },
    });

    if (!tea || tea.userId !== userId) {
        notFound();
    }

    return (
        <>
            <h1>Edit Page</h1>
            <EditTeaForm tea={tea} />
        </>
    );
};


export default EditTeaPage;