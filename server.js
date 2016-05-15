var express = require('express');
var handlebars = require('express-handlebars');
var tvdb = require('./app/services/tvdbAPI')
var app = express();

app.set('views', 'app/views');
var hbsConfig = {
    defaultLayout: 'main',
    layoutsDir: 'app/views/layouts',
    partialsDir: 'app/views/partials'
};
app.engine('handlebars', handlebars(hbsConfig));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(3000);