const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const { Client } = require('pg');

// Initialise postgres client
const client = new Client({
  user: 'smu',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
});


/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */

  let values = [];
  let context = "";
  let newPokemon = [];

  /////////////Query database for all pokemon///////////////

//Show form to create new pokemon

app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

//Show list of pokemon
app.get('/', (request, response) => {
  
  const client = new Client({
    user: 'smu',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let queryString = 'SELECT * FROM pokemon';
    client.query(queryString, (err, res) => {

      if (err) {
        console.error('query error:', err.stack);
      } else
      {
        newPokemon = [];
        for (i=0; i<res.rows.length; i++){
          newPokemon.push(res.rows[i]);
        };
      };
      // respond with HTML page displaying all pokemon
      // redirect to home page
      response.render("home", {pokemon: newPokemon});
      client.end();
    })
  });
});


//GET request to return HTML data about pokemon ID 2

app.get('/:id', (request, response) => {

    let client = new Client({
    user: 'smu',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
    });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let id = request.params.id;

    let queryString = 'SELECT * FROM pokemon WHERE id = $1;';
    let value = [id];

    client.query(queryString, value, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else 
      { 
        response.render("pokemon", {pokemon: res.rows[0]});
        client.end();
      };
    })
  })
})

//Get form to edit pokemon details

app.get('/:id/edit', (request, response) => {

  let client = new Client({
    user: 'smu',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let id = request.params.id;

    let queryString = 'SELECT * FROM pokemon WHERE id = $1;';
    let value = [id];

    client.query(queryString, value, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else 
      {
        response.render("edit", {pokemon: res.rows[0]});
        client.end();
      };
    });
  });
});

//Update changes to pokemon in database

app.put('/:id', (request, response) => {

  let client = new Client({
    user: 'smu',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);
    let params = request.body;

    let queryString = 'UPDATE pokemon SET name=$1, img=$2, height=$3, weight=$4 WHERE id=$5';
    let value = [params.name, params.img, params.height, params.weight, params.id];

    client.query(queryString, value, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else 
      {
        response.redirect('/' + params.id);
        client.end();
      };
    });
  });
});


app.post('/pokemon', (req, response) => {
  let params = req.body;

  let queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);'
  let values = [params.name, params.height];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else {
        console.log('query result:', res);

        // redirect to home page
        response.redirect('/');
      }
      client.end();
    });
  });
});


//Delete pokemon

app.delete('/:id', (req, response) => {

  let queryString = 'DELETE FROM pokemon WHERE id = $1;'
  let values = [req.params.id];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else {
        console.log('query result:', res);

        // redirect to home page
        response.redirect('/');
        client.end();
      }
      
    });
  });
});



// //Save the created pokemon into database

app.post("/", (request, response) => {

  let params = request.body;
  console.log(params);
  
  let queryString = 'INSERT INTO pokemon (num, name, img, height, weight) VALUES ($1, $2, $3, $4, $5);';
  let values = [params.num, params.name, params.img, params.height, params.height];

  let client = new Client({
    user: 'smu',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
  });

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      response.redirect("/");
      client.end();
    });
  });
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));



