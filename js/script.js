/* ============================================================
   Alabaster Health & Aesthetics — Master JavaScript (CONSOLIDATED)
   Includes: Navigation · Gallery · Map · Booking Engine v4
             + 3D WebGL Hero Scene (merged from three-scene.js)
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       CONFIG — Edit these values
       ============================================================ */
    const PAYMENT_LINK = "PAYMENT_LINK_HERE";
    const BOOKING_FEE = 200;
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID";

    const BRANCHES = {
        bedfordview: {
            name: "Alabaster Bedfordview",
            short: "Bedfordview",
            address: "12 Nicol Road, Bedfordview, Johannesburg, 2007",
            phone: "081 309 4084",
            whatsapp: "27813094084",
            whatsappDisplay: "081 309 4084",
            hours: { start: 8.5, end: 17.5, days: [1, 2, 3, 4, 5, 6] }
        },
        benoni: {
            name: "Alabaster Benoni",
            short: "Benoni",
            address: "65 Ampthill Avenue, Benoni Central, 1501",
            phone: "076 042 6155",
            whatsapp: "27760426155",
            whatsappDisplay: "076 042 6155",
            hours: { start: 8, end: 17, days: [1, 2, 3, 4, 5, 6] }
        },
        pretoria: {
            name: "Alabaster Pretoria",
            short: "Pretoria",
            address: "Suite 9, Menlyn Maine, Aramist Ave, Waterkloof Glen, Pretoria, 0181",
            phone: "067 032 1210",
            whatsapp: "27670321210",
            whatsappDisplay: "067 032 1210",
            hours: { start: 8.5, end: 17, days: [1, 2, 3, 4, 5, 6] }
        },
        polokwane: {
            name: "Alabaster Polokwane",
            short: "Polokwane",
            address: "Central Business District, Polokwane, 0699",
            phone: "081 309 4084",
            whatsapp: "27813094084",
            whatsappDisplay: "081 309 4084",
            hours: { start: 9, end: 16.5, days: [2, 3, 4, 5, 6] }
        }
    };

    const PAYMENT_METHOD_LABELS = {
        paynow: "PayNow (Card)",
        eft: "EFT / Bank Transfer",
        cash: "Cash at Clinic"
    };

    const BANK_DETAILS = {
        bank: "Capitec",
        accountName: "Alabaster Health",
        accountNumber: "1659931620",
        branchCode: "953",
        accountType: "Savings"
    };

    /* ============================================================
       DOM READY
       ============================================================ */
    document.addEventListener('DOMContentLoaded', function () {
        initHeaderScroll();
        initMobileNav();
        initGallery();
        initMap();
        init3DScene();
    });

    /* ============================================================
       1. HEADER SCROLL EFFECT
       ============================================================ */
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) header.classList.add('header--scrolled');
            else header.classList.remove('header--scrolled');
        });
    }

    /* ============================================================
       2. MOBILE NAVIGATION
       ============================================================ */
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const nav = document.getElementById('nav');
        const navOverlay = document.getElementById('navOverlay');

        function closeNav() {
            if (!nav || !navToggle) return;
            nav.classList.remove('open');
            navToggle.classList.remove('open');
            document.body.classList.remove('menu-open');
            if (navOverlay) navOverlay.classList.remove('active');
        }

        function openNav() {
            if (!nav || !navToggle) return;
            nav.classList.add('open');
            navToggle.classList.add('open');
            document.body.classList.add('menu-open');
            if (navOverlay) navOverlay.classList.add('active');
        }

        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                if (nav.classList.contains('open')) closeNav();
                else openNav();
            });
        }

        if (navOverlay) navOverlay.addEventListener('click', closeNav);

        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    /* ============================================================
       3. GALLERY FILTERS
       ============================================================ */
    function initGallery() {
        const filterButtons = document.querySelectorAll('.gallery-filter-btn');
        const galleryCards = document.querySelectorAll('.gallery-card');

        if (filterButtons.length > 0 && galleryCards.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');
                    galleryCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        if (filter === 'all' || filter === category) {
                            card.classList.remove('is-hidden');
                        } else {
                            card.classList.add('is-hidden');
                        }
                    });
                });
            });
        }
    }

    /* ============================================================
       4. GALLERY LIGHTBOX (window functions)
       ============================================================ */
    window.openGalleryModal = function (id) {
        const card = document.querySelector(`.gallery-card[data-id="${id}"]`);
        if (!card) return;
        const modal = document.getElementById('galleryModal');
        if (!modal) return;

        const img = card.querySelector('.gallery-card__image');
        const branch = card.querySelector('.gallery-card__badge-branch');
        const category = card.querySelector('.gallery-card__badge-category');
        const title = card.querySelector('.gallery-card__title');
        const treatment = card.querySelector('.gallery-card__treatment');
        const quote = card.querySelector('.gallery-card__quote');

        const modalImg = document.getElementById('modalImg');
        const modalBranch = document.getElementById('modalBranch');
        const modalCategory = document.getElementById('modalCategory');
        const modalTitle = document.getElementById('modalTitle');
        const modalTreatment = document.getElementById('modalTreatment');
        const modalQuote = document.getElementById('modalQuote');

        if (modalImg && img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        }
        if (modalBranch && branch) modalBranch.innerHTML = branch.innerHTML;
        if (modalCategory && category) modalCategory.textContent = category.textContent;
        if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
        if (modalTreatment && treatment) modalTreatment.innerHTML = treatment.innerHTML;
        if (modalQuote && quote) modalQuote.textContent = quote.textContent;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.dataset.currentId = id;
    };

    window.closeGalleryModal = function () {
        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    window.prevStory = function () {
        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        const currentId = parseInt(modal.dataset.currentId || '1', 10);
        const visible = Array.from(document.querySelectorAll('.gallery-card:not(.is-hidden)'));
        const ids = visible.map(c => parseInt(c.getAttribute('data-id'), 10));
        const idx = ids.indexOf(currentId);
        const prevId = idx <= 0 ? ids[ids.length - 1] : ids[idx - 1];
        window.openGalleryModal(prevId);
    };

    window.nextStory = function () {
        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        const currentId = parseInt(modal.dataset.currentId || '1', 10);
        const visible = Array.from(document.querySelectorAll('.gallery-card:not(.is-hidden)'));
        const ids = visible.map(c => parseInt(c.getAttribute('data-id'), 10));
        const idx = ids.indexOf(currentId);
        const nextId = idx >= ids.length - 1 ? ids[0] : ids[idx + 1];
        window.openGalleryModal(nextId);
    };

    window.toggleLike = function (btn, id) {
        btn.classList.toggle('liked');
        const countEl = btn.querySelector('.like-count');
        if (!countEl) return;
        let count = parseInt(countEl.textContent, 10) || 0;
        if (btn.classList.contains('liked')) count += 1;
        else count = Math.max(0, count - 1);
        countEl.textContent = count;
    };

    /* ============================================================
       5. BOOKING ENGINE v4 — Payment methods + reset
       ============================================================ */
    const bookingState = {
        branch: null,
        date: null,
        time: null,
        service: null,
        clientName: "",
        clientPhone: "",
        notes: "",
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectedDay: null,
        reference: null,
        paymentMethod: null
    };

    window.selectBranch = function (branchKey) {
        if (!BRANCHES[branchKey]) return;

        bookingState.branch = branchKey;
        bookingState.date = null;
        bookingState.time = null;
        bookingState.selectedDay = null;

        document.querySelectorAll('.booking-location-card').forEach(c => c.classList.remove('selected'));
        const card = document.querySelector(`.booking-location-card[data-branch="${branchKey}"]`);
        if (card) card.classList.add('selected');

        const label = document.getElementById('selectedBranchLabel');
        if (label) label.textContent = BRANCHES[branchKey].name;

        updateStepper(2);

        const dateSection = document.getElementById('datetimeSection');
        const detailSection = document.getElementById('detailsSection');
        const paySection = document.getElementById('paymentSection');

        if (dateSection) dateSection.style.display = 'block';
        if (detailSection) detailSection.style.display = 'none';
        if (paySection) paySection.style.display = 'none';

        setTimeout(() => {
            if (dateSection) dateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);

        renderCalendar();
    };

    window.navigateMonth = function (dir) {
        bookingState.currentMonth += dir;
        if (bookingState.currentMonth > 11) {
            bookingState.currentMonth = 0;
            bookingState.currentYear++;
        }
        if (bookingState.currentMonth < 0) {
            bookingState.currentMonth = 11;
            bookingState.currentYear--;
        }
        renderCalendar();
    };

    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const label = document.getElementById('calMonthYear');
        if (!grid || !label || !bookingState.branch) return;

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        label.textContent = `${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;
        grid.innerHTML = '';

        const firstDay = new Date(bookingState.currentYear, bookingState.currentMonth, 1);
        const daysInMonth = new Date(bookingState.currentYear, bookingState.currentMonth + 1, 0).getDate();
        const startWeekday = (firstDay.getDay() + 6) % 7;

        for (let i = 0; i < startWeekday; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day cal-day--empty';
            grid.appendChild(empty);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const branch = BRANCHES[bookingState.branch];

        for (let d = 1; d <= daysInMonth; d++) {
            const cellDate = new Date(bookingState.currentYear, bookingState.currentMonth, d);
            const dayOfWeek = cellDate.getDay();

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cal-day';
            btn.textContent = d;

            const isPast = cellDate < today;
            const isToday = cellDate.getTime() === today.getTime();
            const isBranchOpen = branch.hours.days.includes(dayOfWeek);

            if (isToday) btn.classList.add('cal-day--today');

            if (isPast || !isBranchOpen) {
                btn.classList.add('cal-day--disabled');
                btn.disabled = true;
            } else {
                btn.classList.add('cal-day--has-slots');
                btn.onclick = () => selectDate(cellDate, btn);
            }

            if (bookingState.selectedDay === d &&
                bookingState.currentMonth === cellDate.getMonth() &&
                bookingState.currentYear === cellDate.getFullYear()) {
                btn.classList.add('cal-day--selected');
            }

            grid.appendChild(btn);
        }
    }

    function selectDate(dateObj, btnEl) {
        bookingState.date = dateObj;
        bookingState.selectedDay = dateObj.getDate();
        bookingState.time = null;

        document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('cal-day--selected'));
        btnEl.classList.add('cal-day--selected');

        const tsCard = document.getElementById('timeslotsCard');
        if (tsCard) tsCard.style.display = 'none';
    }

    window.scrollToTimeSlots = function () {
        if (!bookingState.date) {
            alert("Please select a date on the calendar first.");
            return;
        }
        renderTimeSlots();
        const tsCard = document.getElementById('timeslotsCard');
        if (tsCard) {
            tsCard.style.display = 'block';
            tsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    function renderTimeSlots() {
        if (!bookingState.branch || !bookingState.date) return;
        const branch = BRANCHES[bookingState.branch];
        const { start, end } = branch.hours;

        const dateLabel = document.getElementById('slotDateLabel');
        if (dateLabel) {
            const opts = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
            dateLabel.textContent = bookingState.date.toLocaleDateString('en-ZA', opts);
        }

        const morning = [];
        const afternoon = [];
        const evening = [];

        for (let h = start; h < end; h += 0.5) {
            const hour24 = Math.floor(h);
            const mins = (h % 1) === 0 ? '00' : '30';
            const timeLabel = formatTime(hour24, mins);

            if (h < 12) morning.push(timeLabel);
            else if (h < 15) afternoon.push(timeLabel);
            else evening.push(timeLabel);
        }

        fillSlots('morningSlots', morning);
        fillSlots('afternoonSlots', afternoon);
        fillSlots('eveningSlots', evening);
    }

    function fillSlots(containerId, slots) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (slots.length === 0) {
            container.innerHTML = '<span style="font-size:0.85rem; color: var(--muted-text);">No slots available</span>';
            return;
        }

        slots.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'time-slot-pill';
            btn.textContent = time;
            btn.onclick = () => selectTimeSlot(time, btn);
            container.appendChild(btn);
        });
    }

    function selectTimeSlot(time, btnEl) {
        bookingState.time = time;
        document.querySelectorAll('.time-slot-pill').forEach(p => p.classList.remove('selected'));
        btnEl.classList.add('selected');

        const detailSection = document.getElementById('detailsSection');
        if (detailSection) detailSection.style.display = 'block';

        updateStepper(3);

        setTimeout(() => {
            if (detailSection) detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }

    function formatTime(h, m) {
        const suffix = h < 12 ? 'AM' : 'PM';
        const hour12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        return `${hour12}:${m} ${suffix}`;
    }

    window.updateSummary = function () {
        const nameEl = document.getElementById('clientName');
        const phoneEl = document.getElementById('clientPhone');
        const serviceEl = document.getElementById('bookingServiceSelect');
        const notesEl = document.getElementById('clientNotes');

        if (nameEl) bookingState.clientName = nameEl.value.trim();
        if (phoneEl) bookingState.clientPhone = phoneEl.value.trim();
        if (serviceEl) bookingState.service = serviceEl.value;
        if (notesEl) bookingState.notes = notesEl.value.trim();

        if (bookingState.clientName && bookingState.clientPhone &&
            bookingState.service && bookingState.time) {
            const paySection = document.getElementById('paymentSection');
            if (paySection) paySection.style.display = 'block';
            updateStepper(4);
            populatePaymentSummary();

            if (!bookingState.reference) {
                bookingState.reference = generateReference();
                const eftRef = document.getElementById('eftReference');
                if (eftRef) eftRef.textContent = bookingState.reference;
            }
        }
    };

    function populatePaymentSummary() {
        if (!bookingState.branch || !bookingState.date) return;
        const branch = BRANCHES[bookingState.branch];
        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

        setText('sumBranch', branch.name);
        setText('sumDate', bookingState.date.toLocaleDateString('en-ZA', dateOpts));
        setText('sumTime', bookingState.time);
        setText('sumService', bookingState.service);
        setText('sumClient', bookingState.clientName);
        setText('sumPhone', bookingState.clientPhone);
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '-';
    }

    /* ---------- Payment method selection ---------- */
    window.selectPaymentMethod = function (method) {
        bookingState.paymentMethod = method;

        document.querySelectorAll('.payment-method-option').forEach(opt => {
            opt.classList.remove('active');
        });

        const selected = document.querySelector(`.payment-method-option[data-method="${method}"]`);
        if (selected) selected.classList.add('active');
    };

    window.openPaymentLink = function () {
        if (PAYMENT_LINK && PAYMENT_LINK !== "PAYMENT_LINK_HERE") {
            window.open(PAYMENT_LINK, '_blank');
        } else {
            alert("Payment link is not configured yet. Please contact the branch directly or choose EFT / Cash at Clinic.");
        }
    };

    window.copyBankDetails = function () {
        const text = `Bank: ${BANK_DETAILS.bank}
Account Name: ${BANK_DETAILS.accountName}
Account Number: ${BANK_DETAILS.accountNumber}
Branch Code: ${BANK_DETAILS.branchCode}
Account Type: ${BANK_DETAILS.accountType}
Reference: ${bookingState.reference || 'ALB-0000'}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                alert("Bank details copied to clipboard.");
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            alert("Bank details copied to clipboard.");
        } catch (e) {
            alert("Please manually copy the bank details.");
        }
        document.body.removeChild(ta);
    }

    /* ---------- Confirm booking ---------- */
    window.confirmBooking = function () {
        if (!validateBooking()) return;
        if (!bookingState.paymentMethod) {
            alert("Please select a payment method first.");
            return;
        }

        const branch = BRANCHES[bookingState.branch];
        const ref = bookingState.reference || generateReference();
        bookingState.reference = ref;

        const waMsg = buildWhatsAppMessage(branch, ref);

        if (bookingState.paymentMethod === 'paynow' &&
            PAYMENT_LINK && PAYMENT_LINK !== "PAYMENT_LINK_HERE") {
            window.open(PAYMENT_LINK, '_blank');
        }

        sendEmailNotification(branch, ref);

        setTimeout(() => {
            window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(waMsg)}`, '_blank');
        }, 500);

        showConfirmModal(branch, ref);
    };

    window.confirmViaWhatsApp = function () {
        if (!validateBooking()) return;
        if (!bookingState.paymentMethod) {
            alert("Please select a payment method first.");
            return;
        }
        const branch = BRANCHES[bookingState.branch];
        const ref = bookingState.reference || generateReference();
        bookingState.reference = ref;

        const waMsg = buildWhatsAppMessage(branch, ref);
        window.open(`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(waMsg)}`, '_blank');
        sendEmailNotification(branch, ref);
        showConfirmModal(branch, ref);
    };

    function validateBooking() {
        if (!bookingState.branch || !bookingState.date || !bookingState.time) {
            alert("Please complete Steps 1 and 2 first.");
            return false;
        }
        if (!bookingState.clientName || !bookingState.clientPhone || !bookingState.service) {
            alert("Please fill in your name, phone number, and select a treatment.");
            return false;
        }
        return true;
    }

    function generateReference() {
        return 'ALB-' + Math.floor(1000 + Math.random() * 9000);
    }

    function buildWhatsAppMessage(branch, ref) {
        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = bookingState.date.toLocaleDateString('en-ZA', dateOpts);
        const paymentLabel = PAYMENT_METHOD_LABELS[bookingState.paymentMethod] || "Not selected";

        let paymentLine = `Payment Method: ${paymentLabel}`;
        if (bookingState.paymentMethod === 'paynow') {
            paymentLine += `\nPayment Status: Payment link opened (proof to follow)`;
        } else if (bookingState.paymentMethod === 'eft') {
            paymentLine += `\nPayment Status: EFT - proof of payment to follow`;
        } else if (bookingState.paymentMethod === 'cash') {
            paymentLine += `\nPayment Status: Cash on arrival`;
        }

        return `ALABASTER BOOKING REQUEST

Reference: ${ref}
Branch: ${branch.short}
Practitioner: Dr Randy Mudau
Date: ${dateStr}
Time: ${bookingState.time}
Treatment: ${bookingState.service}
Client: ${bookingState.clientName}
Phone: ${bookingState.clientPhone}

Booking Fee: R${BOOKING_FEE}
${paymentLine}

Notes: ${bookingState.notes || 'None'}

Please confirm this slot and reply to the client on WhatsApp.`;
    }

    function sendEmailNotification(branch, ref) {
        if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("YOUR_FORMSPREE_ID")) {
            console.warn("Formspree endpoint not configured. Email notification skipped.");
            return;
        }

        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = bookingState.date.toLocaleDateString('en-ZA', dateOpts);

        const payload = {
            reference: ref,
            branch: branch.name,
            branch_phone: branch.phone,
            branch_whatsapp: branch.whatsappDisplay,
            practitioner: "Dr Randy Mudau",
            date: dateStr,
            time: bookingState.time,
            treatment: bookingState.service,
            client_name: bookingState.clientName,
            client_phone: bookingState.clientPhone,
            booking_fee: "R" + BOOKING_FEE,
            payment_method: PAYMENT_METHOD_LABELS[bookingState.paymentMethod] || "Not selected",
            notes: bookingState.notes || "None",
            submitted_at: new Date().toLocaleString('en-ZA')
        };

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.ok) console.log("Booking email sent successfully.");
                else console.warn("Formspree returned an error:", res.status);
            })
            .catch(err => console.warn("Formspree network error:", err));
    }

    function showConfirmModal(branch, ref) {
        const dateOpts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };

        setText('confirmRef', ref);
        setText('confirmBranch', branch.name);
        setText('confirmDateTime',
            `${bookingState.date.toLocaleDateString('en-ZA', dateOpts)} at ${bookingState.time}`);
        setText('confirmPayment', PAYMENT_METHOD_LABELS[bookingState.paymentMethod] || "-");

        const waMsg = buildWhatsAppMessage(branch, ref);
        const waBtn = document.getElementById('confirmWhatsAppBtn');
        if (waBtn) {
            waBtn.href = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(waMsg)}`;
        }

        const modal = document.getElementById('confirmModal');
        if (modal) modal.style.display = 'flex';
    }

    window.closeConfirmModal = function () {
        const modal = document.getElementById('confirmModal');
        if (modal) modal.style.display = 'none';

        resetBookingForm();
    };

    function resetBookingForm() {
        bookingState.branch = null;
        bookingState.date = null;
        bookingState.time = null;
        bookingState.service = null;
        bookingState.clientName = "";
        bookingState.clientPhone = "";
        bookingState.notes = "";
        bookingState.selectedDay = null;
        bookingState.reference = null;
        bookingState.paymentMethod = null;
        bookingState.currentMonth = new Date().getMonth();
        bookingState.currentYear = new Date().getFullYear();

        document.querySelectorAll('.booking-location-card').forEach(c => c.classList.remove('selected'));

        const grid = document.getElementById('calendarGrid');
        if (grid) grid.innerHTML = '';
        const monthLabel = document.getElementById('calMonthYear');
        if (monthLabel) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            monthLabel.textContent = `${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;
        }

        ['morningSlots', 'afternoonSlots', 'eveningSlots'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        const slotDateLabel = document.getElementById('slotDateLabel');
        if (slotDateLabel) slotDateLabel.textContent = '-';

        const nameEl = document.getElementById('clientName');
        const phoneEl = document.getElementById('clientPhone');
        const notesEl = document.getElementById('clientNotes');
        const serviceEl = document.getElementById('bookingServiceSelect');
        if (nameEl) nameEl.value = '';
        if (phoneEl) phoneEl.value = '';
        if (notesEl) notesEl.value = '';
        if (serviceEl) serviceEl.selectedIndex = 0;

        document.querySelectorAll('.payment-method-option').forEach(opt => opt.classList.remove('active'));

        const eftRef = document.getElementById('eftReference');
        if (eftRef) eftRef.textContent = 'ALB-0000';

        ['sumBranch', 'sumDate', 'sumTime', 'sumService', 'sumClient', 'sumPhone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '-';
        });

        const dateSection = document.getElementById('datetimeSection');
        const detailSection = document.getElementById('detailsSection');
        const paySection = document.getElementById('paymentSection');
        const tsCard = document.getElementById('timeslotsCard');
        if (dateSection) dateSection.style.display = 'none';
        if (detailSection) detailSection.style.display = 'none';
        if (paySection) paySection.style.display = 'none';
        if (tsCard) tsCard.style.display = 'none';

        updateStepper(1);

        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
        }

        setTimeout(() => {
            const section = document.getElementById('locationSection');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    window.resetBookingForm = resetBookingForm;

    function updateStepper(activeStep) {
        for (let i = 1; i <= 4; i++) {
            const pill = document.getElementById(`pillStep${i}`);
            if (!pill) continue;
            pill.classList.remove('active', 'completed');
            if (i < activeStep) pill.classList.add('completed');
            if (i === activeStep) pill.classList.add('active');
        }
    }

    /* ============================================================
       6. LEAFLET INTERACTIVE MAP
       ============================================================ */
    function initMap() {
        const mapEl = document.getElementById('alabasterBranchesMap');
        if (!mapEl || typeof L === 'undefined') return;

        const BRANCH_COORDS = {
            bedfordview: [-26.1814, 28.1288],
            benoni: [-26.1872, 28.3181],
            pretoria: [-25.7854, 28.2794],
            polokwane: [-23.9045, 29.4689]
        };

        const map = L.map('alabasterBranchesMap', {
            scrollWheelZoom: false,
            zoomControl: true
        }).setView([-25.5, 28.5], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const markers = {};

        Object.keys(BRANCHES).forEach(key => {
            const branch = BRANCHES[key];
            const coords = BRANCH_COORDS[key];
            if (!coords) return;

            const icon = L.divIcon({
                className: 'custom-leaflet-marker-wrap',
                html: `
                    <div class="custom-map-pin">
                        <div class="pin-pulse"></div>
                        <div class="pin-body"><i class="fas fa-map-marker-alt"></i></div>
                        <div class="pin-tip"></div>
                        <div class="pin-tag-label">${branch.short}</div>
                    </div>
                `,
                iconSize: [38, 60],
                iconAnchor: [19, 55],
                popupAnchor: [0, -55]
            });

            const popupHtml = `
                <div class="branch-map-popup">
                    <span class="popup-badge">Alabaster Clinic</span>
                    <h3 class="popup-title">${branch.name}</h3>
                    <p class="popup-address">${branch.address}</p>
                    <div class="popup-info-row">
                        <span><i class="fas fa-phone-alt gold"></i> <a href="tel:${branch.phone.replace(/\s/g, '')}">${branch.phone}</a></span>
                        <span><i class="fab fa-whatsapp" style="color:#25d366;"></i> <a href="https://wa.me/${branch.whatsapp}" target="_blank">${branch.whatsappDisplay}</a></span>
                    </div>
                    <div class="popup-actions">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}" target="_blank" rel="noopener" class="btn btn--gold popup-btn-nav">
                            <i class="fas fa-location-arrow"></i> Take Me There
                        </a>
                        <a href="Bookings.html?branch=${key}" class="btn btn--whatsapp popup-btn-book">
                            <i class="fas fa-calendar-check"></i> Book A Slot
                        </a>
                    </div>
                </div>
            `;

            const marker = L.marker(coords, { icon }).addTo(map).bindPopup(popupHtml, {
                className: 'alabaster-custom-leaflet-popup',
                maxWidth: 280
            });

            markers[key] = marker;
        });

        window.viewAllBranchesOnMap = function () {
            document.querySelectorAll('.map-branch-btn').forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('.map-branch-btn[data-branch="all"]');
            if (allBtn) allBtn.classList.add('active');

            const group = L.featureGroup(Object.values(markers));
            map.fitBounds(group.getBounds().pad(0.15));
        };

        window.focusBranchOnMap = function (branchKey) {
            if (!markers[branchKey]) return;

            document.querySelectorAll('.map-branch-btn').forEach(b => b.classList.remove('active'));
            const btn = document.querySelector(`.map-branch-btn[data-branch="${branchKey}"]`);
            if (btn) btn.classList.add('active');

            const marker = markers[branchKey];
            map.setView(marker.getLatLng(), 14, { animate: true });
            setTimeout(() => marker.openPopup(), 400);

            const mapWrap = document.getElementById('mapSection');
            if (mapWrap) mapWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        setTimeout(() => {
            const group = L.featureGroup(Object.values(markers));
            map.fitBounds(group.getBounds().pad(0.15));
        }, 400);
    }

    /* ============================================================
       7. 3D WEBGL HERO SCENE (merged from three-scene.js)
       ============================================================ */
    function init3DScene() {
        const canvas = document.getElementById('hero3dCanvas');
        if (!canvas) return;

        if (typeof THREE === 'undefined') {
            setTimeout(init3DScene, 100);
            return;
        }

        const heroSection = canvas.parentElement || document.querySelector('.hero');
        let width = heroSection ? heroSection.clientWidth : window.innerWidth;
        let height = heroSection ? heroSection.clientHeight : window.innerHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x07152b, 0.04);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

        function updateCameraLayout() {
            if (width < 600) {
                camera.position.set(0, -0.2, 13.5);
            } else if (width < 992) {
                camera.position.set(1.0, 0, 12);
            } else {
                camera.position.set(2.2, 0.2, 10.5);
            }
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        updateCameraLayout();

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        if (renderer.toneMapping !== undefined) {
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x0a1c36, 1.4);
        scene.add(ambientLight);

        const goldKeyLight = new THREE.DirectionalLight(0xffdf88, 2.4);
        goldKeyLight.position.set(5, 8, 7);
        scene.add(goldKeyLight);

        const fillLight = new THREE.DirectionalLight(0x8ab4f8, 1.0);
        fillLight.position.set(-6, -3, 4);
        scene.add(fillLight);

        const goldPointLight = new THREE.PointLight(0xd4af37, 2.5, 20);
        goldPointLight.position.set(2, 2, 4);
        scene.add(goldPointLight);

        // Materials
        const goldMetalMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.22
        });

        const goldHighlightMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5d77f,
            metalness: 0.95,
            roughness: 0.15
        });

        const frostedGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.85,
            roughness: 0.2,
            transmission: 0.7,
            thickness: 0.8,
            reflectivity: 0.9
        });

        const amberSerumGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd8882a,
            transparent: true,
            opacity: 0.88,
            roughness: 0.15,
            transmission: 0.65,
            thickness: 0.9
        });

        const lemonYellowLiquidMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdb1a,
            roughness: 0.3,
            metalness: 0.2,
            transparent: true,
            opacity: 0.92
        });

        const porcelainWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xfbfbfd,
            roughness: 0.25,
            metalness: 0.1
        });

        const rubberDropperMaterial = new THREE.MeshStandardMaterial({
            color: 0x1f242e,
            roughness: 0.6,
            metalness: 0.05
        });

        const silverSealMaterial = new THREE.MeshStandardMaterial({
            color: 0xdfe3e8,
            metalness: 0.85,
            roughness: 0.25
        });

        // 3D Model Builders
        function createDropperBottle() {
            const group = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.5, 32), amberSerumGlassMaterial);
            group.add(body);

            const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 0.25, 32), amberSerumGlassMaterial);
            shoulder.position.y = 0.875;
            group.add(shoulder);

            const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.3, 32), goldMetalMaterial);
            collar.position.y = 1.15;
            group.add(collar);

            const bulbGeo = new THREE.SphereGeometry(0.28, 24, 24);
            bulbGeo.scale(1, 1.4, 1);
            const bulb = new THREE.Mesh(bulbGeo, rubberDropperMaterial);
            bulb.position.y = 1.55;
            group.add(bulb);

            const label = new THREE.Mesh(new THREE.CylinderGeometry(0.555, 0.555, 0.8, 32, 1, true), goldHighlightMaterial);
            label.position.y = -0.1;
            group.add(label);

            group.scale.set(0.9, 0.9, 0.9);
            return group;
        }

        function createLemonBottleVial() {
            const group = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.25, 32), frostedGlassMaterial);
            group.add(body);

            const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 32), lemonYellowLiquidMaterial);
            liquid.position.y = -0.05;
            group.add(liquid);

            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.42, 0.2, 32), frostedGlassMaterial);
            neck.position.y = 0.725;
            group.add(neck);

            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 32), silverSealMaterial);
            cap.position.y = 0.95;
            group.add(cap);

            const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24), rubberDropperMaterial);
            stopper.position.y = 1.1;
            group.add(stopper);

            const band = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.45, 32, 1, true), lemonYellowLiquidMaterial);
            band.position.y = 0.05;
            group.add(band);

            group.scale.set(1.05, 1.05, 1.05);
            return group;
        }

        function createCreamJar() {
            const group = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.7, 0.65, 32), frostedGlassMaterial);
            group.add(body);

            const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.65, 0.58, 32), porcelainWhiteMaterial);
            inner.position.y = -0.02;
            group.add(inner);

            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.25, 32), goldMetalMaterial);
            lid.position.y = 0.45;
            group.add(lid);

            const ringGeo = new THREE.TorusGeometry(0.42, 0.035, 16, 40);
            const ring = new THREE.Mesh(ringGeo, goldHighlightMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.58;
            group.add(ring);

            group.scale.set(0.95, 0.95, 0.95);
            return group;
        }

        function createSlimmingCapsule() {
            const group = new THREE.Group();
            const topGeo = new THREE.SphereGeometry(0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const topMesh = new THREE.Mesh(topGeo, goldMetalMaterial);
            topMesh.position.y = 0.35;
            group.add(topMesh);

            const topCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24), goldMetalMaterial);
            topCyl.position.y = 0.175;
            group.add(topCyl);

            const botCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24), porcelainWhiteMaterial);
            botCyl.position.y = -0.175;
            group.add(botCyl);

            const botGeo = new THREE.SphereGeometry(0.3, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
            const botMesh = new THREE.Mesh(botGeo, porcelainWhiteMaterial);
            botMesh.position.y = -0.35;
            group.add(botMesh);

            group.scale.set(0.85, 0.85, 0.85);
            return group;
        }

        function createCollagenPearl(radius) {
            const geo = new THREE.SphereGeometry(radius || 0.28, 24, 24);
            const mat = new THREE.MeshPhysicalMaterial({
                color: 0xf5d77f,
                emissive: 0xd4af37,
                emissiveIntensity: 0.3,
                metalness: 0.8,
                roughness: 0.15,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            return new THREE.Mesh(geo, mat);
        }

        // Items array
        const items = [];
        function addItem(mesh, x, y, z, cfg) {
            mesh.position.set(x, y, z);
            scene.add(mesh);
            items.push({
                mesh: mesh,
                baseX: x,
                baseY: y,
                baseZ: z,
                speedY: cfg.speedY || 1.2,
                speedX: cfg.speedX || 0.8,
                ampY: cfg.ampY || 0.3,
                ampX: cfg.ampX || 0.15,
                rotX: cfg.rotX || 0.004,
                rotY: cfg.rotY || 0.008,
                rotZ: cfg.rotZ || 0.003,
                phase: Math.random() * Math.PI * 2
            });
        }

        // Add 3D Items
        const dropper = createDropperBottle();
        dropper.rotation.set(0.25, -0.3, -0.15);
        addItem(dropper, 2.6, 0.5, 0.6, { speedY: 1.1, ampY: 0.35, rotY: 0.008, rotX: 0.003 });

        const lemon1 = createLemonBottleVial();
        lemon1.rotation.set(0.35, 0.45, 0.2);
        addItem(lemon1, 1.1, -1.3, 1.7, { speedY: 1.3, ampY: 0.28, rotY: 0.011, rotZ: 0.005 });

        const jar = createCreamJar();
        jar.rotation.set(0.45, 0.3, -0.25);
        addItem(jar, 3.5, 2.1, -0.4, { speedY: 0.95, ampY: 0.25, rotY: 0.007, rotX: 0.004 });

        const lemon2 = createLemonBottleVial();
        lemon2.rotation.set(-0.25, 0.7, -0.3);
        lemon2.scale.set(0.7, 0.7, 0.7);
        addItem(lemon2, -1.8, 2.2, -2.2, { speedY: 0.85, ampY: 0.2, rotY: 0.006 });

        const cap1 = createSlimmingCapsule();
        cap1.rotation.set(0.7, 0.3, 0.5);
        addItem(cap1, 0.5, 1.8, 1.1, { speedY: 1.35, ampY: 0.3, rotX: 0.012, rotY: 0.008 });

        const cap2 = createSlimmingCapsule();
        cap2.rotation.set(-0.5, -0.4, 0.3);
        cap2.scale.set(0.7, 0.7, 0.7);
        addItem(cap2, 3.8, -1.6, -0.8, { speedY: 1.15, ampY: 0.22, rotX: 0.01, rotZ: 0.01 });

        // Collagen Pearls
        const pearls = [
            { x: 2.1, y: 1.9, z: 1.8, r: 0.22 },
            { x: 0.7, y: -0.3, z: 0.9, r: 0.16 },
            { x: 3.7, y: -0.6, z: 1.2, r: 0.26 },
            { x: -0.9, y: -1.7, z: -0.6, r: 0.22 },
            { x: 1.6, y: -2.3, z: 0.3, r: 0.17 },
            { x: -2.0, y: 0.9, z: -1.6, r: 0.28 }
        ];

        pearls.forEach((p, i) => {
            const pearl = createCollagenPearl(p.r);
            addItem(pearl, p.x, p.y, p.z, {
                speedY: 1.0 + i * 0.12,
                ampY: 0.18 + (i % 3) * 0.06,
                rotY: 0.007,
                rotX: 0.005
            });
        });

        // Ambient Gold Dust Particles
        const particleCount = 80;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            pPos[i] = (Math.random() - 0.5) * 16;
            pPos[i + 1] = (Math.random() - 0.5) * 12;
            pPos[i + 2] = (Math.random() - 0.5) * 10;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0xd4af37,
            size: 0.065,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        // Pointer Parallax
        let targetX = 0;
        let targetY = 0;

        function onPointer(e) {
            const cx = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const cy = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            const mx = (cx / window.innerWidth) * 2 - 1;
            const my = -(cy / window.innerHeight) * 2 + 1;
            targetX = mx * 0.5;
            targetY = my * 0.35;
        }

        window.addEventListener('mousemove', onPointer, { passive: true });
        window.addEventListener('touchmove', onPointer, { passive: true });

        // Resize
        function onResize() {
            if (!heroSection) return;
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            updateCameraLayout();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        }
        window.addEventListener('resize', onResize);

        // Visibility optimization
        let isTabActive = true;
        document.addEventListener('visibilitychange', () => {
            isTabActive = !document.hidden;
        });

        // Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            if (!isTabActive) return;

            const t = clock.getElapsedTime();

            scene.rotation.y += (targetX - scene.rotation.y) * 0.04;
            scene.rotation.x += (-targetY - scene.rotation.x) * 0.04;

            items.forEach((it) => {
                it.mesh.position.y = it.baseY + Math.sin(t * it.speedY + it.phase) * it.ampY;
                it.mesh.position.x = it.baseX + Math.cos(t * it.speedX + it.phase) * it.ampX;
                it.mesh.rotation.y += it.rotY;
                it.mesh.rotation.x += it.rotX;
                it.mesh.rotation.z += it.rotZ;
            });

            goldPointLight.position.x = 2 + Math.cos(t * 0.6) * 1.5;
            goldPointLight.position.y = 1.5 + Math.sin(t * 0.8) * 1.2;

            particles.rotation.y = t * 0.025;

            renderer.render(scene, camera);
        }
        animate();

        canvas.style.opacity = '1';
    }

})();