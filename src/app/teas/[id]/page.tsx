import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Props {
    params: Promise<{ id: string }>;
}

const Tea = async ({ params }: Props) => {
    const { id } = await params;
    const tea = await prisma.tea.findUnique({
        where: { id },
    });

    if (!tea) {
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
