// ============================================================
//  CAKERY — main.js
//  Includes: Hamburger menu, Contact Form → Google Sheets,
//            Newsletter, floating label select fix
// ============================================================

// -------------------------------------------------------
// ⚠️  IMPORTANT: Paste your Google Apps Script Web App URL below
//    (See SETUP_GOOGLE_SHEETS.md for step-by-step instructions)
// -------------------------------------------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2_n5dGvZOAT3EDobNUYOUpnYrF2OWJRufpyQP8Lk-vDrIrCmik-Pwu0FSYNo1h3y5kQ/exec";


// ============================================================
//  HAMBURGER MENU
// ============================================================
const hamburger = document.querySelector('.hamburger');
const navlist   = document.querySelector('.navlist');
const navIcons  = document.querySelector('.nav-icons');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navlist?.classList.toggle('show');
        navIcons?.classList.toggle('show');
    });
}


// ============================================================
//  FLOATING LABEL: fix for <select> (needs manual JS)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('cf-subject');
    if (sel) {
        sel.addEventListener('change', () => {
            if (sel.value) {
                sel.classList.add('has-value');
            } else {
                sel.classList.remove('has-value');
            }
        });
    }
});


// ============================================================
//  CONTACT FORM SUBMISSION → GOOGLE SHEETS
// ============================================================
async function submitContactForm(e) {
    e.preventDefault();

    const name    = document.getElementById('cf-name')?.value.trim();
    const email   = document.getElementById('cf-email')?.value.trim();
    const phone   = document.getElementById('cf-phone')?.value.trim();
    const subject = document.getElementById('cf-subject')?.value;
    const message = document.getElementById('cf-message')?.value.trim();
    const consent = document.getElementById('cf-consent')?.checked;

    const msgEl   = document.getElementById('form-response-msg');
    const submitBtn = document.getElementById('cf-submit');
    const btnText   = submitBtn?.querySelector('.btn-text');
    const btnIcon   = submitBtn?.querySelector('.btn-icon');
    const btnLoader = submitBtn?.querySelector('.btn-loader');

    // Clear previous messages
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'form-response-msg'; }

    // --- Validation ---
    if (!name) {
        showFormMsg('Please enter your name.', 'error');
        document.getElementById('cf-name').focus();
        return;
    }
    if (!email || !isValidEmail(email)) {
        showFormMsg('Please enter a valid email address.', 'error');
        document.getElementById('cf-email').focus();
        return;
    }
    if (!subject) {
        showFormMsg('Please select a subject.', 'error');
        return;
    }
    if (!message) {
        showFormMsg('Please write a message.', 'error');
        document.getElementById('cf-message').focus();
        return;
    }
    if (!consent) {
        showFormMsg('Please agree to be contacted before submitting.', 'error');
        return;
    }

    // Check if the URL has been configured
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        showFormMsg('⚠️ Google Sheets URL not configured yet. See SETUP_GOOGLE_SHEETS.md for setup instructions.', 'error');
        return;
    }

    // --- Show loading state ---
    setLoadingState(true);

    // Build payload
    const payload = {
        name,
        email,
        phone: phone || '—',
        subject,
        message,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
        // Google Apps Script requires no-cors for form submissions from browser
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // With no-cors we can't read the response body, so we assume success
        setLoadingState(false);
        showSuccessState();

    } catch (err) {
        setLoadingState(false);
        showFormMsg('Something went wrong. Please try again or email us directly.', 'error');
        console.error('Contact form error:', err);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMsg(text, type) {
    const el = document.getElementById('form-response-msg');
    if (!el) return;
    el.textContent = text;
    el.className = `form-response-msg ${type}`;
}

function setLoadingState(loading) {
    const submitBtn = document.getElementById('cf-submit');
    if (!submitBtn) return;
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnIcon   = submitBtn.querySelector('.btn-icon');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled = loading;
    if (btnText)   btnText.textContent  = loading ? 'Sending…' : 'Send Message';
    if (btnIcon)   btnIcon.style.display = loading ? 'none' : 'inline-flex';
    if (btnLoader) btnLoader.style.display = loading ? 'inline-flex' : 'none';
}

function showSuccessState() {
    const formEl    = document.getElementById('contact-form');
    const successEl = document.getElementById('form-success');
    if (formEl)    formEl.style.display    = 'none';
    if (successEl) successEl.style.display = 'flex';
}

function resetContactForm() {
    const formEl    = document.getElementById('contact-form');
    const successEl = document.getElementById('form-success');
    const msgEl     = document.getElementById('form-response-msg');

    if (formEl)    { formEl.style.display = 'flex'; formEl.reset && formEl.reset(); }
    if (successEl) successEl.style.display = 'none';
    if (msgEl)     { msgEl.textContent = ''; msgEl.className = 'form-response-msg'; }

    // Reset all inputs manually
    ['cf-name','cf-email','cf-phone','cf-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const sel = document.getElementById('cf-subject');
    if (sel) { sel.value = ''; sel.classList.remove('has-value'); }
    const consent = document.getElementById('cf-consent');
    if (consent) consent.checked = false;
}


// ============================================================
//  NEWSLETTER SUBSCRIPTION
// ============================================================
async function subscribeNewsletter(e) {
    e.preventDefault();

    const emailInput = document.getElementById('newsletter-email');
    const msgEl      = document.getElementById('newsletter-msg');
    const btn        = document.getElementById('newsletter-btn');

    const email = emailInput?.value.trim();
    if (!email || !isValidEmail(email)) {
        if (msgEl) { msgEl.textContent = 'Please enter a valid email.'; msgEl.style.color = '#e53e3e'; }
        return;
    }

    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        if (msgEl) { msgEl.textContent = '⚠️ Sheets URL not configured. See SETUP_GOOGLE_SHEETS.md.'; msgEl.style.color = '#e53e3e'; }
        return;
    }

    if (btn) btn.disabled = true;
    if (msgEl) { msgEl.textContent = 'Subscribing…'; msgEl.style.color = '#636363'; }

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'newsletter',
                email,
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            })
        });

        if (msgEl) { msgEl.textContent = '🎉 You\'re subscribed! Thank you.'; msgEl.style.color = '#38a169'; }
        if (emailInput) emailInput.value = '';
    } catch (err) {
        if (msgEl) { msgEl.textContent = 'Could not subscribe. Please try again.'; msgEl.style.color = '#e53e3e'; }
    } finally {
        if (btn) btn.disabled = false;
    }
}
