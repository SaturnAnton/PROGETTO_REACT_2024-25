import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from './../../main';
import './Signup.css'; 

const Signup = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const signUpWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(async (response) => {
                const userId = response.user.uid;
                console.log(response.user.uid);
                 // Aggiorna il documento 'user_collections' con l'ID dell'utente
                 const userCollectionsRef = doc(db, 'user_collections', userId);
                 await setDoc(userCollectionsRef, {
                     collections: arrayUnion(userId),  // Aggiungi l'ID utente all'array
                 }, { merge: true });

                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            setError('Le password non corrispondono');
            return;
        }

        setAuthing(true);
        setError('');

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                const userId = response.user.uid;
                console.log(response.user.uid);
                const userCollectionsRef = doc(db, 'user_collections', userId);
                await setDoc(userCollectionsRef, {
                    collections: arrayUnion(userId),  // Aggiungi l'ID utente all'array
                }, { merge: true });
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <div className='signup-container'>
            <div className='signup-card'>
                <h3 className='signup-title'>Registrati</h3>
                <p className='signup-subtitle'>Benvenuto! Inserisci le tue informazioni qui sotto per iniziare.</p>
                <div className='signup-inputs'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='signup-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='signup-input'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Inserisci di nuovo la password'
                        className='signup-input'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <div className='signup-error'>{error}</div>}
                <button
                    onClick={signUpWithEmail}
                    disabled={authing}
                    className='signup-button'>
                    Registrati con Email e Password
                </button>
                <div className='signup-divider'>
                    <div className='divider-line'></div>
                    <p className='divider-text'>OR</p>
                </div>
                <button
                    onClick={signUpWithGoogle}
                    disabled={authing}
                    className='signup-google-button'>
                    Registrati con Google
                </button>
                <p className='signup-footer'>
                    Hai già un account? <a href='/login' className='signup-link'>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
