
const express = require('express');
const urlParser = require('url');
const {
  recordVisit,
  recordSession,
  checkUsername,
  getHighScores, writeScore,
} = require('./middleware');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static('./'));
console.log("server listening on port", port);

app.listen(port);
