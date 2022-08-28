const axios = require('axios');
const {
  Dropdown,
  Table,
} = require('bens_ui_components');
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect, useMemo} = React;

// get axiosInstance for URL:
const axiosInstance = axios.create({
  baseURL: 'https://ant-analytics.herokuapp.com',
});
// for localhost:
// const axiosInstance = axios;

const tableNames = ['site_visits', 'ant_scores', 'visits'];

function Main(props) {
  const [table, setTable] = useState('site_visits');
  const [rows, setRows] = useState([]);

  // getting data
  useEffect(() => {
    axiosInstance
      .get('/dashboard', {params: {table}})
      .then(res => {
        // console.log(res.data);
        setRows(res.data);
      });
  }, [table]);

  return (
    <div>
      Table: <Dropdown
        options={tableNames}
        selected={table}
        onChange={setTable}
      />
      <Table
        columns={{
          hostname: {displayName: 'Hostname', filterable: true},
          path: {displayName: 'Path', filterable: true},
          map: {displayName: 'Map', filterable: true},
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
