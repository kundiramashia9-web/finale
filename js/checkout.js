/* ============================================================
   ALABASTER CHECKOUT PAGE LOGIC
   Handles payment + loyalty points + stock updates
   ============================================================ */

let selectedPayMethod = 'card';
let checkoutOrderRef = '';

document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }

    checkoutOrderRef = 'ALB-' + Date.now().toString().slice(-6);
    const refEl = document.getElementById('checkoutRef');
    if (refEl) refEl.textContent = checkoutOrderRef;

    renderCheckoutItems();
    renderLoyaltyRedeem();
});

function renderCheckoutItems() {
    const cart = getCart();
    const container = document.getElementById('checkoutItems');
    const subtotal = getCartTotal();

    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item__img" />
            <div class="checkout-item__info">
                <h4>${item.name}</h4>
                <span class="checkout-item__qty">Qty: ${item.qty}</span>
            </div>
            <span class="checkout-item__price">R${(item.price * item.qty).toLocaleString()}</span>
        </div>
    `).join('');

    document.getElementById('checkoutSubtotal').textContent = `R${subtotal.toLocaleString()}`;
    document.getElementById('checkoutTotal').textContent = `R${subtotal.toLocaleString()}`;
    document.getElementById('payBtnAmount').textContent = `R${subtotal.toLocaleString()}`;
}

function renderLoyaltyRedeem() {
    const credit = typeof getLoyaltyCredit === 'function' ? getLoyaltyCredit() : 0;
    if (credit <= 0) return;
    
    // Add loyalty redeem banner if checkout page has the slot
    const slot = document.getElementById('loyaltyRedeemSlot');
    if (!slot) return;

    slot.innerHTML = `
        <div class="loyalty-redeem-banner">
            <i class="fas fa-gift"></i>
            <div>
                <strong>You have R${credit} in rewards!</strong>
                <p>Apply it to this order at checkout. Just mention it in your order note or WhatsApp us.</p>
            </div>
        </div>
    `;
}

function selectPayMethod(method) {
    selectedPayMethod = method;
    document.querySelectorAll('.payment-method-option').forEach(el => {
        el.classList.toggle('active', el.dataset.method === method);
    });
}

function copyCheckoutBankDetails() {
    const text = `Alabaster Health & Aesthetics - Bank Transfer
Bank: Capitec
Account Name: Alabaster Health
Account Number: 1659931620
Branch Code: 953
Account Type: Savings
Reference: ${checkoutOrderRef}
Total: ${document.getElementById('checkoutTotal').textContent}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Bank details copied to clipboard');
    }).catch(() => {
        showToast('Could not copy. Please copy manually.');
    });
}

function processPayment() {
    const name = document.getElementById('payName').value.trim();
    const email = document.getElementById('payEmail').value.trim();
    const phone = document.getElementById('payPhone').value.trim();
    const address = document.getElementById('payAddress').value.trim();

    if (!name || !email || !phone) {
        showToast('Please fill in all required fields');
        return;
    }

    const cart = getCart();
    const total = getCartTotal();

    const orderData = {
        ref: checkoutOrderRef,
        name,
        email,
        phone,
        address,
        method: selectedPayMethod,
        items: cart,
        total,
        date: new Date().toISOString()
    };

    localStorage.setItem('alabaster_last_order', JSON.stringify(orderData));

    // Award loyalty points (1 point per R1)
    if (typeof addLoyaltyPoints === 'function') {
        addLoyaltyPoints(total, `Order ${checkoutOrderRef}`);
    }

    // Decrement stock for each product
    if (typeof decrementStock === 'function') {
        cart.forEach(item => decrementStock(item.id, item.qty));
    }

    if (selectedPayMethod === 'card') {
        handleCardPayment(orderData);
    } else if (selectedPayMethod === 'eft') {
        sendOrderToWhatsApp(orderData, 'EFT Bank Transfer');
        clearCartAndShowSuccess(orderData);
    } else {
        sendOrderToWhatsApp(orderData, 'WhatsApp Payment Link');
        clearCartAndShowSuccess(orderData);
    }
}

function handleCardPayment(order) {
    /* --------------------------------------------------------------
       REPLACE THIS WITH YOUR REAL YOCO PAYMENT LINK
       -------------------------------------------------------------- */
    const YOCO_LINK = 'https://pay.yoco.com/r/YOUR-YOCO-LINK-HERE';

    if (YOCO_LINK.includes('YOUR-YOCO-LINK-HERE')) {
        sendOrderToWhatsApp(order, 'Card Payment (Yoco link to be sent)');
        clearCartAndShowSuccess(order);
        return;
    }

    sendOrderToWhatsApp(order, 'Card Payment via Yoco', true);

    const url = new URL(YOCO_LINK);
    url.searchParams.set('email', order.email);
    url.searchParams.set('reference', order.ref);
    url.searchParams.set('amount', order.total);
    window.location.href = url.toString();
}

function sendOrderToWhatsApp(order, methodLabel, silent = false) {
    let text = `*NEW ORDER — ${order.ref}*%0A%0A`;
    text += `*Customer:* ${order.name}%0A`;
    text += `*Email:* ${order.email}%0A`;
    text += `*Phone:* ${order.phone}%0A`;
    if (order.address) text += `*Address:* ${order.address}%0A`;
    text += `*Payment Method:* ${methodLabel}%0A%0A`;
    text += `*Items:*%0A`;
    order.items.forEach(item => {
        text += `• ${item.name} x${item.qty} — R${(item.price * item.qty).toLocaleString()}%0A`;
    });
    text += `%0A*TOTAL: R${order.total.toLocaleString()}*%0A%0A`;
    text += `Loyalty points earned: ${order.total}%0A`;
    text += `Please confirm my order and arrange delivery/pickup.`;

    const url = `https://wa.me/27813094084?text=${text}`;
    window.open(url, '_blank');
}

function clearCartAndShowSuccess(order) {
    window._lastOrder = order;
    localStorage.removeItem('alabaster_cart');
    updateCartUI();

    const modal = document.getElementById('paymentModal');
    if (modal) {
        document.getElementById('payConfirmName').textContent = order.name;
        document.getElementById('payConfirmEmail').textContent = order.email;
        modal.querySelector('.checkout-modal__total').textContent = `R${order.total.toLocaleString()}`;
        
        // Add points earned message
        const pointsMsg = modal.querySelector('.checkout-modal__points');
        if (pointsMsg) {
            pointsMsg.innerHTML = `<i class="fas fa-star"></i> You earned <strong>${Math.floor(order.total)} points</strong>!`;
        }
        
        modal.classList.add('open');
    }
}

function showToast(msg) {
    let toast = document.getElementById('checkoutToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'checkoutToast';
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}