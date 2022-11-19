import card from '../partials/card.hbs';
import root from './vars';
const apiKey = '563492ad6f91700001000001936884ad8290495a828d68f994011b93';

export default {
  searchQuery: '',
  page: 1,
  fetchImages() {
    const url = `https://api.pexels.com/v1/search?query=${this.query}&page=${this.page}&per_page=12`;
    const options = {
      headers: { Authorization: apiKey },
    };

    return fetch(url, options)
      .then(response => response.json())
      .then(imagesData => {
        this.incrementPage();
        return imagesData;
      });
  },
  createMarkup(data) {
    const galery = card(data);
    root.gallery.insertAdjacentHTML('beforeend', galery);
  },
  resetPage() {
    this.page = 1;
  },
  incrementPage() {
    this.page += 1;
  },
  get query() {
    return this.searchQuery;
  },
  set query(value) {
    this.searchQuery = value;
  },
  scrollToEnd() {
    document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  },
  setImageIndex() {
    const images = document.querySelectorAll('ul img');
    images.forEach((image, index) => {
      image.dataset.index = index;
    });
  },
};
