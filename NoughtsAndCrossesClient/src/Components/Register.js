
import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import axios from '../api/axios';
import styles from "../css/Login.css";

const userRegex = /^[a-zA-Z][a-zA-Z0-9]{3,100}$/;
const emailRegex = /^(?=.*[@])(?=.*[.]).{3,256}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{12,24}$/;
const registerURL = '/User';

export default function Register() {
    const userRef = useRef();
    const emailRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = userRegex.test(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        const result = emailRegex.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = passwordRegex.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {
        setErrorMessage('');
    }, [user, email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userValid = userRegex.test(user);
        const emailValid = emailRegex.test(email);
        const passwordValid = passwordRegex.test(password);
        if (!userValid || !emailValid || !passwordValid) {
            setErrorMessage("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(registerURL,
                JSON.stringify({
                    userName: user, email: email, password : password
                }), {
                    headers: {'Content-Type': 'application/json'}
                });
            console.log(response.data)
            setSuccess(true);
        } catch (error){
            if (!error?.response){
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 409){
                setErrorMessage ('Username or Email has been Taken');
            } else{
                setErrorMessage ('Registration Failed');
            }
            errorRef.current.focus();
        }
    }

    return(
        <div className={styles}>
        { success ?(
            <section>
                <h1> Success! </h1>
                <p>
                    <a href='/'> Please Sign In</a>
                </p>
            </section>
        ) : (
            <section>
            <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive"> {errorMessage} </p>
            <h1> Register </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                </label>
                <input
                    type = "text"
                    id = "username"
                    ref = {userRef}
                    autoComplete = "off"
                    onChange = {(e) => setUser(e.target.value)}
                    required
                    aria-invalid = {validName? "false" : "true"}
                    aria-describedby = "uidnote"
                    onFocus = {() => setUserFocus(true)}
                    onBlur = {() => setUserFocus(false)}
                    value={user}
                />
                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 100 characters . <br />
                    Must begin with a letter. <br />
                    Letters, numbers, underscores, hyphens allowed. 
                </p>

                <label htmlFor="Email">
                    Email:
                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </label>
                <input
                    type = "text"
                    id = "email"
                    ref = {emailRef}
                    autoComplete = "off"
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                    aria-invalid = {validEmail? "false" : "true"}
                    aria-describedby = "emailnote"
                    onFocus = {() => setEmailFocus(true)}
                    onBlur = {() => setEmailFocus(false)}
                    value = {email}
                />
                <p id="emailnote" className={emailFocus && user && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 256 characters . <br />
                    Must Include <span aria-label="at symbol">.</span> and <span aria-label="at symbol">@</span> <br />
                    Letters, numbers, underscores, hyphens allowed. 
                </p>

                <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />        
                </label>       
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="passwordnote"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                />                
                <p id="passwordnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    12 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>


                <label htmlFor="confirm_password">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatchPassword && matchPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatchPassword || !matchPassword ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="confirm_password"
                    onChange={(e) => setMatchPassword(e.target.value)}
                    value={matchPassword}
                    required
                    aria-invalid={validMatchPassword ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatchPassword ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>
                <br/>
                <button className='btn btn-primary' disabled={!validName || !validEmail || !validPassword || !validMatchPassword ? true : false}>Sign Up</button>        
            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    <a href="/">Sign In</a>
                </span>
            </p>
        </section>
        )}
        </div>
    )
}