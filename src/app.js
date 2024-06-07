const express = require("express");
const app = express();

app.use(express.json())

// TODO: Follow instructions in the checkpoint to implement ths API.

const pastes = require("./data/pastes-data");

const users = require("./data/users-data");
const states = require("./data/states-data");
const notes = require("./data/notes-data");

//Routes

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
  if (text) {
  const newPaste = {
    id: ++lastPasteId, // Increment last ID, then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
} else {
  res.sendStatus(400);
}
});


//USERS
// TODO: Return an array of users from /users in form of { data: Array }



// TODO: Return a single user by id from /users/:userId in form of { data: Object }

app.use("/users/:userId", (req, res, next) => {
  const { userId } = req.params;
  const foundUser = users.find((user) => user.id === Number(userId));
  
  console.log(foundUser)

  if (foundUser) {
    console.log(foundUser)
    res.json({ data: foundUser });
  } else {
    console.log(foundUser)
    next(`User ID not found: ${userId}`);
  }
});

app.use("/users", (req, res) => {
  res.json({ data: users });
});

//STATES

// TODO: Return all states from /states in the form of { data: Array }

app.use("/states/:stateId", (req, res, next) => {
  const { stateId } = req.params;
  const foundState = stateId in states

  const wantedState = {
    "name": states[stateId],
    "stateCode": stateId
  }

  if (foundState) {
    res.json({data: wantedState});
  } else {
    next(`State code not found: ${stateId}`);
  }
});


app.use("/states", (req, res) => {
  res.json({ data: states });
});

// TODO: Return a single state from /states/:stateCode in the form of { data: { stateCode: String, name: String } }


//NOTES APP

let lastId = notes.reduce((maxId, notes) => Math.max(maxId, notes.id), 0);

app.post("/notes", (req, res, next) => {
  const {data : {id, text} = {} } = req.body;
  console.log(text)
  if (text){
  console.log("inside the true of if statement")
  const newNote = {
    id: ++lastId,
    text,
  };
  
  notes.push(newNote);
  res.status(201).json({data: newNote})
  } else {
    console.log('about to send error 400')
    res.sendStatus(400);
  }
  
});


// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
