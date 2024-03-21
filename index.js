const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');

const app = express();
const authCookieName = 'token';

let runRecords = [];


// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

//http requests will use apiRouter ex apiRouter.get('/path', (_req, res) => { res.send(scores); });
apiRouter.get('/runs', async (_req, res) => {
  res.send(runRecords);
});

apiRouter.post('/run', (req, res) => {
  runRecords = addRecord(req.body, runRecords)
  res.send(runRecords);
});

function addRecord(run, runRecords) {
  runRecords.push(run);
  runRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
  return runRecords;
}




// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });