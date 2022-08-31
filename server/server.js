
const express = require('express');
const urlParser = require('url');
const cors = require('cors');
const {
  getDashboardData,
} = require('./middleware');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static('./'));


// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions))
app.get('/dashboard', cors(), [
  getDashboardData,
]);

console.log("server listening on port", port);

app.listen(port);
