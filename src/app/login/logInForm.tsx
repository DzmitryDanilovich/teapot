'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { logIn } from './actions';

const LogInForm = () => {
    const [state, formAction, isPending] = useActionState(logIn, null);

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>Log In</CardTitle>
            </CardHeader>
            <CardContent>
                {state?.errors.form && (
                    <p role='alert' className='text-destructive mb-4 text-sm'>
                        {state.errors.form.join('; ')}
                    </p>
                )}
                <form id='loginForm' action={formAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='email'>Email</FieldLabel>
                            <Input
                                type='email'
                                id='email'
                                name='email'
                                defaultValue={state?.values.email}
                                required
                            />
                            <FieldError
                                errors={state?.errors.email?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor='password'>Password</FieldLabel>
                            <Input
                                type='password'
                                id='password'
                                name='password'
                                defaultValue={state?.values.password}
                                required
                            />
                            <FieldError
                                errors={state?.errors.password?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button disabled={isPending} type='submit' form='loginForm'>
                    Log In
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LogInForm;
