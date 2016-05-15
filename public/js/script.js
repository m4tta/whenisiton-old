function searchSeries(query, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', `http://api.tvmaze.com/search/shows?q=${query}`, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);
            callback(data, null);
        } else {
            // We reached our target server, but it returned an error
            callback(null, 'error');
            request.onerror();
        }
    };

    request.onerror = function () {
        callback(null, 'error');
        return new Error();
        // There was a connection error of some sort
    };

    request.send();
}

function nextEpisode(showObject, callback) {
    if (!showObject._links.nextepisode) return new Error("Can't find a next episode.");
    var nextep = showObject._links.nextepisode.href;

    var request = new XMLHttpRequest();
    request.open('GET', nextep, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);
            callback(data, null);
        } else {
            // We reached our target server, but it returned an error
            callback(null, 'error');
            request.onerror();
        }
    };

    request.onerror = function () {
        callback(null, 'error');
        return new Error();
        // There was a connection error of some sort
    };

    request.send();
}

function listshows(shows) {
    var ul = document.getElementById('showlist');
    ul.innerHTML = null;
    shows.forEach(function (show) {
        var a = document.createElement('a');
        a.href = '#';
        a.onclick = function () {
            nextEpisode(show.show, function(res, err) {
                alert(`${show.show.name} airs on ${res.airdate}`);
            });
        }
        a.appendChild(document.createTextNode(`${show.show.name} (premiered ${show.show.premiered}) [${show.show.status}]`));
        var li = document.createElement('li');
        li.appendChild(a);
        ul.appendChild(li);
    });
}

var tellmebtn = document.getElementById('tellme');
tellmebtn.addEventListener('click', function () {
    var query = document.getElementById('showname').value;
    
    // if we only get one show back just tell us that one show.
    
    searchSeries(query, function(shows, err) {
        if (!err) {
            // do stuff with shows
            listshows(shows);
        }
    });
});