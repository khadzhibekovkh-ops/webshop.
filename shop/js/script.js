// Инициализация корзины
const cart = new Cart();

// Текущее состояние фильтров
let currentCategory = 'all';
let currentSearch = '';

// Ссылки на DOM-элементы
const catalogEl = document.getElementById('catalog');
const cartCounterEl = document.getElementById('cartCounter');
const cartModalEl = document.getElementById('cartModal');
const cartListEl = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');

// === ОТОБРАЖЕНИЕ ТОВАРОВ ===
function renderProducts(list) {
  catalogEl.innerHTML = '';

  if (list.length === 0) {
    catalogEl.innerHTML = '<p class="empty">Ничего не найдено</p>';
    return;
  }

  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p class="price">${product.price.toLocaleString('ru-RU')} ₽</p>
      <button class="add-to-cart" data-id="${product.id}">В корзину</button>
    `;
    catalogEl.appendChild(card);
  });

  setupAddToCartButtons();
}

// === ФИЛЬТРАЦИЯ И ПОИСК ===
function getFilteredProducts() {
  return products.filter(product => {
    const matchesCategory =
      currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function updateCatalog() {
  renderProducts(getFilteredProducts());
}

// === ОБРАБОТЧИКИ КНОПОК "В КОРЗИНУ" ===
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(button => {
    button.addEventListener('click', event => {
      const productId = parseInt(event.target.dataset.id);
      const product = products.find(p => p.id === productId);
      if (product) {
        cart.addItem(product);
        updateCartCounter();
        event.target.textContent = '✓ Добавлено';
        setTimeout(() => {
          event.target.textContent = 'В корзину';
        }, 1000);
      }
    });
  });
}

// === СЧЁТЧИК КОРЗИНЫ ===
function updateCartCounter() {
  cartCounterEl.textContent = cart.getTotalCount();
}

// === МОДАЛЬНОЕ ОКНО КОРЗИНЫ ===
function openCartModal() {
  renderCartItems();
  cartModalEl.classList.add('open');
}

function closeCartModal() {
  cartModalEl.classList.remove('open');
}

function renderCartItems() {
  cartListEl.innerHTML = '';

  if (cart.items.length === 0) {
    cartListEl.innerHTML = '<p class="empty">Корзина пуста</p>';
    cartTotalEl.textContent = '0';
    return;
  }

  cart.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item__info">
        <div class="cart-item__name">${item.product.name}</div>
        <div class="cart-item__price">
          ${item.quantity} × ${item.product.price.toLocaleString('ru-RU')} ₽
        </div>
      </div>
      <button class="cart-item__remove" data-id="${item.product.id}">✕</button>
    `;
    cartListEl.appendChild(row);
  });

  cartTotalEl.textContent = cart.getTotalPrice().toLocaleString('ru-RU');

  // Обработчики удаления
  cartListEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      cart.removeItem(id);
      renderCartItems();
      updateCartCounter();
    });
  });
}

// === ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ ===
function setupEventListeners() {
  // Фильтры
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      updateCatalog();
    });
  });

  // Поиск
  searchInput.addEventListener('input', e => {
    currentSearch = e.target.value;
    updateCatalog();
  });

  // Открытие/закрытие корзины
  document.getElementById('cartBtn').addEventListener('click', openCartModal);
  document.getElementById('modalClose').addEventListener('click', closeCartModal);
  cartModalEl.addEventListener('click', e => {
    if (e.target === cartModalEl) closeCartModal();
  });

  // Оформление заказа
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.items.length === 0) {
      alert('Корзина пуста');
      return;
    }
    alert('Заказ оформлен! Спасибо за покупку.');
    cart.clear();
    renderCartItems();
    updateCartCounter();
    closeCartModal();
  });
}

// === ЗАПУСК ===
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  updateCartCounter();
  setupEventListeners();
});