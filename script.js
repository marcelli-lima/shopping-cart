const containerFather = document.querySelector('.cart__items');

function setLocalStorage() {
  const cartItemsList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItemsList', cartItemsList);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 3
function cartItemClickListener(event) {
  event.target.remove(); 
  setLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2
const productCart = async (event) => {
  const evento = event.target;
  const ids = getSkuFromProductItem(evento.parentNode);
  const result = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const data = await result.json();
 //  console.log(data);
  containerFather.appendChild(createCartItemElement(data));
  setLocalStorage();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', productCart);

  return section;
}

// requisito 1
const fetchApi = async () => {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await result.json();
  data.results.forEach((items) => {
    const objetos = {
      sku: items.id,
      name: items.title,
      salePrice: items.price,
      image: items.thumbnail,
    };
    const father = document.querySelector('.items');
    father.appendChild(createProductItemElement(objetos));
  });
};

// requisito 6
const createClearButton = () => {
  const clearButton = document.getElementsByClassName('empty-cart')[0];
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const cartCust = document.getElementsByClassName('total-price')[0];
  clearButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    cartCust.innerText = 0;
    localStorage.clear();
  });
};

// requisito 4
function getLocalStorage() {
  containerFather.innerHTML = localStorage.getItem('cartItemsList');
  const item = document.querySelectorAll('.cart__item');
  item.forEach((i) => {
    i.addEventListener('click', cartItemClickListener);
  });
}

window.onload = function onload() {
  fetchApi();
  getLocalStorage();
  createClearButton();
 };