'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var videos = '{\n  "videos": [\n    {\n      "id": 1,\n      "title": "Lego!",\n      "created": 1509804047011,\n      "duration": 5,\n      "poster": "./videos/small.png",\n      "video": "./videos/small.mp4"\n    },\n    {\n      "id": 2,\n      "title": "Big Bunny",\n      "created": 1507804047011,\n      "duration": 62,\n      "poster": "./videos/bunny.png",\n      "video": "./videos/bunny.mp4"\n    },\n    {\n      "id": 3,\n      "title": "Prufu myndband",\n      "created": 1505904047011,\n      "duration": 3600,\n      "poster": "./videos/16-9.png",\n      "video": "./videos/bunny.mp4"\n    },\n    {\n      "id": 4,\n      "title": "Prufu myndband me\xF0 l\xF6ngum texta sem fer \xED tv\xE6r l\xEDnur",\n      "created": 1504904047011,\n      "duration": 220,\n      "poster": "./videos/16-9.png",\n      "video": "./videos/bunny.mp4"\n    },\n    {\n      "id": 5,\n      "title": "Gaflari \xED sundi",\n      "created": 1504904047011,\n      "duration": 212,\n      "poster": "./videos/gaflari.png",\n      "video": "./videos/rickrolled.mp4"\n    }\n  ],\n  "categories": [\n    {\n      "title": "N\xFDleg myndb\xF6nd",\n      "videos": [1, 2, 5]\n    },\n    {\n      "title": "Kennslumyndb\xF6nd",\n      "videos": [1, 3, 4]\n    },\n    {\n      "title": "Skemmtimyndb\xF6nd",\n      "videos": [2, 3, 4]\n    }\n  ]\n}';

var Player = function () {
  /**
   * Finnur container fyrir myndbönd og form.
   * Bindur submit eventhandler við form.
   */
  function Player() {
    _classCallCheck(this, Player);

    this.id = this.getQueryVariable('id');
    this.container = document.querySelector('.player');
    this.videos = JSON.parse(videos).videos;
    this.video;

    // gamala
    //    this.keyName = 'countdown';
    //    this.container = document.querySelector('.countdown');
    //    this.form = document.querySelector('form');
    //
    //    // til þess að submit hafi þennan klasa sem "this" verðum við
    //    // að nota bind hér (og í öðrum föllum sem við bindum!)
    //    this.form.addEventListener('submit', this.submit.bind(this));
  }

  // tekið af 'https://css-tricks.com/snippets/javascript/get-url-variables/'
  // gerir það sem það segir að það geri


  _createClass(Player, [{
    key: 'getQueryVariable',
    value: function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i += 1) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return false;
    }

    /**
     * Sækir gögn úr video.json og býr til alla viðeigandi containera
     * og thumbnails
     */

  }, {
    key: 'load',
    value: function load() {
      var video = this.videos[this.id - 1];

      var headEl = document.createElement('h1');
      headEl.appendChild(document.createTextNode(video.title));
      headEl.setAttribute('class', 'title');
      document.querySelector('main').prepend(headEl);

      var vidEl = document.createElement('video');
      vidEl.setAttribute('src', video.video);
      vidEl.setAttribute('poster', video.poster);
      vidEl.setAttribute('controls', 'True');
      //this.video = vidEl;
      this.container.prepend(vidEl);

      // setja eventlistenera
      document.getElementById('playPause').addEventListener("click", this.playPause);
      document.getElementById('muteUnmute').addEventListener("click", this.muteUnmute);
      document.getElementById('fullscreen').addEventListener("click", this.fullscreen);
      document.getElementById('forward').addEventListener("click", this.forward);
      document.getElementById('back').addEventListener("click", this.back);
    }

    // TODO setja video sem class attibute

  }, {
    key: 'playPause',
    value: function playPause() {
      var video = document.querySelector('video');
      if (video.paused) {
        video.play();
        document.getElementById('playPause').setAttribute('src', './img/pause.svg');
      } else {
        video.pause();
        document.getElementById('playPause').setAttribute('src', './img/play.svg');
      }
    }
  }, {
    key: 'muteUnmute',
    value: function muteUnmute() {
      var video = document.querySelector('video');
      if (video.muted) {
        video.muted = false;
        document.getElementById('muteUnmute').setAttribute('src', './img/mute.svg');
      } else {
        video.muted = true;
        document.getElementById('muteUnmute').setAttribute('src', './img/unmute.svg');
      }
    }

    // tekid af netinu - endurskoda en samt ekki

  }, {
    key: 'fullscreen',
    value: function fullscreen() {
      var video = document.querySelector('video');
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen(); // Firefox
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Chrome and Safari
      }
    }
  }, {
    key: 'forward',
    value: function forward() {
      var video = document.querySelector('video');
      video.currentTime += 15;
    }
  }, {
    key: 'back',
    value: function back() {
      var video = document.querySelector('video');
      video.currentTime -= 15;
    }
  }]);

  return Player;
}();

document.addEventListener('DOMContentLoaded', function () {
  var player = new Player();
  player.load();
});

//# sourceMappingURL=player-compiled.js.map