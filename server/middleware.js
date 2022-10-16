const {selectQuery, updateQuery, upsertQuery, writeQuery} = require('./dbUtils');

const TABLE_TO_COLS = {
  'site_visits':
    ['hostname', 'path', 'map', 'num_visits', 'num_unique_visits', 'last_visited'],
  'ant_scores':
    ['id', 'username', 'map', 'game_time', 'queens', 'ants', 'species'],
  'ant_sessions':
    [
      'hostname', 'username', 'map', 'is_unique', 'ending', 'ants',
      'play_minutes', 'device', 'species', 'queens',
    ],
  'blog_users':
    [
      'username', 'permissionlevel', 'email', 'numLogins', 'createdat', 'lastLogin',
    ],
  'blog_comments':
    [
      'username', 'thread', 'comment', 'createdat',
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
    res.status(500).send({error: err, foo: 'bar'});
  });
};

// ------------------------------------------------------------------------
// Record site visits
// ------------------------------------------------------------------------

const recordVisit = (req, res, next) => {
  const {hostname, path, map, isUnique} = req.body;
  const table = 'site_visits';
  if (!isUnique) {
    upsertQuery(
      table,
      {
        hostname, path, map,
        num_visits: 1,
        last_visited: new Date(),
      },
      {
        num_visits: table + '.num_visits + 1',
        last_visited: 'current_timestamp',
      },
      {hostname, path, map},
    ).then(() => {
      res.status(201).send({success: true});
    });
  } else {
    upsertQuery(
      table,
      {
        hostname, path, map,
        num_visits: 1,
        num_unique_visits: 1,
        last_visited: new Date(),
      },
      {
        num_visits: table + '.num_visits + 1',
        num_unique_visits: table + '.num_unique_visits + 1',
        last_visited: 'current_timestamp',
      },
      {hostname, path, map},
    ).then(() => {
      res.status(201).send({success: true});
    });
  }
};


module.exports = {
  recordVisit,
  getDashboardData,
};
