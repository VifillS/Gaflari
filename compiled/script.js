'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Video = function () {
  /**
   * Finnur container fyrir myndbönd.
   */
  function Video() {
    _classCallCheck(this, Video);

    this.container = document.querySelector('.videolist');
    this.data = null;
    this.url = window.location.href.concat('video.html?id=');
  }

  /**
   * Sækir gögn úr videos.json og býr til alla viðeigandi containera
   * og thumbnails
   */


  _createClass(Video, [{
    key: 'load',
    value: function load() {
      var _this = this;

      var request = new XMLHttpRequest();
      request.open('GET', '/videos.json');
      request.responseType = 'json';
      request.onload = function () {
        _this.data = request.response;
        if (_this.data !== null) {
          _this.createCategory(_this.data);
        } else {
          _this.showError('Gat ekki hlaðið gögnum');
        }
      };
      request.onerror = function () {
        _this.showError('Gat ekki hlaðið gögnum');
        console.log(_this.container);
      };
      request.send();
    }
  }, {
    key: 'showError',
    value: function showError(value) {
      var divEl = document.createElement('div');
      divEl.classList.add('videolist__error');
      var el = document.createElement('h2');
      el.classList.add('videolist__error__text');
      el.appendChild(document.createTextNode(value));
      divEl.appendChild(el);
      this.container.appendChild(divEl);
    }
    /**
     * Tekur við:
     *  - date sem tölu í millisek
     * Skilar streng sem lýsir hversu gamall hluturinn er
     */

  }, {
    key: 'parseDate',
    value: function parseDate(date) {
      var seconds = Math.floor((new Date() - date) / 1000);
      var years = Math.floor(seconds / (60 * 60 * 24 * 365));
      var months = Math.floor(seconds / (60 * 60 * 24 * 30));
      var weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
      var days = Math.floor(seconds / (60 * 60 * 24));
      var hours = Math.floor(seconds / (60 * 60));
      var minutes = Math.floor(seconds / 60);
      if (years > 1) {
        return 'Fyrir '.concat(years.toString().concat(' árum síðan'));
      }
      if (years === 1) {
        return 'Fyrir '.concat(years.toString().concat(' ári síðan'));
      }
      if (months > 1) {
        return 'Fyrir '.concat(months.toString().concat(' mánuðum síðan'));
      }
      if (months === 1) {
        return 'Fyrir '.concat(months.toString().concat(' mánuði síðan'));
      }
      if (weeks > 1) {
        return 'Fyrir '.concat(weeks.toString().concat(' vikum síðan'));
      }
      if (weeks === 1) {
        return 'Fyrir '.concat(weeks.toString().concat(' viku síðan'));
      }
      if (days > 1) {
        return 'Fyrir '.concat(days.toString().concat(' dögum síðan'));
      }
      if (days === 1) {
        return 'Fyrir '.concat(days.toString().concat(' degi síðan'));
      }
      if (hours > 1) {
        return 'Fyrir '.concat(hours.toString().concat(' klukkustundum síðan'));
      }
      if (hours === 1) {
        return 'Fyrir '.concat(hours.toString().concat(' klukkustund síðan'));
      }
      if (minutes >= 1) {
        return minutes.toString().concat(' mínutur');
      }
      return Math.floor(seconds).toString().concat(' sekúndur');
    }

    /**
     * Hjálparfall fyrir parseDuration sem fær inn heiltölu n
     * og skilar henni aftur ef hún er stærri en 10 annars
     * bætist 0 framan á hana.
     */

  }, {
    key: 'minTwoDigits',
    value: function minTwoDigits(n) {
      return (n < 10 ? '0' : '') + n;
    }

    /**
     * Tekur við:
     *  - sekúndum
     * Skilar streng sem inniheldur lengdina
     * (HH:mm:ss) eða (mm:ss) eða (m:ss)
     */

  }, {
    key: 'parseDuration',
    value: function parseDuration(duration) {
      var hours = Math.floor(duration / (60 * 60));
      var mins = Math.floor(duration / 60 % 60);
      var secs = Math.floor(duration % 60);

      var m = this.minTwoDigits(mins);
      var s = this.minTwoDigits(secs);
      var t = m.concat(':', s);

      if (hours > 0) {
        return hours.toString().concat(':', t);
      }
      return mins.toString().concat(':', s);
    }

    /**
     * Býr til container sem heldur utan um flokka
     */

  }, {
    key: 'createCategory',
    value: function createCategory(data) {
      var _this2 = this;

      var category = data.categories;
      Object.keys(category).forEach(function (key) {
        return _this2.container.appendChild(_this2.addElements(_this2.data, category[key]));
      });
    }

    // TODO -- útfæra þannig að lengd myndbandsins sjáist

    /**
     * Býr til container sem heldur utan um myndbönd í flokki
     */

  }, {
    key: 'addElements',
    value: function addElements(data, category) {
      var _this3 = this;

      var id = category.videos;
      var el = document.createElement('div');
      el.classList.add('videolist__container');

      var title = document.createElement('h1');
      title.classList.add('videolist__heading');
      title.appendChild(document.createTextNode(category.title));
      el.appendChild(title);

      var videos = document.createElement('div');
      videos.classList.add('videolist__videos');

      id.forEach(function (key) {
        return videos.appendChild(_this3.createElement(_this3.data.videos.find(function (item) {
          return item.id === key;
        }).title, _this3.data.videos.find(function (item) {
          return item.id === key;
        }).poster, _this3.data.videos.find(function (item) {
          return item.id === key;
        }).created, _this3.data.videos.find(function (item) {
          return item.id === key;
        }).duration, key));
      });
      var separator = document.createElement('div');
      separator.classList.add('videolist__separator');
      el.appendChild(videos);
      el.appendChild(separator);
      return el;
    }
    /**
     * Býr til container sem inniheldur:
     *   - Poster fyrir myndband
     *   - lengdina á myndbandinu
     *   - titil myndbandsins
     *   - hversu langt er síðan það var sett inn
     * <div class="videolist__box">
     *   <a href=url class="videolist__tag">
     *   <div class="videolist__thumbnail">
     *     <img class= "videolist__thumbnail__img" src=image>
     *     <span class="videolist__thumbnail__duration">duration</span>
     *   <thumbnail>
     *   <div class="videolist__description">
     *     <h2 class="videolist__description__title">title</h2>
     *     <p class="videolist__description__added">added</p>
     *   </div>
     *   </a>
     * </div>
     */

  }, {
    key: 'createElement',
    value: function createElement(title, image, date, duration, id) {
      var el = document.createElement('a');
      el.classList.add('videolist__tag');
      el.href = this.url + id;
      var thumbnail = document.createElement('div');
      thumbnail.classList.add('videolist__thumbnail');

      var mynd = document.createElement('img');
      mynd.classList.add('videolist__thumbnail__img');
      mynd.setAttribute('src', image);
      thumbnail.appendChild(mynd);

      var time = document.createElement('span');
      time.classList.add('videolist__thumbnail__duration');
      time.innerHTML = this.parseDuration(duration);
      thumbnail.appendChild(time);

      el.appendChild(thumbnail);

      var description = document.createElement('div');
      description.classList.add('videolist__description');

      var titleEl = document.createElement('h2');
      titleEl.classList.add('videolist__description__title');
      titleEl.appendChild(document.createTextNode(title));
      description.appendChild(titleEl);
      var dateEl = document.createElement('span');
      dateEl.classList.add('videolist__description__added');
      dateEl.appendChild(document.createTextNode(this.parseDate(date)));
      description.appendChild(dateEl);

      el.appendChild(description);
      var box = document.createElement('div');
      box.classList.add('videolist__box');
      box.appendChild(el);

      return box;
    }
  }]);

  return Video;
}();

document.addEventListener('DOMContentLoaded', function () {
  var video = new Video();
  video.load();
});
//# sourceMappingURL=script.js.map