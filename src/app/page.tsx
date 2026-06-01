import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Home = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
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
