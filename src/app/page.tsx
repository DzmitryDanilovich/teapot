import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-8 p-8'>
            <Button asChild className='max-w-sm min-w-sm'>
                <Link href='/teas'>Go to Teas</Link>
            </Button>
            <Button asChild className='max-w-sm min-w-sm'>
                <Link href='/log'>Log</Link>
            </Button>
        </div>
    );
};

export default Home;
