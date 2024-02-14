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

## CSS deliverable:
I learned an enormous amount about css and flex-box doing this deliverable
### Header, footer, and main content body
I had to go through a couple of iterations to get the header main and footer to behave how I wanted. I learned about creating patterns and gradients for the main background of the application and styling different components with gradients.
### Navigation elements
I added some nice styles to my nav bar. I have my logo and nav items persist on all screens. I also added some nice little animations to my nav items by adjusting their size and color on hover.
### Responsive to window resizing
Flexbox is amazing! As long as I properly set up my elemets in their containers and enabled flex there was very little effort in this section.
### Application elements
It was of very little use creating my HTML skeletons for the last deliverable because the styling that I ended up going with informed the HTML layout. I now have a login page, the page a user will see when they are already logged in, a My Blog page containing your history of runs, the weekly leaderboard and an about page. The blog page was the most complicated as it includes a date navigator, a blog info section and the main blog content section. Each individual blog entry includes date, location, a title and description as well as duration, pace, and distance information.
### Application text content
I generated some dummy data for my blog bio, posts and leaderboard rankings for the week
### Application images
I don't think I'll keep the image on the about page in this same state forever, but it sure looks nice now!