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

  constructor() {
    this.id = this.getQueryVariable('id');
    this.container = document.querySelector('.video');
    this.videos = JSON.parse(videos).videos;
    this.video;
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
    //vidEl.setAttribute('controls', 'True');
    this.video = vidEl;
    this.container.appendChild(vidEl);

    // setja eventlistenera
    document.getElementById('playPause').addEventListener("click", this.playPause.bind(this));
    document.getElementById('muteUnmute').addEventListener("click", this.muteUnmute.bind(this));
    document.getElementById('fullscreen').addEventListener("click", this.fullscreen.bind(this));
    document.getElementById('forward').addEventListener("click", this.forward.bind(this));
    document.getElementById('back').addEventListener("click", this.back.bind(this));
  }

  // TODO setja video sem class attibute

  playPause() {
    if (this.video.paused) {
      this.video.play();
      document.getElementById('playPause').setAttribute('src','./img/pause.svg');
    } else {
      this.video.pause();
      document.getElementById('playPause').setAttribute('src','./img/play.svg');
    }
  }

  muteUnmute() {
    const video = document.querySelector('video');
    if (this.video.muted) {
      this.video.muted = false;
      document.getElementById('muteUnmute').setAttribute('src','./img/mute.svg');
    } else {
      this.video.muted = true;
      document.getElementById('muteUnmute').setAttribute('src','./img/unmute.svg');
    }
  }

  // tekid af netinu - endurskoda en samt ekki
  // http://blog.teamtreehouse.com/building-custom-controls-for-html5-videos
  fullscreen() {
    if (this.video.requestFullscreen) {
      this.video.requestFullscreen();
    } else if (this.video.mozRequestFullScreen) {
      this.video.mozRequestFullScreen(); // Firefox
    } else if (this.video.webkitRequestFullscreen) {
      this.video.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  forward() {
    this.video.currentTime += 3;
  }

  back() {
    this.video.currentTime -= 3;
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const player = new Player();
  player.load();
});
