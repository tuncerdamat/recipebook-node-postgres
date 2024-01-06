let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let pg = require('pg');
let app = express();

let connectionString = "postgres://recipe_app:secret@localhost/recipe_book_db";

// Assign Dust engine to .dust files
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
})

//Server
app.listen(3000, () => {
    console.log("Server started on Port 3000");
});