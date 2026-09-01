'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tea } from '@/generated/prisma/browser';

import DeleteButton from './deleteButton';

interface Props {
    tea: Tea;
    onEdit: () => void;
}

const ShowTeaCard = ({ tea, onEdit }: Props) => {
    const tTea = useTranslations('Tea');
    const tCommon = useTranslations('Common');

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{tea.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className='grid grid-cols-2 gap-4'>
                    <dt>{tTea('type')}:</dt>{' '}
                    <dd data-testid='tea-type'>{tea.type}</dd>
                    {tea.origin && (
                        <>
                            <dt>{tTea('origin')}:</dt>
                            <dd data-testid='tea-origin'>{tea.origin}</dd>
                        </>
                    )}
                    {tea.storeUrl && (
                        <>
                            <dt>{tTea('storeUrl')}:</dt>
                            <dd data-testid='tea-store-url'>
                                <a
                                    className='text-gray-400 hover:underline'
                                    href={tea.storeUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {tea.storeUrl}
                                </a>
                            </dd>
                        </>
                    )}
                    <dt>{tTea('loggedDate')}:</dt>
                    <dd>{format(new Date(tea.createdAt), 'dd.MM.yyyy')}</dd>
                </dl>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
                <Button variant='outline' onClick={onEdit}>
                    {tCommon('edit')}
                </Button>
                <DeleteButton teaId={tea.id} />
            </CardFooter>
        </Card>
    );
};

export default ShowTeaCard;
