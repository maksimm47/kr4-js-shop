document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#products-grid');
    if (!grid) return;

    const searchInput = document.querySelector('#search-input');
    const categoryFilter = document.querySelector('#category-filter');
    const sortSelect = document.querySelector('#sort-select');
    const countElement = document.querySelector('#products-count');
    const emptyState = document.querySelector('#empty-state');
    const resetButton = document.querySelector('#reset-filters');

    const state = {
        search: '',
        category: 'all',
        sort: 'default'
    };

    function createProductCard(product) {
        const card = document.createElement('article');
        card.classList.add('product-card');

        const image = document.createElement('img');
        image.classList.add('product-card__image');
        image.src = product.image;
        image.alt = product.title;
        image.loading = 'lazy';

        const title = document.createElement('h3');
        title.textContent = product.title;

        const description = document.createElement('p');
        description.textContent = product.description;

        const price = document.createElement('p');
        price.textContent = `Цена: ${product.price} руб.`;

        const availability = document.createElement('p');
        availability.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';
        availability.classList.add(
            product.isAvailable ? 'product-card__available' : 'product-card__unavailable'
        );

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('button', 'add-to-cart');
        button.textContent = 'В корзину';
        button.dataset.id = String(product.id);
        button.disabled = !product.isAvailable;

        card.append(image, title, description, price, availability, button);
        return card;
    }

    function getVisibleProducts() {
        const query = state.search.trim().toLowerCase();

        let result = products.filter((product) => {
            const matchesSearch = product.title.toLowerCase().includes(query);
            const matchesCategory =
                state.category === 'all' || product.category === state.category;
            return matchesSearch && matchesCategory;
        });

        if (state.sort === 'price-asc') {
            result = [...result].sort((a, b) => a.price - b.price);
        }

        if (state.sort === 'price-desc') {
            result = [...result].sort((a, b) => b.price - a.price);
        }

        if (state.sort === 'title-asc') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }

    function renderCatalog() {
        const visibleProducts = getVisibleProducts();
        grid.replaceChildren();

        visibleProducts.forEach((product) => {
            grid.append(createProductCard(product));
        });

        if (countElement) {
            countElement.textContent = `Найдено товаров: ${visibleProducts.length}`;
        }

        if (emptyState) {
            emptyState.hidden = visibleProducts.length !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            state.search = event.target.value;
            renderCatalog();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (event) => {
            state.category = event.target.value;
            renderCatalog();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            state.sort = event.target.value;
            renderCatalog();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            state.search = '';
            state.category = 'all';
            state.sort = 'default';

            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (sortSelect) sortSelect.value = 'default';

            renderCatalog();
        });
    }

    renderCatalog();
});