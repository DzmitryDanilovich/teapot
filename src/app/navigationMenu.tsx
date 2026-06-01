import Link from 'next/link';

import { Button } from '@/components/ui/button';

import LogOutButton from './logOutButton';

interface Props {
    isAuthenticated: boolean;
}

const NavigationMenuComponent = ({ isAuthenticated }: Props) => {
    return (
        <header className='flex h-16 items-center justify-between border-b px-6'>
            <Button asChild variant='ghost'>
                <Link href='/'>Teapot</Link>
            </Button>

            {isAuthenticated ? (
                <LogOutButton />
            ) : (
                <Button asChild>
                    <Link href='/login'>Log In</Link>
                </Button>
            )}
        </header>
    );
};

export default NavigationMenuComponent;
