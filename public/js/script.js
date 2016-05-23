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
    getJSON(`http://api.tvmaze.com/search/shows?q=${query}`, function(err, data) {
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
    if (showObject._links.nextepisode) {
      getJSON(showObject._links.nextepisode.href, function(err, data) {
        callback(null, data);
      });
    } else if (showObject._links.previousepisode) {
      getJSON(showObject._links.previousepisode.href, function(err, data) {
        callback(null, data);
      });
    } else {
      callback('No episodes');
    }
  }

  function autoCompleteResults(query) {
    var resultsElement = document.getElementById('results');
    searchSeries(query, function(err, results) {
      // no results
      if (!results || err) {
        if (searchfield.value == '') {
          resultsElement.innerHTML = '';
        }
        return;
      };
      uiActions.showSearch();
      resultsElement.innerHTML = ''; // clear the 'ul' between repopulation
      var filteredShows = results.filter(function(show) {
        if (show.show.status == 'Running') return show;
      });
      var resultsLimit = (filteredShows.length < 8) ? filteredShows.length : 8;
      filteredShows.forEach(function(resultObject, index) {
        var show = resultObject.show; //
        if (index > resultsLimit) return;
        var li = document.createElement('li'); // create 'li' for each show
        li.onclick = function() {
          searchfield.value = show.name;
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
              showPoster.setAttribute('src', show.image.medium);
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
        if (show.image && show.image.medium) {
          img.src = show.image.medium;
        } else {
          img.setAttribute('data-src', 'holder.js/41x60?theme=sky&text=X');
        }
        li.appendChild(img);
        var span = document.createElement('span');
        span.textContent = `${show.name} (${moment(show.premiered).year()})`;
        li.appendChild(span);
        resultsElement.appendChild(li); // append to searchResultsList 'ul'
      });
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
