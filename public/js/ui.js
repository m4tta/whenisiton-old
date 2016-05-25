var uiActions = (function() {
  var results = document.getElementById('results')
  var episode = document.getElementById('episode-details')
  var error = document.getElementById('error')
  var synopsisCover = document.getElementById('synopsis-cover');
  var searchField = document.getElementById('searchfield');
  var elements = [results, episode, error];
  var functions = {};

  searchfield.addEventListener('focus', function (e) {
    searchfield.select();
  })

  synopsisCover.addEventListener('click', function() {
    synopsisCover.classList.add('hidden');
  });

  functions.showEpisode = function() {
    elements.forEach(function(element) {
      element.classList.add('hidden');
    });
    episode.classList.remove('hidden');
    synopsisCover.classList.remove('hidden'); // replace the synopsisCover
  };

  functions.showSearch = function() {
    elements.forEach(function(element) {
      element.classList.add('hidden');
    });
    results.classList.remove('hidden');
  };

  functions.showError = function() {
    elements.forEach(function(element) {
      element.classList.add('hidden');
    });
    error.classList.remove('hidden');
  };
  return functions;
})();
