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

const tableNames = ['site_visits', 'ant_scores', 'visits', 'ant_sessions'];
const filterableCols = [
  'hostname', 'path', 'map',
  'username', 'species',
  'ending', 'is_unique', 'device',
];

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

  const columns = useMemo(() => {
    const cols = {};
    for (const row of rows) {
      for (const col in row) {
        if (!cols[col]) {
          cols[col] = {};
          if (filterableCols.includes(col)) {
            cols[col].filterable = true;
          }
        }
      }
    }
    return cols;
  }, [rows]);

  return (
    <div>
      Table: <Dropdown
        options={tableNames}
        selected={table}
        onChange={setTable}
      />
      <Table
        columns={columns}
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
