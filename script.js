class Video {
  /**
   * Finnur container fyrir myndbönd.
   * Bindur submit eventhandler við form.
   */
  constructor() {
    this.container = document.querySelector('.videolist');
    this.data = null;
    console.log('container fundinn', this.container);
    // til þess að submit hafi þennan klasa sem "this" verðum við
    // að nota bind hér (og í öðrum föllum sem við bindum!)
    // this.form.addEventListener('submit', this.submit.bind(this));
  }

  /**
   * Sækir gögn úr videos.json og býr til alla viðeigandi containera
   * og thumbnails
   */
  load() {
    console.log('rass');
    const request = new XMLHttpRequest();
    request.open('GET', 'videos.json');
    request.responseType = 'json';
    request.onload = () => {
      console.log(request);
      this.data = request.response;
      console.log(this.data.videos[0]);
      console.log(this.data.categories);
      this.create(this.data);
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
   *  - date sem streng á forminu "yyyy-mm-dd", t.d. "2017-11-06"
   *  - time sem streng á forminu "hh:mm", t.d. "09:00"
   * Skilar date hlut með gögnum úr date og time
   */
  parseDate(date, time) {
    return new Date(`${date}T${time}:00`);
  }

  /**
   * Býr til element fyrir niðurteljara og bætir við this.container
   * Setur this.date sem dagsetningu sem talið er niður að
   * Setur this.element sem element sem geymir niðurteljara
   * Bætir við "eyða" takka sem sér um að eyða niðurteljara með this.delete
   * Byrjar niðurteljara með this.startCounter() og
   * felur form með this.hideForm()
   */
  create(data) {
    const category = data.categories;
    for (const key in category) {
      console.log(key + '->' + category[key].title);
    }
  }

  /**
   * Býr til element sem heldur utan um thumbnail:
   * <div class="videolist__box">
   *   <a href=...>
   *     <img src=url>
   *   </a>
   *   <div class="videolist__description">
   *     <span class="videolist__description__title">title</span>
   *     <span class="videolist__description__added">added</span>
   *   </div>
   * </div>
   * og skilar element
   */
  addElements(data, category) {

  }

  createElement(url, title, date) {
    const el = document.createElement('div');
    el.classList.add('countdown__box');

    const numEl = document.createElement('span');
    numEl.classList.add('countdown__num');
    numEl.appendChild(document.createTextNode(date));
    el.appendChild(numEl);

    const titleEl = document.createElement('span');
    titleEl.classList.add('countdown__title');
    titleEl.appendChild(document.createTextNode(title));
    el.appendChild(titleEl);

    return el;
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
