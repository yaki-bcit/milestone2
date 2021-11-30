const express = require("express");
const bodyParser = require("body-parser");
const rndStr = require('unique-string');
const fs = require('fs').promises;
const urlParseLax = require('url-parse-lax');
const PORT = process.env.PORT || 8007;
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const dbName = "database.json";
let dbContent;

const readDB = (file) => {
  fs.readFile(file, 'utf8')
    .then(data => {
      dbContent = JSON.parse(data);
      return dbContent;
    })
    .catch(err => console.log(err));
};

readDB(dbName);

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("createCard");
});

app.get("/people/:id", (req, res) => {
  const id = req.params.id;
  const userData = dbContent['users'].find(userRecord => userRecord.id === id);
  if (userData === undefined) {
    res.status(404).redirect('/404');
  } else {
    res.render("cardTemplate", {
      fullName: userData['fullName'],
      aboutMe: userData['aboutMe'],
      githubUrl: userData['githubUrl'],
      twitterUrl: userData['twitterUrl'],
      favoriteBooks: userData['favoriteBooks'],
      knownTechnologies: userData['knownTechnologies'],
      role: userData['role'],
      location: userData['location'],
      myPictures: userData['myPictures'],
    });
  }
});

app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.post("/cardcreated", urlencodedParser, (req, res) => {
  console.log(req.body);
  let user = {
    id: req.body['fullName'].split(' ').join('-').toLowerCase() + '-' + rndStr().slice(0, 5)
  };
  const infoItems = [
    'fullName', 
    'aboutMe', 
    'knownTechnologies', 
    'githubUrl', 
    'twitterUrl', 
    'favoriteBooks'
  ];
  for (const item of infoItems) {
    console.log(item);
    if (req.body[item] && req.body[item] !== '') {
      switch (item) {
        case 'githubUrl':
        case 'twitterUrl':
          user[item] = urlParseLax(req.body[item]).href;
          break;
        case 'favoriteBooks':
          user[item] = req.body[item].split(',');
          break;
        default:
          user[item] = req.body[item];
          break;
      }
    }
  }

  dbContent['users'].push(user);
  const userpath = `/people/${user['id']}`;
  fs.writeFile(dbName, JSON.stringify(dbContent), 'utf8')
    .then(() => readDB(dbName))
    .then(() => res.redirect(userpath))
    .catch(err => console.log(err))
});

app.get('/404', (req, res) => {
  res.status(404).render('404');
})

app.use((req, res, next) => {
  res.status(404).render('404');
})

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
