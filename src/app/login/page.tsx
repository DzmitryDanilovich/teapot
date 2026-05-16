import LogInForm from './logInForm';
import SignUpForm from './signUpForm';
import GoogleAuth from './googleAuth';

const logInPage = () => {
    return (
        <>
            <h1>Log In</h1>
            <LogInForm />
            or
            <h1>Sign Up</h1>
            <SignUpForm />
            or use social log in
            <GoogleAuth />
        </>
    )
};

export default logInPage;