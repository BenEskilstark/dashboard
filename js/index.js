const axios = require('axios');
const React = require('react');

console.log("connecting");

const axiosInstance = axios.create({
  baseURL: 'https://ant-analytics.herokuapp.com',
});

axiosInstance
  .get('/dashboard', {hostname: 'antocracy.io'})
  .then(res => {
    console.log(res.data);
  });
;
