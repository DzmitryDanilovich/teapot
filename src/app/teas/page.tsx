import Link from "next/link";
import teas from "@/lib/teas";

const Teas = () => (
    <>
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

export default Teas;
