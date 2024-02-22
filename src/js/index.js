import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  await getPictures();
}

async function getPictures() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '42513703-cc305044521a10f5f63ac2280',
        q: input.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    const pictures = response.data.hits;
    showPictures(pictures);
  } catch {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function showPictures(pictures) {
  gallery.innerHTML = '';
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
  });
}

// zrobić paginację
