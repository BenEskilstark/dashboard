const {selectQuery, updateQuery, upsertQuery, writeQuery} = require('./dbUtils');

const TABLE_TO_COLS = {
  'site_visits':
    ['hostname', 'path', 'map', 'num_visits', 'num_unique_visits', 'last_visited'],
  'ant_scores':
    ['id', 'username', 'map', 'game_time', 'queens', 'ants', 'species'],
  'visits':
    ['site', 'num_visits', 'last_visited'],
  'ant_sessions':
    [
      'hostname', 'username', 'map', 'is_unique', 'ending', 'ants',
      'play_minutes', 'device', 'species', 'queens',
    ],
};

const getDashboardData = (req, res, next) => {
  const {table} = req.query;
  // would want to abstract this across all column names if
  // doing server-side filtering
  const query = {};
  // if (hostname != null && hostname != '*') {
  //   query.hostname = hostname;
  // }

  selectQuery(
    table,
    TABLE_TO_COLS[table],
    // 'site_visits',
    // ['hostname', 'path', 'map', 'num_visits', 'num_unique_visits', 'last_visited'],
    query,
  ).then((result) => {
    res.status(200).send(result.rows);
    return;
  }).catch((err) => {
    console.log('failed to read score');
    console.log(err);
    res.status(500).send({error: err});
  });
};


// ------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------

const getDisplayTime = (millis) => {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const leftOverSeconds = seconds - (minutes * 60);
  let leftOverSecondsStr = leftOverSeconds == 0 ? '00' : '' + leftOverSeconds;
  if (leftOverSeconds < 10 && leftOverSeconds != 0 ) {
    leftOverSecondsStr = '0' + leftOverSecondsStr;
  }

  return `${minutes}:${leftOverSecondsStr}`;
}

module.exports = {
  getDashboardData,
};
