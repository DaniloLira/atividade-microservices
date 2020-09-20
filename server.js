const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

let rawdata = fs.readFileSync('superhero.json');
var heroes = JSON.parse(rawdata);

//Get all heroes
app.get('/heroes', (req, res) => {
  console.log('Returning heroes list');
  res.send(heroes);
});


// Insert new hero
app.post('/hero', (req, res) => {
  const newHero = {
      id: heroes.length,
      name: req.body.name,
      power: req.body.power,
      pais: req.body.pais
  };

  heroes.push(newHero);

  rawHeroes = JSON.stringify(heroes)
  fs.writeFileSync('superhero.json', rawHeroes);

  console.log(`Added "${newHero.name}" to heroes`);

  res.status(202).header().send(newHero);
});


//Insert attribute into hero
app.put('/hero/**', (req, res) => {
  const id = parseInt(req.params[0]);
  const foundHero = heroes.find(subject => subject.id === id);

  if (foundHero) {
      for (let attribute in foundHero) {
          if (req.body[attribute]) {
              foundHero[attribute] = req.body[attribute];
          }
      }
      
      res.status(202).send(foundHero);
  } else {
      console.log(`Hero not found.`);
      res.status(404).send();
  }
});

console.log(`Heroes service listening on port 3000`);
app.listen(process.env.PORT || 3000);