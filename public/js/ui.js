var uiActions = (function() {
  var searchfield = document.getElementById('searchfield');
  var inputGroup = document.getElementById('input-group');
  var container = document.getElementById('container');
  var continput = document.getElementById('continput');
  var logo = document.getElementById('logo');
  var logoP = document.getElementById('logo-p');
  var results = document.getElementById('results')
  var episode = document.getElementById('episode-details')
  var synopsisCover = document.getElementById('synopsis-cover');
  //var elements = [episode, results, searchfield, inputGroup, container, continput, logo, logoP];
  var elements = [results, episode];
  var functions = {};

  synopsisCover.addEventListener('click', function() {
    synopsisCover.classList.add('hidden');
  });

  functions.showEpisode = function() {
    elements.forEach(function(element) {
      element.classList.add('focus');
    })
  };

  functions.showSearch = function() {
    elements.forEach(function(element) {
      element.classList.remove('focus');
    })
    synopsisCover.classList.remove('hidden');
  };
  return functions;
})();
