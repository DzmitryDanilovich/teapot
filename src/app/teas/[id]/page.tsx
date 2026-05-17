import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { deleteTea } from "./actions";
import DeleteButton from "./deleteButton";

interface Props {
    params: Promise<{ id: string }>;
}

const Tea = async ({ params }: Props) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    };

    const { id } = await params;
    const tea = await prisma.tea.findUnique({
        where: { id },
    });

    if (!tea || tea.userId !== userId) {
        notFound();
    }

    return (
        <>
            <h1>Tea Page</h1>
            <p>Name: {tea.name}</p>
            <p>Type: {tea.type}</p>
            {tea.origin && <p>Origin: {tea.origin}</p>}
            {tea.storeUrl && (
                <p>
                    Store URL: <a href={tea.storeUrl} target="_blank" rel="noopener noreferrer">{tea.storeUrl}</a>
                </p>
            )}
            <p>Logged date: {tea.createdAt.toLocaleDateString()}</p>
            <DeleteButton teaId={tea.id} />
        </>
    )
};

export default Tea;
