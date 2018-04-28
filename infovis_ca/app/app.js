let express = require('express');

let app = express();

let handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.type('text/plain');
  res.send('About: Infovis Content Analysis App')
});

//---- always at the end of setting routes
app.use(express.static(__dirname + '/public'));

app.use(function(req, res) { //404 error
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found')
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to terminate...');
});