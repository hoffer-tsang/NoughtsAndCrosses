import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import styles from "../css/Login.css";

const ForgotPassword = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const emailRef = useRef();
    const errorRef = useRef();

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const loginURL = '/User/Details';

    useEffect(()=> {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [email])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(loginURL, {params: {email: email}});
            setAuth({email});
            setEmail('');
            navigate('/updatepassword', { state: {email: response.data.email, rowVersion: response.data.rowVersion}});
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else {
                setErrorMessage('Cannot find user with email input');
            }
            errorRef.current.focus();
        }
    }

    return (
        <section className={styles}>
            <p ref={errorRef} className={errorMessage? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email"> Email:</label>
                <input 
                    type="text"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <br/>
                <button className='btn btn-primary'> Reset Password </button>
            </form>
            <p>
                <span className="line">
                    <a href="/">Sign In</a>
                </span>
            </p>
        </section>          
    )
}

export default ForgotPassword