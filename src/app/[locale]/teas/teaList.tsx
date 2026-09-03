import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import { Tea } from '@/generated/prisma/browser';
import { Link } from '@/i18n/navigation';

interface Props {
    teas: Tea[];
}

const TeaList = ({ teas }: Props) => {
    const t = useTranslations('TeasPage');

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
                                    {t('viewDetails')}
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
