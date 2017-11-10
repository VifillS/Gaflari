
document.addEventListener('DOMContentLoaded', function () {
  var cars = document.querySelector('.cars')
  
  program.init(cars)
});


var program = (function() {
  // hér koma variables
  

  // hér koma föll
  function init() {
    results = document.querySelector('.results')
    input = document.querySelector('input')

    document.querySelector('button').addEventListener('click', submit)
  }

  return {
    init: init
  }
})();
