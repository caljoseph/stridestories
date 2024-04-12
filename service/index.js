const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');
const WebSocket = require('ws');

const path = require('path');
const app = express();
const authCookieName = 'token';
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

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

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetRuns
secureApiRouter.get('/runs', async (req, res) => {
  const runs = await DB.getRuns();
  res.send(runs);
});


// Endpoint to save blog info
secureApiRouter.post('/blog-info', async (req, res) => {
  const { username, location, bio, goals } = req.body;
  try {
    // Replace with your actual database update logic
    await DB.updateUserBlogInfo(username, { location, bio, goals });
    res.json({ message: 'Blog info updated successfully' });
  } catch (error) {
    console.error('Failed to update blog info', error);
    res.status(500).send({ msg: 'Failed to update blog info' });
  }
});

// Endpoint to get blog info
secureApiRouter.get('/user/blog-info/:username', async (req, res) => {
  const { username } = req.params;
  try {
    // Replace with your actual database query logic
    const userBlogInfo = await DB.getUserBlogInfo(username);
    res.json(userBlogInfo);
  } catch (error) {
    console.error('Failed to fetch blog info', error);
    res.status(404).send({ msg: 'Failed to fetch blog info' });
  }
});


// SubmitRuns
secureApiRouter.post('/run', async (req, res) => {
  const run = { ...req.body, ip: req.ip };
  await DB.addRun(run);
  const runs = await DB.getRuns();
  res.send(runs);

    // Broadcast the update
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'runsUpdate'
      });
      client.send(message);
    }
  });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../') });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('WS message received: %s', message);
  });
});
