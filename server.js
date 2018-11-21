const express = require('express');
const path = require('path');

const handlebars = require('express-handlebars');
const hbs = require('express-handlebars').create();
const helpers = require('handlebars-helpers')();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const db = require('./config/db');
const port = 8000;


hbs.getPartials().then(function(partials){
	console.log(partials);
});


app.engine('handlebars', handlebars({defaultLayout:'main'}));

app.engine('hbs', handlebars({
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: 'views/layouts',
    partialsDir  : [
        //  path to your partials
        __dirname + 'views/partials',
    ]
}));


app.set('view engine', 'hbs');

app.get('/', function(req, res){
	res.render('home');
});

require('./app.js');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('dist'));
app.use(express.static('views'));


MongoClient.connect(db.url, db.config, (err, database) => {
	if(err) return console.log(err);

	 	database = database.db('tv');	
		require('./app/routes')(app, database);
		app.listen(port, () => {
		console.log('we are live on port ' + port);
		app.use(function(req,res,next){
			req.db = database; next();
		});
	});
});