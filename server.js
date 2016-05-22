var express = require('express');
var app = express();
var path = require('path');
var handlebars = require('express-handlebars');
var cssnext = require('postcss-cssnext');
var postcssMiddleware = require('postcss-middleware').default;
var csswring = require('csswring');

app.set('port', (process.env.PORT || 3000));

app.set('views', 'app/views');
var hbsConfig = {
  defaultLayout: 'main',
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials'
};
app.engine('handlebars', handlebars(hbsConfig));
app.set('view engine', 'handlebars');

app.use('/public/css', postcssMiddleware({
  src: function(req) {
    return path.join('public/css', req.url);
  },
  plugins: [
    cssnext(),
    csswring()
  ]
}));
app.use('/public', express.static('public'));


app.get('/', function(req, res) {
  res.render('index');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
