import debounce from 'lodash.debounce';
import serviceApi from './serviceApi';
import root from './vars';

const searchRequest = () => {
  serviceApi.query = root.inputImageRequest.value;
  if (!serviceApi.query) {
    root.gallery.innerHTML = '';
    root.notification.classList.remove('hide');
    return;
  }
  root.gallery.innerHTML = '';
  serviceApi.resetPage();
  serviceApi
    .fetchImages()
    .then(imagesData => {
      if (imagesData.total_results === 0) {
        root.loadMoreBtn.classList.add('hide');
        root.notification.classList.remove('hide');
        return;
      }
      serviceApi.createMarkup(imagesData);
      root.notification.classList.add('hide');
      root.loadMoreBtn.classList.remove('hide');
    })
    .catch(err => {
      root.gallery.innerHTML = '';
      console.log('error', err);
    });
};

const loadMore = () => {
  serviceApi
    .fetchImages()
    .then(imagesData => {
      if (!imagesData.next_page) {
        root.loadMoreBtn.classList.add('hide');
      }
      serviceApi.createMarkup(imagesData);
      serviceApi.setImageIndex();
      serviceApi.scrollToEnd();
    })
    .catch(err => {
      root.gallery.innerHTML = '';
      console.log('error', err);
    });
};

const openModal = event => {
  event.preventDefault();
  window.addEventListener('keydown', slider);
  window.addEventListener('keydown', closeModal);
  if (event.target.nodeName === 'IMG') {
    root.modal.classList.add('is-open');
    root.modalImage.src = event.target.dataset.source;
    root.modalImage.alt = event.target.alt;
    root.modalImage.dataset.index = event.target.dataset.index;
  }
  return;
};

//При закрытии модального окна
const closeModal = event => {
  if (
    event.target.dataset.action === 'close-lightbox' ||
    event.target.className === 'lightbox__overlay' ||
    event.code === 'Escape'
  ) {
    root.modalImage.src = '';
    root.modalImage.alt = '';
    root.modalImage.classList.add('activeImg');
    root.modalImage.dataset.index = '';
    root.modal.classList.remove('is-open');
    window.removeEventListener('keydown', closeModal);
    window.removeEventListener('keydown', slider);
  }
  return;
};

//Прокрутка галлерии стрелками
const slider = event => {
  const currentImage = document.querySelector('.lightbox__content > img');
  const allImages = document.querySelectorAll('ul img');
  let indexImage = Number(root.modalImage.dataset.index);

  if (event.code === 'ArrowLeft') {
    indexImage -= 1;
    if (indexImage < 0) {
      indexImage = allImages.length - 1;
    }
    setSliderData(allImages, currentImage, indexImage);
  }

  if (event.code === 'ArrowRight') {
    indexImage += 1;
    if (indexImage >= allImages.length) {
      indexImage = 0;
    }
    setSliderData(allImages, currentImage, indexImage);
  }
  return;
};

//Добавление атрибутов изображениям в слайдере
const setSliderData = (allImages, currentImage, indexImage) => {
  currentImage.src = allImages[indexImage].dataset.source;
  currentImage.dataset.index = allImages[indexImage].dataset.index;
  currentImage.alt = allImages[indexImage].alt;
};

//Слушатели событий при открытом и закрытом модальном окне
root.inputImageRequest.addEventListener('input', debounce(searchRequest, 650));
root.gallery.addEventListener('click', openModal);
root.loadMoreBtn.addEventListener('click', loadMore);
root.modal.addEventListener('click', closeModal);
root.modalImage.addEventListener('keydown', closeModal);
