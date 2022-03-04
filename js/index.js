const axios = require('axios');
const React = require('react');

console.log("hello");

const axiosInstance = axios.create({
  baseURL: 'https://sidewalk-empire.herokuapp.com',
});

axiosInstance
  .get('/dashboard', {hostname: '*'})
  .then(res => {
    console.log(res.data);
  });
;
