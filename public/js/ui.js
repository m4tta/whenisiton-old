var uiActions = (function() {
  var searchfield = document.getElementById('searchfield');
  var inputGroup = document.getElementById('input-group');
  var container = document.getElementById('container');
  var continput = document.getElementById('continput');
  var logo = document.getElementById('logo');
  var logoP = document.getElementById('logo-p');
  var results = document.getElementById('results')
  var episode = document.getElementById('episode')
  var synopsisCover = document.getElementById('synopsis-cover');
  var elements = [episode, results, searchfield, inputGroup, container, continput, logo, logoP];
  var functions = {};

  synopsisCover.addEventListener('click', function() {
    synopsisCover.classList.add('hidden');
  });

  functions.goTop = function() {
    elements.forEach(function(element) {
      element.classList.add('focus');
    })
  };

  functions.goMiddle = function() {
    elements.forEach(function(element) {
      element.classList.remove('focus');
    })
  };
  return functions;
})();
