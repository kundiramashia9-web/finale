/* ============================================================
   BOOKING CONFIRMATION EMAIL (Formspree)
   Called automatically when a booking is confirmed.
   ============================================================ */

async function sendBookingConfirmationEmail(bookingData) {
    /* ----------------------------------------------------------
       SETUP:
       1. Go to https://formspree.io → sign up free
       2. Create a new form → name it "Booking Confirmations"
       3. Copy the form ID (looks like "xyzabcd")
       4. Paste it below, replacing YOUR-FORMSPREE-ID
       ---------------------------------------------------------- */
    const FORMSPREE_URL = 'https://formspree.io/f/YOUR-FORMSPREE-ID';

    // If Formspree isn't configured yet, just log and return
    if (FORMSPREE_URL.includes('YOUR-FORMSPREE-ID')) {
        console.log('📧 Booking email not sent — Formspree not configured yet', bookingData);
        return;
    }

    try {
        const res = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _subject: `Booking Confirmation — ${bookingData.reference}`,
                _replyto: bookingData.email,
                customer_name: bookingData.name,
                customer_email: bookingData.email,
                customer_phone: bookingData.phone,
                reference: bookingData.reference,
                branch: bookingData.branch,
                date: bookingData.date,
                time: bookingData.time,
                treatment: bookingData.treatment,
                payment_method: bookingData.paymentMethod,
                booking_fee: 'R200',
                notes: bookingData.notes || 'None'
            })
        });

        if (res.ok) {
            console.log('✅ Booking confirmation email sent');
        } else {
            console.warn('⚠️ Booking email failed, but booking still recorded');
        }
    } catch (err) {
        console.warn('⚠️ Booking email error (non-fatal):', err);
    }
}