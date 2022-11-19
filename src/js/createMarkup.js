import card from '../partials/card.hbs';
import root from './vars';

const createMarkup = data => {
  const galery = card(data);
  root.gallery.insertAdjacentHTML('beforeend', galery);
};
export default createMarkup;
