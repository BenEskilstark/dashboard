const {writeQuery, insertManyQuery} = require('./dbUtils');

const migrateFile = (fileName) => {
  const {rows} = require('../db_migration/' + fileName + '.js');
  console.log('migrating ' + rows.length + ' rows');
  // const start = 0;
  // const end = 1000;
  // for (let i = start; i < end; i++) {
  //   writeQuery(fileName, rows[i]);
  // }
  insertManyQuery(fileName, rows);
};

migrateFile('site_visits');
