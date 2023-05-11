import {useRef, useState, useEffect} from 'react';
import {Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import styles from "../css/Login.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const loginURL = '/user';

    useEffect(()=> {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [user, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(loginURL, {params: {usernameOrEmail: user, password: password}});
            setAuth({user: response.data.userName});
            setUser('');
            setPassword('');
            navigate('/dashboard', {replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            } else {
                setErrorMessage('Login Failed');
            }
            errorRef.current.focus();
        }
    }

    return (
        <section className={styles}>
            <p ref={errorRef} className={errorMessage? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username/Email:</label>
                <input 
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <br/>
                <button className='btn btn-primary'>Sign In</button>
            </form>
            <p>
                Need an Account? <br />
                <span className="line">
                    <a href="register">Sign Up</a>
                </span>
                <br />
                Forgot Password? <br />
                <span className="line">
                    <a href="forgotpassword">Update Password</a>
                </span>
            </p>
        </section>          
    )
}

export default Login