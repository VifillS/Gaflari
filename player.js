const videos = `{
  "videos": [
    {
      "id": 1,
      "title": "Lego!",
      "created": 1509804047011,
      "duration": 5,
      "poster": "./videos/small.png",
      "video": "./videos/small.mp4"
    },
    {
      "id": 2,
      "title": "Big Bunny",
      "created": 1507804047011,
      "duration": 62,
      "poster": "./videos/bunny.png",
      "video": "./videos/bunny.mp4"
    },
    {
      "id": 3,
      "title": "Prufu myndband",
      "created": 1505904047011,
      "duration": 3600,
      "poster": "./videos/16-9.png",
      "video": "./videos/bunny.mp4"
    },
    {
      "id": 4,
      "title": "Prufu myndband með löngum texta sem fer í tvær línur",
      "created": 1504904047011,
      "duration": 220,
      "poster": "./videos/16-9.png",
      "video": "./videos/bunny.mp4"
    },
    {
      "id": 5,
      "title": "Gaflari í sundi",
      "created": 1504904047011,
      "duration": 212,
      "poster": "./videos/gaflari.png",
      "video": "./videos/rickrolled.mp4"
    }
  ],
  "categories": [
    {
      "title": "Nýleg myndbönd",
      "videos": [1, 2, 5]
    },
    {
      "title": "Kennslumyndbönd",
      "videos": [1, 3, 4]
    },
    {
      "title": "Skemmtimyndbönd",
      "videos": [2, 3, 4]
    }
  ]
}`;


class Player {
  /**
   * Finnur container fyrir myndbönd og form.
   * Bindur submit eventhandler við form.
   */
  constructor() {
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
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) { return pair[1]; }
    }
    return (false);
  }

  /**
   * Sækir gögn úr video.json og býr til alla viðeigandi containera
   * og thumbnails
   */
  load() {
    const video = this.videos[this.id - 1];

    const headEl = document.createElement('h1');
    headEl.appendChild(document.createTextNode(video.title));
    headEl.setAttribute('class','title');
    document.querySelector('main').prepend(headEl);

    const vidEl = document.createElement('video');
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

  playPause() {
    const video = document.querySelector('video');
    if (video.paused) {
      video.play();
      document.getElementById('playPause').setAttribute('src','./img/pause.svg');
    } else {
      video.pause();
      document.getElementById('playPause').setAttribute('src','./img/play.svg');
    }
  }

  muteUnmute() {
    const video = document.querySelector('video');
    if (video.muted) {
      video.muted = false;
      document.getElementById('muteUnmute').setAttribute('src','./img/mute.svg');
    } else {
      video.muted = true;
      document.getElementById('muteUnmute').setAttribute('src','./img/unmute.svg');
    }
  }

  // tekid af netinu - endurskoda en samt ekki
  fullscreen() {
    const video = document.querySelector('video');
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  forward() {
    const video = document.querySelector('video');
    video.currentTime += 15;
  }

  back() {
    const video = document.querySelector('video');
    video.currentTime -= 15;
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const player = new Player();
  player.load();
});
