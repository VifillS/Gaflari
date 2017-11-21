class Player {
  constructor() {
    this.id = this.getQueryVariable('id');
    this.container = document.querySelector('.video');
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
    const request = new XMLHttpRequest();
    request.open('GET', '/videos.json');
    request.responseType = 'json';
    request.send();
    request.onload = () => {
      this.populate(request.response);
    };

    // setja eventlistenera
    document.getElementById('playPause').addEventListener('click', this.playPause.bind(this));
    this.container.addEventListener('click', this.playPause.bind(this));
    document.getElementById('muteUnmute').addEventListener('click', this.muteUnmute.bind(this));
    document.getElementById('fullscreen').addEventListener('click', this.fullscreen.bind(this));
    document.getElementById('forward').addEventListener('click', this.forward.bind(this));
    document.getElementById('back').addEventListener('click', this.back.bind(this));
  }

  populate(data) {
    const headEl = document.createElement('h1');
    const vidEl = document.createElement('video');

    if (data.videos[this.id -1]) {
      const video = data.videos[this.id - 1];

      headEl.appendChild(document.createTextNode(video.title));

      vidEl.setAttribute('src', video.video);
      vidEl.setAttribute('poster', video.poster);
    } else {
      headEl.appendChild(document.createTextNode('Myndband fannst ekki! :('));

      vidEl.setAttribute('src', './videos/rickrolled.mp4');
    }

    headEl.setAttribute('class', 'title');
    document.querySelector('main').prepend(headEl);
    this.video = vidEl;
    this.container.appendChild(vidEl);

    if (!data.videos[this.id-1]) {
      this.playPause();
    }
  }

  // TODO setja video sem class attibute

  playPause() {
    if (this.video.paused) {
      this.video.play();
      document.getElementById('playPause').setAttribute('src', './img/pause.svg');
      this.container.classList.remove('pause');
    } else {
      this.video.pause();
      document.getElementById('playPause').setAttribute('src', './img/play.svg');
      this.container.classList.add('pause');
    }
  }

  muteUnmute() {
    if (this.video.muted) {
      this.video.muted = false;
      document.getElementById('muteUnmute').setAttribute('src', './img/mute.svg');
    } else {
      this.video.muted = true;
      document.getElementById('muteUnmute').setAttribute('src', './img/unmute.svg');
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
