import React from 'react';
import Button from 'react-bootstrap/Button';

import './login.css';

export function Unauthenticated(props) {
    // const [username, setUsername] = React.useState(props.username);
    // const [password, setPassword] = React.useState('');

    async function validateAndLogin() {
        const userNameInput = document.querySelector("#name");
        const passwordInput = document.querySelector("#password");
      
      
        userNameInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");
      
        if (!userNameInput.value) {
          userNameInput.classList.add("is-invalid");
          document.getElementById("username-error").innerText = "Username required";
          return;
        }
      
        if (!passwordInput.value) {
          passwordInput.classList.add("is-invalid");
          document.getElementById("password-error").innerText = "Password required";
          return;
        }
      
        // If validation passes, proceed with login
        const body = {
          "username" : userNameInput.value,
          "password" : passwordInput.value
        };
      
        if (await login(body)) {
          localStorage.setItem('username', body.username);
          props.onLogin(body.username);
          return;
        } else {
          document.getElementById("username-error").innerText = "";
          userNameInput.classList.add("is-invalid");
          passwordInput.classList.add("is-invalid");
      
          document.getElementById("password-error").innerText = "Invalid credentials";
      
        }
      
      }
      
      async function validateAndRegister() {
        const userNameInput = document.querySelector("#name");
        const passwordInput = document.querySelector("#password");
      
      
        userNameInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");
      
        if (!userNameInput.value) {
          userNameInput.classList.add("is-invalid");
          document.getElementById("username-error").innerText = "Username required";
          return;
        }
      
        if (!passwordInput.value) {
          passwordInput.classList.add("is-invalid");
          document.getElementById("password-error").innerText = "Password required";
          return;
        }
      
        // If validation passes, proceed with register
        const body = {
          "username" : userNameInput.value,
          "password" : passwordInput.value
        };
      
        if (await register(body)) {
          localStorage.setItem('username', body.username);
          props.onLogin(body.username);
        } else {
          document.getElementById("username-error").innerText = "";
          userNameInput.classList.add("is-invalid");
          passwordInput.classList.add("is-invalid");
          document.getElementById("password-error").innerText = "User already exists";
      
        }
      
      }
      
      
      async function login(body) {
      
        try {
            await sendPostRequest("/api/auth/login", body);
            console.log("Logged in successfully")
        } catch (error) {
            return false;
        }
      
        return true;
      }
      async function register(body) {
      
        try {
            await sendPostRequest("/api/auth/create", body);
            console.log("Registered successfully")
        } catch (error) {
            return false;
        }
      
        return true;
      }
      
      async function sendPostRequest(url, data) {
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
                    <label for="name"></label>
                    <input type="text" id="name" placeholder="Username" className="form-control"/>
                <div className="invalid-feedback" id="username-error"></div>
                </div>
                <div className="password-box">
                    <label for="password"></label>
                    <input type="password" id="password" placeholder="Password" className="form-control"/>
                <div className="invalid-feedback" id="password-error"></div>
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