
import {useRef, useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import axios from '../api/axios';
import styles from "../css/Login.css";

const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{12,24}$/;
const registerURL = '/User';

export default function UpdatePassword() {
    const errorRef = useRef();

    const location = useLocation();
    const email = location.state.email;
    const rowVersion = location.state.rowVersion;

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const result = passwordRegex.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {
        setErrorMessage('');
    }, [password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordValid = passwordRegex.test(password);
        if (!passwordValid) {
            setErrorMessage("Invalid Entry");
            return;
        }
        try {
            const response = await axios.put(registerURL,
                JSON.stringify({
                    email: email, password : password, rowVersion : rowVersion
                }), {
                    headers: {'Content-Type': 'application/json'}
                });
            console.log(response.data)
            setSuccess(true);
        } catch (error){
            if (!error?.response){
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 409){
                setErrorMessage ('Concurrency Error');
            } else{
                setErrorMessage ('Update Password Failed');
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
            <h1> Update Password </h1>
            <form onSubmit={handleSubmit}>

                <div> Email: {email} </div>
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
                <button className='btn btn-primary' disabled={!validPassword || !validMatchPassword ? true : false}>Update Password</button>        
            </form>
            <p>
                <span className="line">
                    <a href="/">Sign In</a>
                </span>
            </p>
        </section>
        )}
        </div>
    )
}