
const express = require('express');
const urlParser = require('url');
const {
  getDashboardData,
} = require('./middleware');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static('./'));

app.get('/dashboard', [
  getDashboardData,
]);

console.log("server listening on port", port);

app.listen(port);
