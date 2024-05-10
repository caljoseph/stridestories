import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromAuthCookie } from '../utils/getUserNameFromAuth.ts';


import './authenticated.css';

interface AuthenticatedProps {
    onLogout: () => void;
}


export function Authenticated(props :AuthenticatedProps) {
  const navigate = useNavigate();

useEffect(() => {
    async function fetchUserData() {
        const userData = await getUserFromAuthCookie();  // Wait for the Promise to resolve
        let userParagraph = document.getElementById("user");
        if (userParagraph) {
            if (userData && userData.Username) {
                userParagraph.textContent = 'Hello ' + userData.Username + '!';
            } else {
                userParagraph.textContent = "Username empty (but hello anyway!)"
            }
        }
    }

    fetchUserData();  // Call the async function within useEffect
}, []);



async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Logout failed with status: ' + response.status);
        }
        console.log('Logged out successfully');
        props.onLogout();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}


  return (
    <main>
          <div className="greeting">
              <h1>Welcome to Stridestories</h1>
              <p id="user"></p>
          </div>
          <div className="options">
              <div className="button-wrapper">

                  <button id="record-button" type="submit" onClick={() => navigate('/record')}>RECORD RUN</button>

                </div>
              <div className="button-wrapper">

                  <button type="submit" onClick={() => logout()}>LOGOUT</button>

                </div>
          </div>
      </main>
  );
}