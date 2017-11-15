class Video {
  /**
   * Finnur container fyrir myndbönd.
   * Bindur submit eventhandler við form.
   */
  constructor() {
    this.container = document.querySelector('.videolist');
    this.data = null;
    this.url = 'video.html?id=';
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
    const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
    if (weeks > 1) {
      return ('Fyrir ').concat(weeks.toString().concat(' vikum síðan'));
    }
    // if (weeks === 1) {
    //   return ('Fyrir ').concat(weeks.toString().concat(' viku síðan'));
    // }
    const days = Math.floor(seconds / (60 * 60 * 24));
    if (days > 1) {
      return ('Fyrir ').concat(days.toString().concat(' dögum síðan'));
    }
    if (days === 1) {
      return ('Fyrir ').concat(days.toString().concat(' degi síðan'));
    }
    const hours = Math.floor(seconds / (60 * 60));
    if (hours > 1) {
      return ('Fyrir ').concat(hours.toString().concat(' klukkustundum síðan'));
    }
    if (hours === 1) {
      return ('Fyrir ').concat(hours.toString().concat(' klukkustund síðan'));
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 1) {
      return minutes.toString().concat(' mínutur');
    }
    return Math.floor(seconds).toString().concat(' sekúndur');
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
   * Býr til element sem heldur utan um thumbnail:
   * <div class="videolist__box">
   *   <a href=...>
   *     <img class= "videolist__img" src=url>
   *   <div class="videolist__description">
   *     <h2 class="videolist__description__title">title</h2>
   *     <p class="videolist__description__added">added</p>
   *   </div>
   *   </a>
   * </div>
   * og skilar element
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
        key,
      )));
    const separator = document.createElement('div');
    separator.classList.add('videolist__separator');
    el.appendChild(videos);
    el.appendChild(separator);
    return el;
  }

  createElement(title, image, date, id) {
    const el = document.createElement('a');

    el.href = this.url + id;

    const mynd = document.createElement('img');
    mynd.classList.add('videolist__img');
    mynd.setAttribute('src', image);
    el.appendChild(mynd);

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

  /**
   * Eyðir niðurteljara með því að fjarlægja úr localStorage og
   * fjarlægja allt úr this.container.
   * Kallar líka í this.stopCounter() og this.showForm()
   */
  delete() {
    window.localStorage.removeItem(this.keyName);

    this.stopCounter();
    this.showForm();

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const video = new Video();
  video.load();
});