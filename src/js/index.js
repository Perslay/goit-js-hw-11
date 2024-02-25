import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');

let currentPage = 1;
let previousValue;
let limit = null;
let perPage = 0;

moreButton.classList.add('hidden');

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  moreButton.classList.add('hidden');

  if (input.value === previousValue) {
    loadMore();
  } else {
    await getPictures();
    gallery.innerHTML = '';
    currentPage = 1;
  }
  await getPictures(currentPage);
  previousValue = input.value;

  await Notiflix.Notify.success(`Hooray! We found ${limit} images.`);

  console.log(limit);
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
    }
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
        <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
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
