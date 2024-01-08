let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let pg = require('pg');
let app = express();

const config = {
    user: 'recipe_app',
    database: 'recipe_book_db',
    password: 'secret',
    port: 5432                  // Default port
};

let pool = new pg.Pool(config);

// Assign Dust engine to .dust files
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM recipes', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('index', {recipes: result.rows})
        })
    })
});

app.post('/add', (req, res) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions]);
        
        done();
        res.redirect('/');
    })
});

//Server
app.listen(3000, () => {
    console.log("Server started on Port 3000");
});