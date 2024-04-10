import React from 'react';
import './authenticated.css';


export function Authenticated() {
  return (
    <main>
          <div className="greeting">
              <h1>Welcome to Stridestories</h1>
              <p id="user"></p>
          </div>
          <div className="options">
              <div className="button-wrapper">
                <a href="record.html">
                  <button id="record-button" type="submit">RECORD RUN</button>
                </a>
                </div>
              <div className="button-wrapper">
                <a href="index.html">
                  <button type="submit" onClick="logout()">LOGOUT</button>
                </a>
                </div>
          </div>
      </main>
  );
}