import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import './authenticated.css';

interface AuthenticatedProps {
    onLogout: () => void;
}


export function Authenticated(props :AuthenticatedProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = localStorage.getItem('username');
    let userParagraph = document.getElementById("user");
    if (userParagraph) {
        if(username) {
            userParagraph.textContent = 'Hello ' + username + '!';
        } else {
            userParagraph.textContent = "Username empty (but hello anyway!)"
        }
    }
  }, []);



async function logout() {
    const username = localStorage.getItem('username');
    if (username) {
        try {
            const response = await fetch('/api/logout', {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Logout failed with status: ' + response.status);
            }
            console.log('Logged out successfully');
            localStorage.removeItem('username');
            props.onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    } else {
        console.error('Username not found in localStorage');
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