(function() {

  var searchfield = document.getElementById('searchfield');
  var resultsElement = document.getElementById('results');

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
    getJSON(`http://www.omdbapi.com/?s=${query}&type=series`, function(err, data) {
      if (err) {
        // propagate error all the way down
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }

  function nextEpisode(showObject, callback) {
    if (showObject.Year.endsWith('–')) {
      getJSON(`http://api.tvmaze.com/lookup/shows?imdb=${showObject.imdbID}`, function(err, data) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          if (data._links.nextepisode) {
            getJSON(data._links.nextepisode.href, function(err, data) {
              callback(null, data);
            });
          } else {
            callback('No date')
          }
        }
      });
    } else {
      callback('Ended');
    }
  }

  function autoCompleteResults(query) {
    searchSeries(query, function(err, results) {
      // no results
      if (results.Response == 'False') {
        if (searchfield.value == '') {
          resultsElement.innerHTML = null;
        }
        return;
      };
      resultsElement.innerHTML = null; // clear the 'ul' between repopulation
      var filteredShows = results.Search.filter(function (show) {
        if (show.Year.length == 5) return show;
      });
      var resultsLimit = (filteredShows.length < 6) ? filteredShows.length : 6;
      for (var i = 0; i < resultsLimit; i++) {
        let show = filteredShows[i];
        var li = document.createElement('li'); // create 'li' for each show
        li.onclick = function() {
          searchfield.value = show.Title;
          // start loading animation somewhere
          uiActions.goTop();
        };
        var img = document.createElement('img'); // poster image
        img.height = 60;
        img.width = 41;
        if (show.Poster.length > 5) {
          img.src = show.Poster;
        } else {
          img.setAttribute('data-src', 'holder.js/41x60?theme=sky&text=X');
        }
        li.appendChild(img);
        var span = document.createElement('span');
        span.textContent = `${show.Title} (${show.Year})`;
        li.appendChild(span);
        resultsElement.appendChild(li); // append to searchResultsList 'ul'
      }
      // Apply placeholder images for shows that have no poster.
      Holder.run();
    });
  }

  searchfield.addEventListener('keydown', function() {
    if (event.keyCode == 13) { // Enter
    }
  });

  searchfield.addEventListener('input', function() {
    uiActions.goMiddle();
    autoCompleteResults(searchfield.value);
    // var waiting = false; // Prevents calling the api before the last query returned. May change how this is done. If at all.
    // if (searchField.value.length < 2) {
    //   //searchResultsList.classList.add('hidden');
    // } else if (!waiting) {
    //   waiting = true;
    //   searchSeries(searchField.value, function(err, shows) {
    //     console.log(shows);
    //     waiting = false;
    //     if (!err && shows.Response == 'True') {
    //       //searchResultsList.classList.remove('hidden');
    //       autoCompleteResults(shows);
    //     }
    //     if (searchField.value.length < 2) {
    //       results.innerHTML = '';
    //     }
    //   });
    // }
  });

})();
