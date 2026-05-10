import Link from "next/link";
import prisma from "@/lib/prisma";

const Teas = async () => {
    const teas = await prisma.tea.findMany();
    
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
