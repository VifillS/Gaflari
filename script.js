class Video {
  /**
   * Finnur container fyrir myndbönd.
   */
  constructor() {
    this.container = document.querySelector('.videolist');
    this.data = null;
    this.url = window.location.href.concat('video.html?id=');
  }

  /**
   * Sækir gögn úr videos.json og býr til alla viðeigandi containera
   * og thumbnails
   */
  load() {
    const request = new XMLHttpRequest();
    request.open('GET', '/videos.json');
    request.responseType = 'json';
    request.onload = () => {
      this.data = request.response;
      this.createCategory(this.data);
    };
    request.send();
  }

  /**
   * Tekur við:
   *  - date sem tölu í millisek
   * Skilar streng sem lýsir hversu gamall hluturinn er
   */
  parseDate(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    const months = Math.floor(seconds / (60 * 60 * 24 * 30));
    const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor(seconds / 60);
    if (years > 1) {
      return ('Fyrir ').concat(years.toString().concat(' árum síðan'));
    }
    if (years === 1) {
      return ('Fyrir ').concat(years.toString().concat(' ári síðan'));
    }
    if (months > 1) {
      return ('Fyrir ').concat(months.toString().concat(' mánuðum síðan'));
    }
    if (months === 1) {
      return ('Fyrir ').concat(months.toString().concat(' mánuði síðan'));
    }
    if (weeks > 1) {
      return ('Fyrir ').concat(weeks.toString().concat(' vikum síðan'));
    }
    if (weeks === 1) {
      return ('Fyrir ').concat(weeks.toString().concat(' viku síðan'));
    }
    if (days > 1) {
      return ('Fyrir ').concat(days.toString().concat(' dögum síðan'));
    }
    if (days === 1) {
      return ('Fyrir ').concat(days.toString().concat(' degi síðan'));
    }
    if (hours > 1) {
      return ('Fyrir ').concat(hours.toString().concat(' klukkustundum síðan'));
    }
    if (hours === 1) {
      return ('Fyrir ').concat(hours.toString().concat(' klukkustund síðan'));
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
  minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /**
   * Tekur við:
   *  - sekúndum
   * Skilar streng sem inniheldur lengdina
   * (HH:mm:ss) eða (mm:ss) eða (m:ss)
   */
  parseDuration(duration) {
    const hours = Math.floor(duration / (60 * 60));
    const mins = Math.floor((duration / 60) % 60);
    const secs = Math.floor(duration % 60);

    const m = this.minTwoDigits(mins);
    const s = this.minTwoDigits(secs);
    const t = m.concat(':', s);

    if (hours > 0) {
      return hours.toString().concat(':', t);
    }
    return mins.toString().concat(':', s);
  }

  /**
   * Býr til container sem heldur utan um flokka
   */
  createCategory(data) {
    const category = data.categories;
    Object.keys(category).forEach(key =>
      this.container.appendChild(this.addElements(this.data, category[key])));
  }

  // TODO -- útfæra þannig að lengd myndbandsins sjáist

  /**
   * Býr til container sem heldur utan um myndbönd í flokki
   */
  addElements(data, category) {
    const id = category.videos;
    const el = document.createElement('div');
    el.classList.add('videolist__container');

    const title = document.createElement('h1');
    title.classList.add('videolist__heading');
    title.appendChild(document.createTextNode(category.title));
    el.appendChild(title);

    const videos = document.createElement('div');
    videos.classList.add('videolist__videos');

    id.forEach(key =>
      videos.appendChild(this.createElement(
        this.data.videos.find(item => item.id === key).title,
        this.data.videos.find(item => item.id === key).poster,
        this.data.videos.find(item => item.id === key).created,
        this.data.videos.find(item => item.id === key).duration,
        key,
      )));
    const separator = document.createElement('div');
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
  createElement(title, image, date, duration, id) {
    const el = document.createElement('a');
    el.classList.add('videolist__tag');
    el.href = this.url + id;
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('videolist__thumbnail');

    const mynd = document.createElement('img');
    mynd.classList.add('videolist__thumbnail__img');
    mynd.setAttribute('src', image);
    thumbnail.appendChild(mynd);

    const time = document.createElement('span');
    time.classList.add('videolist__thumbnail__duration');
    time.innerHTML = this.parseDuration(duration);
    thumbnail.appendChild(time);

    el.appendChild(thumbnail);

    const description = document.createElement('div');
    description.classList.add('videolist__description');

    const titleEl = document.createElement('h2');
    titleEl.classList.add('videolist__description__title');
    titleEl.appendChild(document.createTextNode(title));
    description.appendChild(titleEl);
    const dateEl = document.createElement('span');
    dateEl.classList.add('videolist__description__added');
    dateEl.appendChild(document.createTextNode(this.parseDate(date)));
    description.appendChild(dateEl);

    el.appendChild(description);
    const box = document.createElement('div');
    box.classList.add('videolist__box');
    box.appendChild(el);

    return box;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const video = new Video();
  video.load();
});
