import React, { useState, useEffect } from 'react';
import './blog.css';


export function Blog() {
  const [allRunRecords, setAllRunRecords] = useState([]);
  const [monthInfo, setMonthInfo] = useState([new Date().getMonth(), new Date().getFullYear()]);
  const username = localStorage.getItem("username");
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const sendGetRequest = async () => {
      try {
        const response = await fetch("/api/runs");
        if (!response.ok) {
          throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Runs loaded successfully");
        setAllRunRecords(data.filter(record => record.username === username));
      } catch (error) {
        console.error("Couldn't load runs", error.message);
      }
    };
    sendGetRequest();
  }, [username]); 
  
  useEffect(() => {
    const fetchBlogInfo = async () => {
      const username = localStorage.getItem("username");
      const response = await fetch(`/api/user/blog-info/${username}`);
      if (response.ok) {
        const data = await response.json();
        setLocation(data.location || '');
        setBio(data.bio || '');
        setGoals(data.goals || []);
      }
    };
    fetchBlogInfo();
  }, []);

  const handleSave = async () => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch('/api/blog-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, location, bio, goals }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log('Blog info saved successfully');
    } catch (error) {
      console.error('Failed to save blog info', error);
    }
  };

  const addGoal = () => setGoals([...goals, '']);
  const updateGoal = (index, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };
  const removeGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };


  const updateMonthInfo = (increment) => {
    setMonthInfo(([month, year]) => {
      let newMonth = (month + increment) % 12;
      newMonth = (newMonth + 12) % 12;
      const newYear = increment === 1 && newMonth === 0 ? year + 1 : increment === -1 && newMonth === 11 ? year - 1 : year;
      return [newMonth, newYear];
    });
  };

  const calculatePace = (duration, distance) => {
    const pace = duration / distance;
    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);
    return `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} min/mi`;
  };

  const capitalizeUsername = (username) => username.charAt(0).toUpperCase() + username.slice(1);

  // Restrict records to current month
  const currentMonthRecords = allRunRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === monthInfo[0] && recordDate.getFullYear() === monthInfo[1];
  });
  
  return (
    <main>
        <div className="blog-body">
          <div className="blog-info">
            <div className="blog-title" >
              <h2>{capitalizeUsername(username)}'s Blog</h2>
            </div>
            <div className="blog-location">
              <h3>Location:</h3>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="blog-member-since">
              <h3>Member since:</h3>
              <p>02/12/24 (placeholder date)</p>
            </div>
            <div className="blog-bio">
              <h3>Bio:</h3>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="blog-goals">
              <h3>Goals:</h3>
              {goals.map((goal, index) => (
                <div key={index}>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                />
                <button onClick={() => removeGoal(index)}>Remove</button>
                </div>
              ))}
              <button onClick={addGoal}>Add Goal</button>
            </div>
          <button onClick={handleSave}>Save</button>
          </div>
          <div className="blog-and-calendar">
          <div className="calendar">
            <button id="prev-month" onClick={() => updateMonthInfo(-1)}>Previous Month</button>
            <h3>{new Date(monthInfo[1], monthInfo[0]).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button id="next-month" onClick={() => updateMonthInfo(1)}>Next Month</button>
          </div>
            <div className="blog-content">
        {currentMonthRecords.map((record, index) => (
          <div key={index} className="blog-entry">
            <div className="entry-date-location">
              <p>{record.date}</p>
              <p>{record.location}</p>
            </div>
            <div className="entry-title">
              <h3>{record.title}</h3>
            </div>
            <div className="entry-description">
              <p>{record.notes}</p>
            </div>
            <div className="entry-stats">
              <table>
                <thead>
                  <tr>
                  <th id="duration">Duration</th>
                  <th id="pace">Pace</th>
                  <th id="distance">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <td id="duration-info">{record.duration} mins</td>
                  <td id="pace-info">{calculatePace(record.duration, record.distance)}</td>
                  <td id="distance-info">{record.distance} miles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
            </div>
          </div>
        </div>
    </main>
  );
}