import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import './authenticated.css';


export function Authenticated(props) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = localStorage.getItem('username');
    var userParagraph = document.getElementById("user");
    if(username) {
      userParagraph.textContent = 'Hello ' + username + '!'; 
    } else {
      userParagraph.textContent = "Username empty (but hello anyway!)"
    }
  }, []);

async function logout() {
    const username = localStorage.getItem('username');
    if (username) {
        try {
            await fetch('/api/logout', {
                method: 'DELETE'
            });
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    } else {
        console.error('Username not found in localStorage');
    }
    localStorage.removeItem('username');
    props.onLogout();
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