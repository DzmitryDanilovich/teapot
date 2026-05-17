import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Teas = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = session?.user.id;

    if (!userId) {
        redirect('/login');
    };

    const teas = await prisma.tea.findMany({
        where: {
            userId: userId
        }
    });
    
    return (<>
        <h1>Teas Page</h1>
        <ul>
            {teas.map((tea) => (
                <li key={tea.id}>
                    <Link href={`/teas/${tea.id}`}>
                        {tea.name} ({tea.type}) - {tea.origin}
                    </Link>
                </li>
            ))}
        </ul>
    </>
    );
};

export default Teas;
