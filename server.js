var express = require('express');
var handlebars = require('express-handlebars');

var app = express();

app.set('views', 'app/views');
app.engine('handlebars', handlebars({defaultLayout: 'main', layoutsDir: 'app/views/layouts', partialsDir: 'app/views/partials'}));
app.set('view engine', 'handlebars');

app.get('/', function (req,res) {
    res.render('index');
})

app.listen(3000);