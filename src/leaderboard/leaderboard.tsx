import React, { useState, useEffect, useRef } from 'react';
import './leaderboard.css';


export function Leaderboard() {
  const socketRef = useRef(null);
  const [allRunRecords, setAllRunRecords] = useState([]);
  const [longestRunsByMonth, setLongestRunsByMonth] = useState([])
  const [longestTotalDistanceByMonth, setLongestTotalDistanceByMonth] = useState([])
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
    const getLongestTotalDistanceByMonth = async () => {
      try {
        const response = await fetch(`/api/runs/longest_total_distance_by_month?month=${monthInfo[0] + 1}&year=${monthInfo[1]}`);
        if (!response.ok) {
          throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Runs loaded successfully");
        setLongestTotalDistanceByMonth(data.runsList);
      } catch (error) {
        console.error("Couldn't load runs", error.message);
      }
    };
    getLongestTotalDistanceByMonth();
  }, [monthInfo]);
  useEffect(() => {
    const getLongestRunsByMonth = async () => {
      try {
        const response = await fetch(`/api/runs/longest_runs_by_month?month=${monthInfo[0] + 1}&year=${monthInfo[1]}`);
        if (!response.ok) {
          throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Runs loaded successfully");
        setLongestRunsByMonth(data.runsList);
      } catch (error) {
        console.error("Couldn't load runs", error.message);
      }
    };
    getLongestRunsByMonth();
  }, [monthInfo]);


  const updateMonthInfo = (increment) => {
    setMonthInfo(([month, year]) => {
      let newMonth = (month + increment) % 12;
      newMonth = (newMonth + 12) % 12;
      const newYear = increment === 1 && newMonth === 0 ? year + 1 : increment === -1 && newMonth === 11 ? year - 1 : year;
      return [newMonth, newYear];
    });
  };


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

              {Array.isArray(longestTotalDistanceByMonth) && longestTotalDistanceByMonth.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="username-field">{record.username}</td>
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
              {Array.isArray(longestRunsByMonth) && longestRunsByMonth.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="username-field">{record.username}</td>
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