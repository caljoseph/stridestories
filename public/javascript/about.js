document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
  
    const navBar = document.querySelector(".menu-bar");
    const quoteText = document.querySelector("#quote-text");
    const quoteAuthor = document.querySelector("#quote-author");


  
    if (username && username.trim() !== "") {
      // If username exists, render the full navigation bar
      navBar.innerHTML = `
        <ul class="menu-bar">
          <li id="home"><a href="logged-in.html">Home</a></li>
          <li id="my-blog"><a href="blog.html">My Blog</a></li>
          <li id="leaderboard"><a href="leaderboard.html">Leaderboard</a></li>
          <li id="about"><a href="about.html">About</a></li>
          <li id="record"><a href="record.html">Record</a></li>
        </ul>`;
    } else {
      // If username doesn't exist, render the simplified navigation bar
      navBar.innerHTML = `
        <ul class="menu-bar">
          <li id="home"><a href="index.html">Home</a></li>
          <li id="leaderboard"><a href="leaderboard.html">Leaderboard</a></li>
          <li id="about"><a href="about.html">About</a></li>
        </ul>`;
    }
  });
  