# When Is It On?

Allows you to search a TV Show name and find out when the next episode will be. Live @ http://whenisiton.fizzled.me

It started out mostly as an excuse to work on my nonexistent CSS skills.

It's pretty much 100% client-side JavaScript that makes it work. The [Express](https://github.com/expressjs/express/) server just serves the index page. CSS is processed using [postcss](https://github.com/postcss/postcss) and [postcss-cssnext](https://github.com/MoOx/postcss-cssnext) with the [postcss-middleware](https://github.com/jedmao/postcss-middleware).

###### Install and Run Locally:
    $ git clone https://github.com/m4tta/whenisiton.git
    $ npm install
    $ bower install
    $ npm start

## TODO
- ~~Make it responsive~~

## License
MIT
