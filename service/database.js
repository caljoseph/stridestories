const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
// const config = require('./dbConfig.json');

// const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const url = "mongodb://localhost:27017/"
const client = new MongoClient(url);
const db = client.db('startup');

const userCollection = db.collection('user');
const runCollection = db.collection('run');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

function getUser(username) {
return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
      username: username,
      password: passwordHash,
      token: uuid.v4(),
      memberSince: new Date(), 
  };
  await userCollection.insertOne(user);

  return user;
}

function addRun(run) {
    runCollection.insertOne(run);
}

async function updateUserBlogInfo(username, blogInfo) {
  const { location, bio, goals } = blogInfo;
  const result = await userCollection.updateOne(
    { username: username },
    {
      $set: {
        location: location,
        bio: bio,
        goals: goals,
      },
    }
  );
  
  if (result.matchedCount === 0) {
    throw new Error('No user found with the given username.');
  }

  return { username, location, bio, goals };
}

async function getUserBlogInfo(username) {
  const userBlogInfo = await userCollection.findOne(
      { username: username },
      {
          projection: {
              _id: 0,
              location: 1,
              bio: 1,
              goals: 1,
              memberSince: 1, 
          },
      }
  );

  if (!userBlogInfo) {
      throw new Error('No user found with the given username.');
  }

  return userBlogInfo;
}


function getRuns() {
    const query = {
        date: { $exists: true },
        distance: { $exists: true },
        duration: { $exists: true },
        runType: { $exists: true },
        notes: { $exists: true },
        username: { $exists: true },
        location: { $exists: true },
        title: { $exists: true }
    };
    return runCollection.find(query).toArray();
}






module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addRun,
    getRuns,
    updateUserBlogInfo, // Add this line
    getUserBlogInfo
  };