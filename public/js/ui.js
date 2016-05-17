var uiActions = (function() {
  var searchfield = document.getElementById('searchfield');
  var group = document.getElementById('input-group');
  var container = document.getElementById('container');
  var continput = document.getElementById('continput');
  var logo = document.getElementById('logo');
  var logoP = document.getElementById('logo-p');
  var results = document.getElementById('results')
  var episode = document.getElementById('episode')

  var elements = [episode, results, searchfield, group, container, continput, logo, logoP];

  var functions = {};

  // searchField.addEventListener('focus', function() {
  //   elements.forEach(function(element) {
  //     //element.classList.add('focus');
  //   })
  // });
  functions.goTop = function() {
    elements.forEach(function(element) {
      element.classList.add('focus');
    })
  };


  // searchField.addEventListener('blur', function() {
  //   elements.forEach(function(element) {
  //     //element.classList.remove('focus');
  //   })
  // });

  functions.goMiddle = function() {
    elements.forEach(function(element) {
      element.classList.remove('focus');
    })
  };
  return functions;
})();
