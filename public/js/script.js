var searchField = document.getElementById('searchField');
var searchResultsList = document.getElementById('searchResultsList');
var searchResults = document.getElementById('searchResults');

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  xhr.send();
};

function searchSeries(query, callback) {
  getJSON(`http://api.tvmaze.com/search/shows?q=${query}`, function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
}

function nextEpisode(showObject, callback) {
  if (!showObject._links.nextepisode) {
    callback('error');
  } else {
    var nextep = showObject._links.nextepisode.href;
    getJSON(nextep, function(err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }
}

function listshows(shows) {
  searchResultsList.innerHTML = null; // clear list between repopulation
  shows.forEach(function(show) {
    var li = document.createElement('li'); // create 'li' for each show
    li.onclick = function() {
      searchField.value = show.show.name;
      searchResultsList.classList.add('hidden');
      nextEpisode(show.show, function(err, res) {
        searchResults.classList.remove('hidden');
        if (err) {
          searchResults.innerHTML = 'No Date';
        } else {
          searchResults.innerHTML = (`${show.show.name} airs on ${res.airdate}`);
        }
      });
    };
    li.appendChild(document.createTextNode(`${show.show.name} (${(show.show.premiered) ? show.show.premiered.substring(0,4) : '?'})`));
    searchResultsList.appendChild(li); // append to searchResultsList 'ul'
  });
}

searchField.addEventListener('keydown', function() {
  if (event.keyCode == 13) { // Enter
    var query = searchField.value;
    // if we only get one show back just tell us that one show.
    searchSeries(query, function(err, shows) {
      if (!err) {
        searchResultsList.classList.remove('hidden');
        if (shows.length == 1) {
          searchField.value = shows[0].show.name;
          nextEpisode(shows[0].show, function(err, res) {
            searchResultsList.classList.add('hidden');
            searchResults.classList.remove('hidden');
            if (err) {
              searchResults.innerHTML = ('No Date');
            } else {
              searchResults.innerHTML = (`${shows[0].show.name} airs on ${res.airdate}`);
            }
          });
        } else {
          listshows(shows);
        }
      }
    });
  }
});

searchField.addEventListener('input', function() {
  if (!searchField.value) {
    searchResultsList.classList.add('hidden');
  } else {
    // live search
    var query = searchField.value;
    searchSeries(query, function(err, shows) {
      if (!err && shows.length > 0) {
        searchResultsList.classList.remove('hidden');
        listshows(shows);
      }
    });
  }
});
