const axios = require('axios');
const {Table} = require('bens_ui_components');
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect, useMemo} = React;

console.log("connecting");

const axiosInstance = axios.create({
  baseURL: 'https://ant-analytics.herokuapp.com',
});
// for localhost:
// const axiosInstance = axios;

const HOSTNAMES = [
  '*',
  'www.antocracy.io',
  'sidewalk-empire.herokuapp.com',
  'electron',
  'localhost',
];


function Main(props) {
  const [rows, setRows] = useState([]);
  const [hostname, setHostname] = useState('*');
  const [hostnameOptions, setHostnameOptions] = useState([HOSTNAMES]);

  // getting data
  useEffect(() => {
    axiosInstance
      .get('/dashboard', {params: {hostname}})
      .then(res => {
        console.log(res.data);
        setRows(res.data);
      });
  }, [hostname]);

  return (
    <div>
      <Table
        columns={{
          hostname: {displayName: 'Hostname'},
          path: {displayName: 'Path'},
          map: {displayName: 'Map'},
          num_visits: {displayName: 'Visits'},
          num_unique_visits: {displayName: 'Unique Visits'},
          last_visited: {displayName: 'Last Visited'},
        }}
        rows={rows}
      />
    </div>
  );
}


function renderUI(): void {
  ReactDOM.render(
    <Main />,
    document.getElementById('container'),
  );
}
renderUI();
