import Notiflix from 'notiflix';
import axios from 'axios';
import { simpleLightbox } from './simplelightbox.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');

let currentPage = 1;
let limit;
let newLimit;
let perPage = 0;
let previousValue;

moreButton.classList.add('hidden');

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  moreButton.classList.add('hidden');

  if (input.value === previousValue) {
    loadMore();
  } else {
    await getPictures(currentPage);
    gallery.innerHTML = '';
    currentPage = 1;

    Notiflix.Notify.success(`Hooray! We found ${newLimit} images.`);
  }
  await getPictures(currentPage);

  previousValue = input.value;
}

async function getPictures(currentPage) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '42513703-cc305044521a10f5f63ac2280',
        q: input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    const pictures = response.data.hits;
    showPictures(pictures);

    if (currentPage === 1) {
      limit = response.data.totalHits;
      perPage = pictures.length;
      newLimit = limit;
    }

    simpleLightbox();
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function showPictures(pictures) {
  pictures.forEach(picture => {
    const markup = `
      <div class="photo-card">
        <a class="link" href="${picture.largeImageURL}"><img class="thumbnail" src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>: ${picture.likes}
          </p>
          <p class="info-item">
            <b>Views</b>: ${picture.views}
          </p>
          <p class="info-item">
            <b>Comments</b>: ${picture.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>: ${picture.downloads}
          </p>
        </div>
      </div>
    `;

    gallery.insertAdjacentHTML('beforeend', markup);
    moreButton.classList.remove('hidden');
  });
}

moreButton.addEventListener('click', loadMore);

async function loadMore() {
  try {
    currentPage++;
    await getPictures(currentPage);

    limit -= perPage;

    if (limit <= 0) {
      moreButton.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {
    Notiflix.Notify.failure('Failed to load more photos');
  }
}
