import React, { useRef , useState} from 'react';

import Button from 'react-bootstrap/Button';

import './unauthenticated.css';

interface UnauthenticatedProps {
    onLogin: () => void
}

export function Unauthenticated(props: UnauthenticatedProps) {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [usernameError, setUsernameError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  type LoginCredentials = {
    username : string;
    password : string
  }


  const validateAndLogin = async () => {
    let isValid = true
    setUsernameError('')
    setPasswordError('')

    if(!username) {
      setUsernameError('Username required')
      isValid = false
    }
    if(!password) {
      setPasswordError('Password required')
      isValid = false
    }
    if(!isValid) {
      return
    }
    const credentials: LoginCredentials = {
      username: username,
      password:  password
    }
    try {
      const result = (await login(credentials))
      if(result) {
        props.onLogin();
      } else {
        setUsernameError('Invalid credentials');
        setPasswordError('Invalid credentials');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const validateAndRegister = async () => {
    let isValid = true
    setUsernameError('')
    setPasswordError('')

    if(!username) {
      setUsernameError('Username required')
      isValid = false
    }
    if(!password) {
      setPasswordError('Password required')
      isValid = false
    }
    if(!isValid) {
      return
    }
    const credentials: LoginCredentials = {
      username: username,
      password:  password
    }
    try {
      const result = (await register(credentials))
      if(result) {
        props.onLogin();
      } else {
        setUsernameError('Invalid credentials');
        setPasswordError('Invalid credentials');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

      
  async function login(credentials : LoginCredentials) {
  
    try {
        await sendPostRequest("/api/login", credentials);
        console.log("Logged in successfully")
    } catch (error) {
        return false;
    }
  
    return true;
  }
  async function register(credentials : LoginCredentials) {
  
    try {
        await sendPostRequest("/api/register", credentials);
        console.log("Registered successfully")
    } catch (error) {
        return false;
    }
  
    return true;
  }
      
  async function sendPostRequest(url : string, data : LoginCredentials) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Post request failed: ${response.statusText}`);
    }
  }

  return (

      <main>
          <div id="login-box">
          <form id="login-form">
              <h1>LOGIN</h1>
              <div className="username-box">
                  <label htmlFor="name"></label>
                  <input type="text" id="name" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                        placeholder="Username" />                
                      <div className="invalid-feedback">{usernameError}</div>
              </div>
              <div className="password-box">
                  <label htmlFor="password"></label>
                  <input type="password" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                        placeholder="Password" />
                      <div className="invalid-feedback">{passwordError}</div>
              </div>
              <div id="login-register">
                  <button type="button" className="btn btn-primary" onClick={() => validateAndLogin()}>Login</button>
                  <button type="button" id="register" className="btn btn-primary" onClick={() => validateAndRegister()}>Register</button>
              </div>
          </form>
          </div>
      </main>
  );
}