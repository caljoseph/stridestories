import React from 'react';
import './blog.css';


export function Blog() {
  return (
    <main>
        <div className="blog-body">
          <div className="blog-info">
            <div className="blog-title" >
              <h2 contenteditable="true"></h2>
            </div>
            <div className="blog-location">
              <h3>Location:</h3>
                <p contenteditable="true" >Alpine, UT, USA</p>
            </div>
            <div className="blog-member-since">
              <h3>Member since:</h3>
              <p>02/12/24 (placeholder date)</p>
            </div>
            <div className="blog-bio">
              <h3>Bio:</h3>
              <p contenteditable="true">Run fast, live slow. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quasi, iste tenetur natus optio sapiente, voluptatibus facere inventore culpa dicta, quod adipisci nesciunt eligendi explicabo dolorem. Ab veritatis cum laborum.</p>
            </div>
            <div className="blog-goals" >
              <h3 contenteditable="true">Goals:</h3>
              <ul>
                <li>Complete a marathon by the end of the year.</li>
                <li>Improve running pace by 10% within the next three months.</li>
                <li>Explore and document running trails in different locations.</li>
                <li>Share weekly training insights to inspire others in the running community.</li>
                <li>Experiment with new cross-training activities to enhance overall fitness.</li>
                <li>Attend a running workshop or training program for continuous learning.</li>
              </ul>
            </div>
          </div>
          <div className="blog-and-calendar">
            <div className="calendar">
              <button id="prev-month"><p>Previous Month</p></button>
              <h3 id="month-display"></h3>
              <button id="next-month"><p>Next Month</p></button>
            </div>
            <div className="blog-content">
              
             
  
      
            </div>
          </div>
        </div>
    </main>
  );
}