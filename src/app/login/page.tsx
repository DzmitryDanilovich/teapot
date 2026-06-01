import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import GoogleAuth from './googleAuth';
import LogInForm from './logInForm';
import SignUpForm from './signUpForm';

const logInPage = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-start gap-8 p-8'>
            <Tabs defaultValue='login'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='login'>Log In</TabsTrigger>
                    <TabsTrigger value='signup'>Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value='login'>
                    <LogInForm />
                </TabsContent>
                <TabsContent value='signup'>
                    <SignUpForm />
                </TabsContent>
            </Tabs>
            <GoogleAuth />
        </div>
    );
};

export default logInPage;
