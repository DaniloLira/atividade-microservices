const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());


let rawdata = fs.readFileSync('superhero.json');
const heroes = JSON.parse(rawdata);


app.get('/heroes', (req, res) => {
  console.log('Returning heroes list');
  res.send(heroes);
});

app.post('/hero/**', (req, res) => {
  const id = parseInt(req.params[0]);
  const foundHero = heroes.find(subject => subject.id === id);

  if (foundHero) {
      for (let attribute in foundHero) {
          if (req.body[attribute]) {
              foundHero[attribute] = req.body[attribute];
              console.log(`Set ${attribute} to ${req.body[attribute]} in hero: ${id}`);
          }
      }
      res.status(202).header({Location: `http://localhost:${port}/hero/${foundHero.id}`}).send(foundHero);
  } else {
      console.log(`Hero not found.`);
      res.status(404).send();
  }
});

app.use('/img', express.static(path.join(__dirname,'img')));

console.log(`Heroes service listening on port ${port}`);
app.listen(port);