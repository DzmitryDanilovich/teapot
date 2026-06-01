import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import { Tea } from '@/generated/prisma/browser';

interface Props {
    teas: Tea[];
}

const TeaList = ({ teas }: Props) => {
    return (
        <ul className='flex w-full max-w-md flex-col gap-4'>
            {teas.map((tea) => (
                <li key={tea.id}>
                    <Item variant='outline'>
                        <ItemContent>
                            <ItemTitle>{tea.name}</ItemTitle>
                            <ItemDescription>
                                {tea.type} - {tea.origin}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Button asChild variant='outline'>
                                <Link href={`/teas/${tea.id}`}>
                                    View Details
                                </Link>
                            </Button>
                        </ItemActions>
                    </Item>
                </li>
            ))}
        </ul>
    );
};

export default TeaList;
