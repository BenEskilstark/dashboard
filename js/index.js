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

const rowToKey = (row) => {
  if (!row.hostname || !row.path) return false;
  return row.hostname + '_' + row.path + '_' + row.map;
}

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

          // display difference since last visit
          const primaryKey = rowToKey(row);
          if (primaryKey) {
            const prevVal = localStorage.getItem(primaryKey);
            if (prevVal) {
              const {num_visits, num_unique_visits} = JSON.parse(prevVal);
              localStorage.setItem(primaryKey, JSON.stringify({
                num_visits: row.num_visits,
                num_unique_visits: row.num_unique_visits,
              }));
              row.num_visits = row.num_visits + " (+ " + (row.num_visits - num_visits) + ")";
              row.num_unique_visits =
                row.num_unique_visits + " (+ " + (row.num_unique_visits - num_unique_visits) + ")";
            } else {
              localStorage.setItem(primaryKey, JSON.stringify({
                num_visits: row.num_visits,
                num_unique_visits: row.num_unique_visits,
              }));
            }

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
          if (col == 'num_visits' || col == 'num_unique_visits') {
            cols[col].sortFn = (a, b) => {
              let numA = parseInt(a[col].split(' ')[0]) || 0;
              let numB = parseInt(b[col].split(' ')[0]) || 0;
              return numA - numB;
            }
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
