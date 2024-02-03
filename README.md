# QuickRunningBlog
## Elevator Pitch
Welcome to QuickRunningBlog – a personalized running journal and leaderboard. Log runs, track your progress, and compete on the live leaderboard.
## Key Features
### Run Logging
- Log your daily runs with details such as distance, time, and personal notes.
- View history of your past runs.
### Leaderboard
- Real-time running leaderboard displays the top runners by distance
## Technology Usage
### Authentication
- Account creation allowing access to personal run history and notes
### Database Data
- Runs will be stored in the database connected to a unique user
### WebSocket Data
- Realtime leaderboard updates. Currently thinking by rolling distance run for the current week
## Mock:
![Mockup](images/mock.jpeg)


## HTML deliverable:
I laid out the basic structure of the blog with this deliverable. 
### Application data:
    This is the blog body, with an entry for individual blog posts that will be queried from the database using the user's login credentials. Note the display of the user's name
### Authentication:
    UN/PW
### Database data:
    Mentioned above, the DB data is the individual's blog posts
### WebSocket data: 
    The leaderboards will be updated live when someone posts a new blog post. I added a section for PRs, this would increase the scope to having to set a 'race report' flag for each blog post