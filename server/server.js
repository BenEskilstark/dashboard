
const express = require('express');
const urlParser = require('url');
const cors = require('cors');
const {
  checkUsername,
  writeScore,
  getDashboardData,
  recordVisit,
  recordSession,
} = require('./middleware');

const port = process.env.PORT || 80;

const app = express();
app.use(express.json());
app.use(express.static('./'));
app.use(cors());


// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions))
app.get('/dashboard', cors(), [
  getDashboardData,
]);

// record visits
app.post('/visit', cors(), [
  recordVisit,
]);

// antocracy-specific
app.post('/session', cors(), [
  recordSession,
]);
app.post('/score', [
  checkUsername,
  writeScore,
]);

console.log("server listening on port", port);

app.listen(port);
