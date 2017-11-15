class Video {
  /**
   * Finnur container fyrir myndbönd.
   * Bindur submit eventhandler við form.
   */
  constructor() {
    this.container = document.querySelector('.videolist');
    this.data = null;
    this.url = 'video.html?id=';
    console.log('container fundinn', this.container);
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
      console.log(request);
      this.data = request.response;
      console.log(this.data.videos[0]);
      console.log(this.data.categories);
      this.createCategory(this.data);
    };
    request.send();
  }

  /**
   * Tekur við title sem streng og date sem Date hlut
   * Vistar sem json gögn í localStorage undir this.keyName
   */
  save(title, date) {
    const data = { title, date };
    const json = JSON.stringify(data);

    window.localStorage.setItem(this.keyName, json);
  }

  /**
   * Handler fyrir submit á formi.
   * Sækir gögn úr formi og kallar í this.parseDate()
   * Vistar gögn með this.save() og sýnir niðurteljara með this.create()
   */
  submit(e) {
    e.preventDefault();

    const title = this.form.querySelector('input[type=text]');
    const dags = this.form.querySelector('input[type=date]');
    const time = this.form.querySelector('input[type=time]');
    const date = this.parseDate(dags.value, time.value);

    console.log('titill er', title.value);
    console.log('date er', date.toString());

    this.save(title.value, date);

    this.load();
  }

  /**
   * Tekur við:
   *  - date sem tölu í millisek
   * Skilar streng sem lýsir hversu gamall hluturinn er
   */
  parseDate(date, time) {
    return new Date(`${date}T${time}:00`);
  }

  /**
   * 
   */
  createCategory(data) {
    const category = data.categories;
    console.log(typeof category);
    console.log(Object.entries(category));

    Object.keys(category).forEach(key =>
      this.container.appendChild(this.addElements(this.data, category[key])));
  }

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
    // const id = [5, 1, 2];
    console.log(category);
    console.log(id);
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
        this.data.videos[key - 1].title,
        this.data.videos[key - 1].poster,
        this.data.videos[key - 1].created,
        key,
      )));

    el.appendChild(videos);
    return el;
  }

  createElement(title, image, date, id) {
    const el = document.createElement('a');
    console.log(this.url + id);

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

  /**
   * Tekur við remaining sem eru millisekúndur í dagsetningu sem talið er
   * niður í.
   * Útbýr og skilar element sem inniheldur element fyrir daga, klukkustundir,
   * mínútur og sekúndur þar til remaining gerist. Hver „partur“ er búinn til
   * með kalli í this.createElement
   */
  countdown(remaining) {
    const totalSecs = remaining / 1000;

    const days = Math.floor(totalSecs / (60 * 60 * 24));
    const hours = Math.floor(totalSecs / (60 * 60)) % 24;
    const mins = Math.floor((totalSecs / 60) % 60);
    const secs = Math.floor(totalSecs % 60);

    const container = document.createElement('div');
    container.classList.add('countdown__container');

    container.appendChild(this.createElement(days, 'Dagar'));
    container.appendChild(this.createElement(hours, 'Klst'));
    container.appendChild(this.createElement(mins, 'Min'));
    container.appendChild(this.createElement(secs, 'Sek'));

    return container;
  }

  /**
   * Telur niður.
   * Fjarlægir allt úr this.element (ef eitthvað er þar) og athugar síðan hvort
   * this.date (dagsetning sem talið er niður að) sé liðin og ef svo er birtir
   * textann "Komið!" og stoppa teljara með this.stopCounter()
   * Ef ekki liðið uppfærir teljara með því að bæta element úr this.countdown()
   * við this.element
   */
  count() {
    if (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }

    const diff = this.date - new Date();

    if (diff <= 0) {
      this.element.appendChild(document.createTextNode('Komid!'));
      this.stopCounter();
    } else {
      const countdown = this.countdown(diff);
      this.element.appendChild(countdown);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const video = new Video();
  video.load();
});
