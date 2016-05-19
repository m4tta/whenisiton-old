(function() {
  var searchfield = document.getElementById('searchfield');

  function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

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

  // Gets the next episode if it can. Fallbacks to previous episode
  // can determine if episode is past or future by the airdate property
  function getEpisode(showObject, callback) {
    getJSON(`http://api.tvmaze.com/lookup/shows?imdb=${showObject.imdbID}`, function(err, data) {
      if (err) {
        callback(err);
      } else {
        if (data._links.nextepisode) {
          getJSON(data._links.nextepisode.href, function(err, data) {
            callback(null, data);
          });
        } else if (data._links.previousepisode){
          getJSON(data._links.previousepisode.href, function(err, data) {
            callback(null, data);
          });
        }
        else {
          callback('No episodes');
        }
      }
    });
  }

  function autoCompleteResults(query) {
    var resultsElement = document.getElementById('results');
    searchSeries(query, function(err, results) {
      // no results
      if (results.Response == 'False' || err) {
        if (searchfield.value == '') {
          resultsElement.innerHTML = '';
        }
        return;
      };
      uiActions.showSearch();
      resultsElement.innerHTML = ''; // clear the 'ul' between repopulation
      var filteredShows = results.Search.filter(function(show) {
        if (show.Year.length == 5) return show;
      });
      var resultsLimit = (filteredShows.length < 6) ? filteredShows.length : 6;
      for (var i = 0; i < resultsLimit; i++) {
        let show = filteredShows[i];
        var li = document.createElement('li'); // create 'li' for each show
        li.onclick = function() {
          searchfield.value = show.Title;
          // start loading animation somewhere
          getEpisode(show, function(err, res) {
            // stop loading animation
            if (err) {
              // TODO: Handle the error for when there is no episodes at all
              var errorText = document.getElementById('error-text');
              errorText.innerHTML = err;
              uiActions.showError();
            } else {
              var synopsisText = document.getElementById('synopsis-text');
              var airdate = document.getElementById('airdate');
              var airdateFromnow = document.getElementById('airdate-fromnow');
              var episodeTitle = document.getElementById('episode-title');
              var episodeNumber = document.getElementById('episode-number');
              var showPoster = document.getElementById('show-poster');
              showPoster.setAttribute('src', show.Poster);
              showPoster.setAttribute('data-src', 'holder.js/100x148?bg=333333');
              episodeTitle.innerHTML = res.name;
              var episodeNumberString = `Episode ${res.season}x${pad(res.number, 2)}`;
              episodeNumber.innerHTML = episodeNumberString;
              var tempDiv = document.createElement('div');
              tempDiv.innerHTML = res.summary;
              res.summary = tempDiv.textContent || tempDiv.innerText || "";
              synopsisText.innerHTML = res.summary != '' ? res.summary : 'No summary available';
              var date = moment(res.airstamp);
              airdate.innerHTML = `${date.format('dddd, MMMM Do YYYY')}`;
              airdateFromnow.innerHTML = date.isBefore(moment()) ? `Aired ${date.fromNow()}` : `Airing ${date.fromNow()}`;
              uiActions.showEpisode();
            }
            // Apply placeholder images for shows that have no poster.
            Holder.run();
          });
        };
        var img = document.createElement('img'); // poster image
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

  searchfield.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) { // Enter
    }
  });

  searchfield.addEventListener('input', function() {
    uiActions.showSearch();
    autoCompleteResults(searchfield.value);
  });

})();
