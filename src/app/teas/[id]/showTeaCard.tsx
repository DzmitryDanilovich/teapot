'use client';

import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tea } from '@/generated/prisma/browser';
import DeleteButton from './deleteButton';
import { Button } from '@/components/ui/button';

interface Props {
    tea: Tea;
    onEdit: () => void;
}

const ShowTeaCard = ({ tea, onEdit }: Props) => {
    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>{tea.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                    <p>Type:</p> <p>{tea.type}</p>
                    {tea.origin && (
                        <>
                            <p>Origin:</p>
                            <p>{tea.origin}</p>
                        </>
                    )}
                    {tea.storeUrl && (
                        <>
                            <p>Store URL:</p>
                            <a
                                className='text-gray-400 hover:underline'
                                href={tea.storeUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {tea.storeUrl}
                            </a>
                        </>
                    )}
                    <p>Logged date:</p>{' '}
                    <p>{format(new Date(tea.createdAt), 'dd.MM.yyyy')}</p>
                </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
                <Button variant='outline' onClick={onEdit}>
                    Edit
                </Button>
                <DeleteButton teaId={tea.id} />
            </CardFooter>
        </Card>
    );
};

export default ShowTeaCard;
