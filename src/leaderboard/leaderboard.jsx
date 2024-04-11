import React, { useState, useEffect, useRef } from 'react';
import './leaderboard.css';


export function Leaderboard() {
  const socketRef = useRef(null);
  const [allRunRecords, setAllRunRecords] = useState([]);
  const [monthInfo, setMonthInfo] = useState([new Date().getMonth(), new Date().getFullYear()]);

// websockets
  useEffect(() => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socketRef.current = new WebSocket(`${protocol}://${window.location.host}/ws`);
  
    socketRef.current.onopen = function(event) {
      console.log("Websocket opened");
    };
  
    socketRef.current.onmessage = function(event) {
      const message = JSON.parse(event.data);
      if (message.type === 'runsUpdate') {
      loadRuns()
      } else {
        console.log("Message from server: ", event.data);
      }
    };
  
    socketRef.current.onerror = function(error) {
      console.error("WebSocket error: ", error);
    };

    return () => {
      if(socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); 

  useEffect(() => {
    const sendGetRequest = async () => {
      try {
        const response = await fetch("/api/runs");
        if (!response.ok) {
          throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Runs loaded successfully");
        setAllRunRecords(data);
      } catch (error) {
        console.error("Couldn't load runs", error.message);
      }
    };
    sendGetRequest();
  }, []); 


  const updateMonthInfo = (increment) => {
    setMonthInfo(([month, year]) => {
      let newMonth = (month + increment) % 12;
      newMonth = (newMonth + 12) % 12;
      const newYear = increment === 1 && newMonth === 0 ? year + 1 : increment === -1 && newMonth === 11 ? year - 1 : year;
      return [newMonth, newYear];
    });
  };

  const currentMonthRecords = allRunRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === monthInfo[0] && recordDate.getFullYear() === monthInfo[1];
  });

  const sortedDistance = sortCumulativeUserDistance(currentMonthRecords);
  const sortedLongest = sortLongestRun(currentMonthRecords);

  function sortLongestRun(records) {
    return records.sort((a, b) => {
      const durationA = parseInt(a.distance, 10);
      const durationB = parseInt(b.distance, 10);
  
      return durationB - durationA;
    });
  }
  
  function sortCumulativeUserDistance(records) {
    const userDistance = records.reduce((acc, run) => {
      const distance = parseFloat(run.distance, 10);
      if (acc[run.username]) {
        acc[run.username] += distance;
      } else {
        acc[run.username] = 0;
        acc[run.username] += distance;
      }
      return acc;
    }, {});
  
    const userDistanceArray = Object.entries(userDistance).map(([username, totalDistance]) => ({
      username,
      distance: totalDistance,
    }));
  
    userDistanceArray.sort((a, b) => b.distance - a.distance);
    return userDistanceArray;
  }






  return (
    <main>
        <div className="calendar">
            <button id="prev-month" onClick={() => updateMonthInfo(-1)}>Previous Month</button>
            <h3>{new Date(monthInfo[1], monthInfo[0]).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button id="next-month" onClick={() => updateMonthInfo(1)}>Next Month</button>
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

              {sortedDistance.slice(0, 10).map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.username}</td>
                  <td>{record.distance.toFixed(2)}</td>
                </tr>
              ))}
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
              {sortedLongest.slice(0, 10).map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.username}</td>
                  <td>{parseFloat(record.distance).toFixed(2)}</td>
                </tr>
              ))}
              </tbody>
          </table>
          </div>
  
  
  
        </div>
  
      </main>
  );
}