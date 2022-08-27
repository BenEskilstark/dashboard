const axios = require('axios');
const React = require('react');

console.log("connecting");

const axiosInstance = axios.create({
  baseURL: 'https://ant-analytics.herokuapp.com',
});

// for localhost:
// const axiosInstance = axios;

axiosInstance
  .get('/dashboard', {params: {hostname: '*'}})
  // .get('/dashboard', {hostname: 'www.antocracy.io'})
  .then(res => {
    console.log(res.data);
  });
;
