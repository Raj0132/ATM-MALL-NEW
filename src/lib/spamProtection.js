// Spam Protection & Form Validation Helpers

/**
 * Standard email format validation
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const cleanEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true, cleanValue: cleanEmail.toLowerCase(), error: '' };
}

/**
 * Phone number validation (Indian & standard 10-digit mobile numbers)
 * Requires exactly 10 digits after stripping country code/spaces/dashes.
 * Rejects repeating digits and obvious sequential sequences.
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required.' };
  }
  // Strip non-digits
  let digits = phone.replace(/\D/g, '');
  
  // If formatted as +91XXXXXXXXXX or 91XXXXXXXXXX (12 digits starting with 91), strip the 91 prefix
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number.' };
  }

  // Reject repeating patterns: 0000000000, 1111111111, ..., 9999999999
  if (/^(\d)\1{9}$/.test(digits)) {
    return { isValid: false, error: 'Please enter a valid active phone number.' };
  }

  // Reject obvious ascending/descending sequences
  const fakeSequences = [
    '0123456789',
    '1234567890',
    '9876543210',
    '0987654321',
    '1234512345',
    '9876598765',
    '1122334455',
    '0011223344'
  ];
  if (fakeSequences.includes(digits)) {
    return { isValid: false, error: 'Please enter a genuine phone number.' };
  }

  return { isValid: true, cleanValue: digits, error: '' };
}

/**
 * Full name validation
 * At least 2 characters, rejecting purely numbers or special characters.
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Please enter your name.' };
  }
  const cleanName = name.trim();
  if (cleanName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  // Must contain at least one alphabet character
  const hasLetter = /[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/.test(cleanName);
  if (!hasLetter) {
    return { isValid: false, error: 'Please enter a valid name with letters.' };
  }
  return { isValid: true, cleanValue: cleanName, error: '' };
}

/**
 * Client-side session rate limiting
 * Limits submissions to maxSubmissions within windowMinutes
 */
const RATE_LIMIT_PREFIX = 'atm_rate_limit_';

export function isRateLimited(formKey, maxSubmissions = 3, windowMinutes = 10) {
  try {
    const key = `${RATE_LIMIT_PREFIX}${formKey}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return false;

    const timestamps = JSON.parse(raw);
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    const recent = timestamps.filter((t) => now - t < windowMs);

    return recent.length >= maxSubmissions;
  } catch {
    return false;
  }
}

export function recordFormSubmission(formKey, windowMinutes = 10) {
  try {
    const key = `${RATE_LIMIT_PREFIX}${formKey}`;
    const raw = sessionStorage.getItem(key);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    const recent = timestamps.filter((t) => now - t < windowMs);
    recent.push(now);
    sessionStorage.setItem(key, JSON.stringify(recent));
  } catch (err) {
    console.warn('Unable to record rate limit timestamp:', err);
  }
}

/**
 * Google reCAPTCHA v3 client execution helper
 */
let recaptchaScriptLoaded = false;

export async function executeRecaptcha(action = 'submit_form') {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    // If site key not configured, bypass gracefully in dev
    return null;
  }

  // Load script if not already present
  if (!recaptchaScriptLoaded && typeof window !== 'undefined') {
    if (!document.querySelector('script[data-recaptcha]')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-recaptcha', 'true');
      document.head.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
    recaptchaScriptLoaded = true;
  }

  return new Promise((resolve) => {
    if (!window.grecaptcha) {
      resolve(null);
      return;
    }
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(siteKey, { action });
        resolve(token);
      } catch (err) {
        console.warn('reCAPTCHA execution error:', err);
        resolve(null);
      }
    });
  });
}

/**
 * Verifies the reCAPTCHA token against our Vercel Serverless Function
 */
export async function verifyRecaptcha(token) {
  if (!token) {
    // If no token (e.g. key missing/local dev), allow through gracefully
    return true;
  }

  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Error verifying reCAPTCHA token:', err);
    // In case of network errors reaching /api in dev, let it proceed gracefully
    return true;
  }
}
