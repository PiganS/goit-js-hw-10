import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

refs.input.addEventListener('change', onSelectChange);

function createCatList() {
  changeVisibility(refs.loader);
  changeVisibility(refs.input);

  fetchBreeds()
    .then(data => {
      const optionsList = data
        .map(({ id, name }) => ` <option value="${id}">${name}</option>`)
        .join('');
      refs.input.innerHTML = optionsList;
      new SlimSelect({
        select: refs.input,
      });

      changeVisibility(refs.loader);
      changeVisibility(refs.input);
    })
    .catch(error => {
      Notify.failure(refs.error.textContent);
    });
}

createCatList();

function onSelectChange(evt) {
  changeVisibility(refs.loader);

  const selectedBreedId = evt.currentTarget.value;

  fetchCatByBreed(selectedBreedId)
    .then(data => {
      renderMarkupInfo(data);
      changeVisibility(refs.loader);
    })
    .catch(error => {
      Notify.failure(refs.error.textContent);
    });
}

function renderMarkupInfo(data) {
  const { breeds, url } = data[0];
  const { name, temperament, description } = breeds[0];
  const beerdCard = `<div class="cat-card">
    <img class="cat-image" src="${url}" alt="${name}">
    <div class="cat-content">
        <h2 class="cat-title">${name}</h2>
        <p class="cat-description"><strong>Description:</strong> ${description}</p>
        <p class="cat-temperament"><strong>Temperament:</strong> ${temperament}</p>
    </div>
</div>`;

  refs.catInfo.innerHTML = beerdCard;
}

function changeVisibility(el) {
  el.classList.toggle('hidden');
}
