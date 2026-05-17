'use client';
import { useActionState } from 'react';
import { signUp, SignUpValues } from './actions';

const SignUpForm = () => {
    const [state, formAction, isPending] = useActionState(
        signUp,
        { error: '', values: {} as SignUpValues}
    );

    return (
        <>
            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <form action={formAction}>
                <label htmlFor='name'>Name:</label>
                <input type='text' id='name' name='name' defaultValue={state.values.name} required />

                <label htmlFor='email'>Email:</label>
                <input type='email' id='email' name='email' defaultValue={state.values.email} required />

                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' defaultValue={state.values.password} required />

                <button disabled={isPending} type='submit'>Sign Up</button>
            </form>
        </>
    );
};

export default SignUpForm;