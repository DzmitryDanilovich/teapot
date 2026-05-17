import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Props {
    params: Promise<{ id: string }>;
}

const Tea = async ({ params }: Props) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

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
            <h1>Tea Page: {id}</h1>
            <p>Name: {tea.name}</p>
            <p>Type: {tea.type}</p>
            <p>Origin: {tea.origin}</p>
        </>
    )
};

export default Tea;
