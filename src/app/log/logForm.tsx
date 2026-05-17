'use client';

import { useActionState } from 'react';
import { logTea } from './actions';
import { Tea } from '@/generated/prisma/browser';

const LogForm = () => {
    const [state, formAction, isPending] = useActionState(logTea, { error: '', values: {} as Partial<Tea>});
    const type = state.values?.type ? state.values.type.toLowerCase() : '';

    return (
        <>
            <h1>Log Page</h1>
            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <form action={formAction}>
                <input type='text' name='name' defaultValue={state.values?.name} placeholder='Tea Name' />
                <select name='type' defaultValue={type} key={type} required>
                    <option value=''></option>
                    <option value='green'>Green</option>
                    <option value='black'>Black</option>
                    <option value='oolong'>Oolong</option>
                    <option value='white'>White</option>
                    <option value='pu-erh'>Pu-erh</option>
                </select>
                <input type='text' name='origin' defaultValue={state.values?.origin || ''} placeholder='Tea Origin' />
                <input type='text' name='storeUrl' defaultValue={state.values?.storeUrl || ''} placeholder='Store URL' />
                <button disabled={isPending} type='submit'>Log Tea</button>
            </form>
        </>
    )
};

export default LogForm;
