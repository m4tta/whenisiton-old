var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

app.set('port', (process.env.PORT || 3000));

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
