import React from 'react';
import './about.css';


export function About() {
  return (
    <main>  
        <p id="tagline">
          Welcome to Stridestories – a personalized running journal and leaderboard. 
          Log runs, track your progress, and compete on the live leaderboard.
        </p>
  
        <div id="quote">
          <div id="quote-text">Most runners run not because they want to live longer, 
            but because they want to live life to the fullest.</div>
          <div id="quote-author">- Haruki Murakami</div>
        </div>
      </main>
  );
}