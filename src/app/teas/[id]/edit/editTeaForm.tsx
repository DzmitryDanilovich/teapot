'use client';
import { useActionState } from "react";
import type { Tea } from "@/generated/prisma/browser";
import { editTea } from "./actions";

interface Props {
    tea: Tea;
};

const EditTeaForm = ({ tea }: Props) => {
    const boundEditTea = editTea.bind(null, tea.id);

    const [state, formAction, isPending] = useActionState(boundEditTea, { error: '', values: tea});
    const type = state.values?.type ? state.values.type.toLowerCase() : '';

    return (
        <>
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
                <button disabled={isPending} type='submit'>Edit Tea</button>
            </form>
        </>
    );
};

export default EditTeaForm;
