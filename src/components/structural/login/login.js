import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserSession } from "../../../utils/localStorage.utils";
import styles from "./login.module.css";

const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const navigate = useNavigate()
  // fetch logic
  const fakeLogin = () => {
    fetch("http://localhost:3005/login",{
        method:'POST',
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
        body:JSON.stringify({
            email,
            password
        })
    })
      .then((response) => {
        return response.json();
      }).then((res)=>{
        if(res.token){
            setUserSession(res)
            navigate('/')
            
        }
      })
  };

  return (
    <div className={styles.container}>
      <h3>Login</h3>
      <div className={styles["input-wrapper"]}>
        <label htmlFor="email">email</label>
        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="📧 Email" />
        <label htmlFor="password">password</label>
        <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password " />
        <button onClick={() => fakeLogin()}>Login</button>
      </div>
    </div>
  );
};
export default Login;
