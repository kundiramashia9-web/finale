/* ============================================================
   ALABASTER SHOPPING CART — localStorage based
   Redirects to checkout.html on checkout (no direct WhatsApp)
   ============================================================ */
const CART_KEY = 'alabaster_cart';

function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty += 1; }
    else { cart.push({ id, name, price, image, qty: 1 }); }
    saveCart(cart);
    showCartToast(`${name} added to cart`);
    openCartDrawer();
}

function removeFromCart(id) {
    let cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
}

function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id); }
    else { saveCart(cart); }
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });

    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;

    const itemsContainer = drawer.querySelector('.cart-drawer__items');
    const totalEl = drawer.querySelector('.cart-drawer__total-amount');
    const checkoutBtn = drawer.querySelector('.cart-drawer__checkout');
    const cart = getCart();

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-drawer__empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn btn--gold btn--sm">Browse Products</a>
            </div>`;
        totalEl.textContent = 'R0';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
            <div class="cart-item__info">
                <h4>${item.name}</h4>
                <span class="cart-item__price">R${item.price.toLocaleString()}</span>
                <div class="cart-item__qty">
                    <button onclick="updateQty('${item.id}', -1)" aria-label="Decrease">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)" aria-label="Increase">+</button>
                </div>
            </div>
            <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" aria-label="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    totalEl.textContent = `R${getCartTotal().toLocaleString()}`;
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function showCartToast(message) {
    let toast = document.getElementById('cartToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cartToast';
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ---------- Checkout: redirect to dedicated checkout page ---------- */
function checkout() {
    const cart = getCart();
    if (cart.length === 0) return;
    window.location.href = 'checkout.html';
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    const cartBtn = document.getElementById('cartToggle');
    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

    const closeBtn = document.getElementById('cartClose');
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

    const overlay = document.getElementById('cartOverlay');
    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    const checkoutBtn = document.querySelector('.cart-drawer__checkout');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
});