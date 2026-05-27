'use client';
import { useActionState } from 'react';
import { signUp, SignUpValues } from './actions';
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

const SignUpForm = () => {
    const [state, formAction, isPending] = useActionState(signUp, null);

    return (
        <Card className='w-96'>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                {state?.errors.form && (
                    <p role='alert' className='text-destructive mb-4 text-sm'>
                        {state.errors.form.join('; ')}
                    </p>
                )}
                <form id='signUpForm' action={formAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor='name'>Name</FieldLabel>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                defaultValue={state?.values.name}
                                required
                            />
                            <FieldError
                                errors={state?.errors.name?.map((e) => ({
                                    message: e,
                                }))}
                            />
                        </Field>

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
                <Button disabled={isPending} type='submit' form='signUpForm'>
                    Sign Up
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SignUpForm;
