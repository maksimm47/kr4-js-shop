const CART_KEY = 'kr4-cart';

function readCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const counter = document.querySelector('#cart-count');
    if (!counter) return;

    const count = readCart().reduce((sum, item) => sum + item.qty, 0);
    counter.textContent = String(count);
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !product.isAvailable) return;

    const cart = readCart();
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }

    writeCart(cart);
}

function renderCartPage() {
    const container = document.querySelector('#cart-items');
    if (!container) return;

    const cart = readCart();
    container.replaceChildren();

    cart.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return;

        const row = document.createElement('div');
        row.classList.add('cart-row');

        const title = document.createElement('span');
        title.textContent = `${product.title} × ${item.qty}`;

        const sum = document.createElement('span');
        sum.textContent = `${product.price * item.qty} руб.`;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.classList.add('button', 'remove-from-cart');
        removeButton.dataset.id = String(product.id);
        removeButton.textContent = 'Удалить';

        row.append(title, sum, removeButton);
        container.append(row);
    });

    const total = cart.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.id);
        return product ? acc + product.price * item.qty : acc;
    }, 0);

    const totalElement = document.querySelector('#cart-total');
    if (totalElement) {
        totalElement.textContent = `Итого: ${total} руб.`;
    }

    const empty = document.querySelector('#cart-empty');
    if (empty) {
        empty.hidden = cart.length !== 0;
    }
}

document.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
        addToCart(Number(addButton.dataset.id));
        return;
    }

    const removeButton = event.target.closest('.remove-from-cart');
    if (removeButton) {
        const id = Number(removeButton.dataset.id);
        writeCart(readCart().filter((item) => item.id !== id));
        renderCartPage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage();
});