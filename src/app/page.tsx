import Link from "next/link";

const Home = () => {
    return (
        <>
            <Link href="/teas">Go to Teas</Link>
            <br></br>
            <Link href="/log">Log</Link>
        </>
    );
}

export default Home;