import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h3 className='login-title'>Login</h3>
                <p className='login-subtitle'>Bentornato! Inserisci i tuoi dati.</p>
                <div className='login-inputs'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='login-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type='password'
                        placeholder='Password'
                        className='login-input'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className='login-error'>{error}</div>}
                <button
                    className='login-button'
                    onClick={signInWithEmail}
                    disabled={authing}>
                    Login con Email e Password
                </button>
                <div className='login-divider'>
                    <div className='divider-line'></div>
                    <p className='divider-text'>OR</p>
                </div>
                <button
                    className='login-google-button'
                    onClick={signInWithGoogle}
                    disabled={authing}>
                    Login con Google
                </button>
                <p className='login-footer'>
                    Non hai un account? <a href='/signup' className='login-link'>Registrati</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
