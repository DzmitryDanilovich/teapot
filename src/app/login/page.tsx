import LogInForm from './logInForm';
import SignUpForm from './signUpForm';
import GoogleAuth from './googleAuth';

const logInPage = () => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-8 p-8'>
            <div className='flex items-center gap-8'>
                <LogInForm />
                <SignUpForm />
            </div>
            <GoogleAuth />
        </div>
    );
};

export default logInPage;
