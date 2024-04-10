import React from 'react';
import './leaderboard.css';


export function Leaderboard() {
  return (
    <main>
        <div className="calendar">
          <button id="prev-week"><p>Previous Month</p></button>
          <h3 id="month-display"></h3>
          <button id="next-week"><p>Next Month</p></button>
        </div>
  
        <div className="leaderboard-body">
          <div className="distance">
            <h3>Monthly Distance:</h3>
            <table>
              <thead>
                  <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Mileage</th>
                  </tr>
              </thead>
              <tbody id="total-distance-data">
              </tbody>
          </table>
          </div>
          <div className="longest">
            <h3>Longest Run:</h3>
            <table>
              <thead>
                  <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Run miles</th>
                  </tr>
              </thead>
              <tbody id="longest-run-data">

              </tbody>
          </table>
          </div>
  
  
  
        </div>
  
      </main>
  );
}