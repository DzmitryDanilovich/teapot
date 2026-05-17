'use client';

import { useActionState } from 'react';
import { logIn, LogInValues } from './actions';

const LogInForm = () => {
    const [state, formAction, isPending] = useActionState(
        logIn,
        { error: '', values: {} as LogInValues}
    );

    return (
        <>
            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <form action={formAction}>
                <label htmlFor='email'>Email:</label>
                <input type='email' id='email' name='email' defaultValue={state.values.email} required />

            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' name='password' defaultValue={state.values.password} required />

            <button disabled={isPending} type='submit'>Sign In</button>
            </form>
        </>
    );
};

export default LogInForm;