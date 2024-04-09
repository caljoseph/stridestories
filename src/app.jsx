import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className='body bg-dark text-light'>
        <header>
            <h1>Stridestories</h1>
            <nav>
            <ul className="menu-bar">
                <li id="leaderboard"><a href="leaderboard.html">Leaderboard</a></li>
                <li id="about"><a href="about.html">About</a></li>
            </ul>
            </nav>
        </header>
        <main>The real stuff goes here</main>
        <footer>
            <span className="text-reset">Caleb Bradshaw</span>
            <br />
            <a href="https://github.com/caljoseph/startup">GitHub</a>
        </footer>
    </div>





    
  );
  

}