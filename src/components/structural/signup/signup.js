import { useState } from "react";
import styles from "./signup.module.css";
import { useNavigate } from "react-router-dom";
import { setUserSession } from "../../../utils/localStorage.utils";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  // fetch logic
  const signup = () => {
    const body = JSON.stringify({
      email,
      password,
      firstName,
    });
    fetch("http://localhost:3005/register", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "POST",
      body,
    })
      .then((response) => {
        return response.json();
      })
      .then((payload) => {
        console.log(payload);
        if(payload.token){
            setUserSession(payload)
            navigate('/')
        }
      });
  };
  return (
    <div className={styles.container}>
      <h3>Sign up form</h3>
      <div className={styles["input-wrapper"]}>
        <label htmlFor="name">name</label>
        <input
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          type="text"
          placeholder="Name"
        />
        <label htmlFor="email">email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="📧 Email"
        />
        <label htmlFor="password">password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="text"
          placeholder="Password "
        />
        <button onClick={() => signup()}>sign up</button>
      </div>
    </div>
  );
};
export default Signup;
