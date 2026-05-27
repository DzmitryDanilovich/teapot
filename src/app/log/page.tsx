import TeaEditCard from '@/components/teaEditCard';
import { logTea } from './actions';

const Log = async () => {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-8 p-8'>
            <TeaEditCard title='Log Tea' initialState={null} action={logTea} />
        </div>
    );
};

export default Log;
