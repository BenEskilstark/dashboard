const axios = require('axios');
const {
  Button,
  Dropdown,
  Table,
} = require('bens_ui_components');
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect, useMemo} = React;

// get axiosInstance for URL
// for droplet
const axiosInstance = axios.create({
  baseURL: 'https://benhub.io/analytics',
});
// for heroku:
//
// const axiosInstance = axios.create({
//   baseURL: 'https://sidewalk-empire.herokuapp.com',
// });
// for localhost:
// const axiosInstance = axios;

const tableNames = [
  'site_visits',
  'ant_scores', 'ant_sessions',
  'blog_users', 'blog_comments',
];
const filterableCols = [
  'hostname', 'path', 'map',
  'username', 'species',
  'ending', 'is_unique', 'device',
];

const maxWidthCols = {
  last_visited: 13,
  path: 32,
  username: 16,
  hostname: 25,
};

function Main(props) {
  const [table, setTable] = useState('site_visits');
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [inRefresh, setInRefresh] = useState(true);

  // getting data
  useEffect(() => {
    axiosInstance
      .get('/dashboard', {params: {table}})
      .then(res => {
        console.log(JSON.stringify(res.data));
        setInRefresh(false);
        let rows = [];
        for (const row of res.data) {
          if (row.game_time) {
            row.game_time = getDisplayTime(row.game_time);
          }
          rows.push(row);
        }
        setRows(rows)
      });
  }, [table, refresh]);

  const columns = useMemo(() => {
    const cols = {};
    for (const row of rows) {
      for (const col in row) {
        if (!cols[col]) {
          cols[col] = {};
          if (filterableCols.includes(col)) {
            cols[col].filterable = true;
          }
          if (maxWidthCols[col]) {
            cols[col].maxWidth = maxWidthCols[col];
          }
        }
      }
    }
    return cols;
  }, [rows, refresh]);

  return (
    <div>
      Table: <Dropdown
        options={tableNames}
        selected={table}
        onChange={setTable}
      />{' '}
      <Button
        label={inRefresh ? "Loading" : "Refresh"}
        onClick={() => {
          setInRefresh(true);
          setRows([]);
          setRefresh((refresh + 1) % 2);
        }}
      />
      <Table
        columns={columns}
        rows={rows}
      />
    </div>
  );
}


const getDisplayTime = (millis) => {
  const seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  const leftOverSeconds = seconds - (minutes * 60);
  let leftOverSecondsStr = leftOverSeconds == 0 ? '00' : '' + leftOverSeconds;
  if (leftOverSeconds < 10 && leftOverSeconds != 0 ) {
    leftOverSecondsStr = '0' + leftOverSecondsStr;
  }
  let hours = 0;
  let minuteStr = '' + minutes;
  let hourStr = '';
  if (minutes > 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);

    hourStr = hours + ':';
    minuteStr = minutes < 10 && minutes != 0
      ? '0' + minutes
      : minutes;
  }


  return `${hourStr}${minuteStr}:${leftOverSecondsStr}`;
}


function renderUI(): void {
  ReactDOM.render(
    <Main />,
    document.getElementById('container'),
  );
}
renderUI();
