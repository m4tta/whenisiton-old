(function() {

  var searchField = document.getElementById('searchField');
  var group = document.getElementById('input-group');
  var container = document.getElementById('container');
  var continput = document.getElementById('continput');
  var logo = document.getElementById('logo');
  var logoP = document.getElementById('logo-p');

  var elements = [searchField, group, container, continput, logo, logoP];

  searchField.addEventListener('focus', function() {
    elements.forEach(function(element) {
      //element.classList.add('focus');
    })
  });

  searchField.addEventListener('blur', function() {
    elements.forEach(function(element) {
      //element.classList.remove('focus');
    })
  });

})();
