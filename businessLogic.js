const fs = require('fs').promises;
const uniqueString = require('unique-string');
const dbName = "database.json";
const db

const readDB = (file) => {
  return JSON.parse(fs.readFile(file, 'utf8')
    .catch(err => console.log(err)));
};

const db = readDB(dbName);

const writeDB = (file, db) => {
  const jsonStr = JSON.stringify(db);
  fs.writeFile(file, jsonStr, 'utf8')
    .catch(err => console.log(err));
};

const fetchUser = (db, userID) => {
  const userObj = db[users].find(userRecord => userRecord.id === userID);
  return userObj;
};

const addUser = (filePath, db, userData) => {
  const newID = userData[fullName].split(' ').join('-').toLowerCase() + '-' + uniqueString().slice(0, 5);
  userData[id] = newID;
  db[users].push(userData);
  fs.writeFile()
  writeDB(filePath, db);
  return;
};

exports = {
  readDB,
  writeDB,
  fetchUser,
  addUser,

};
