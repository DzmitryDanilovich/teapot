'use client';
import { useActionState } from "react";
import { logOffAction } from "./actions";

const LogOff = () => {
    const [state, action, isPending] = useActionState(logOffAction, { error: '' });

    return (
        <>
            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <form action={action}>
                <button disabled={isPending} type='submit'>Log Off</button>
            </form>
        </>
    );
}

export default LogOff;