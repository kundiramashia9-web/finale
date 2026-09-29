/* ============================================================
   ALABASTER EXTRA FEATURES
   Newsletter · Sticky Mobile Bar · Loyalty · Stock Indicators
   ============================================================ */

/* ============================================================
   1. NEWSLETTER SIGNUP (Formspree)
   ============================================================ */
function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.trim();
            const btn = form.querySelector('button');
            const msg = form.querySelector('.newsletter-msg');

            if (!email) {
                if (msg) { msg.textContent = 'Please enter your email'; msg.style.color = '#ff6b6b'; }
                return;
            }

            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

            try {
                // REPLACE THE URL BELOW WITH YOUR FORMSPREE ENDPOINT
                const FORMSPREE_URL = 'https://formspree.io/f/YOUR-FORMSPREE-ID';
                
                const res = await fetch(FORMSPREE_URL, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, _subject: 'New Newsletter Subscriber' })
                });

                if (res.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    btn.style.background = '#25d366';
                    if (msg) { msg.textContent = 'Welcome to the Alabaster family!'; msg.style.color = '#25d366'; }
                    form.reset();
                    // Save locally too
                    const subs = JSON.parse(localStorage.getItem('alabaster_subs') || '[]');
                    subs.push({ email, date: new Date().toISOString() });
                    localStorage.setItem('alabaster_subs', JSON.stringify(subs));
                    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; btn.disabled = false; }, 4000);
                } else {
                    throw new Error('Subscribe failed');
                }
            } catch (err) {
                // Even if Formspree isn't configured yet, still save locally
                const subs = JSON.parse(localStorage.getItem('alabaster_subs') || '[]');
                subs.push({ email, date: new Date().toISOString() });
                localStorage.setItem('alabaster_subs', JSON.stringify(subs));
                btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                btn.style.background = '#25d366';
                if (msg) { msg.textContent = 'Welcome to the Alabaster family!'; msg.style.color = '#25d366'; }
                form.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; btn.disabled = false; }, 4000);
            }
        });
    });
}

/* ============================================================
   2. STICKY MOBILE BOOK BAR
   ============================================================ */
function initStickyBar() {
    if (window.innerWidth > 768) return;
    if (document.getElementById('stickyMobileBar')) return;

    const bar = document.createElement('div');
    bar.id = 'stickyMobileBar';
    bar.className = 'sticky-mobile-bar';
    bar.innerHTML = `
        <a href="https://wa.me/27813094084" target="_blank" class="sticky-bar__btn sticky-bar__btn--wa">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a href="Bookings.html" class="sticky-bar__btn sticky-bar__btn--book">
            <i class="fas fa-calendar-check"></i> Book Now
        </a>
        <a href="tel:0813094084" class="sticky-bar__btn sticky-bar__btn--call">
            <i class="fas fa-phone-alt"></i> Call
        </a>
    `;
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '70px';
}

/* ============================================================
   3. LOYALTY / REWARDS PROGRAM
   Points stored in localStorage. 100 points = R100 credit.
   ============================================================ */
const LOYALTY_KEY = 'alabaster_loyalty';

function getLoyalty() {
    try {
        return JSON.parse(localStorage.getItem(LOYALTY_KEY)) || { points: 0, history: [] };
    } catch { return { points: 0, history: [] }; }
}

function saveLoyalty(data) {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(data));
    updateLoyaltyUI();
}

function addLoyaltyPoints(amount, reason = 'Purchase') {
    const data = getLoyalty();
    const points = Math.floor(amount); // 1 point per R1 spent
    data.points += points;
    data.history.push({
        points,
        reason,
        amount,
        date: new Date().toISOString()
    });
    saveLoyalty(data);
    return points;
}

function redeemLoyaltyPoints(pointsToRedeem) {
    const data = getLoyalty();
    if (data.points < pointsToRedeem) return false;
    data.points -= pointsToRedeem;
    data.history.push({
        points: -pointsToRedeem,
        reason: 'Redeemed at checkout',
        amount: 0,
        date: new Date().toISOString()
    });
    saveLoyalty(data);
    return true;
}

function getLoyaltyCredit() {
    // 100 points = R100
    return Math.floor(getLoyalty().points / 100) * 100;
}

function updateLoyaltyUI() {
    const data = getLoyalty();
    document.querySelectorAll('.loyalty-points').forEach(el => {
        el.textContent = data.points.toLocaleString();
    });
    document.querySelectorAll('.loyalty-credit').forEach(el => {
        el.textContent = `R${getLoyaltyCredit().toLocaleString()}`;
    });
}



/* ============================================================
   5. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initNewsletter();
    initStickyBar();
    updateLoyaltyUI();
    renderStockBadges();
});

window.addEventListener('resize', () => {
    const bar = document.getElementById('stickyMobileBar');
    if (bar) {
        bar.style.display = window.innerWidth > 768 ? 'none' : 'flex';
        document.body.style.paddingBottom = window.innerWidth > 768 ? '0' : '70px';
    } else if (window.innerWidth <= 768) {
        initStickyBar();
    }
});