const I18N_STORAGE_KEY = 'thebanned-lang';
const SUPPORTED_LANGS = ['fr', 'en', 'de'];
const DATE_LOCALES = { fr: 'fr-CH', en: 'en-GB', de: 'de-CH' };

let currentLang = 'fr';
let strings = {};

function getPreferredLang() {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (SUPPORTED_LANGS.includes(paramLang)) {
    return paramLang;
  }
  const stored = localStorage.getItem(I18N_STORAGE_KEY);
  if (SUPPORTED_LANGS.includes(stored)) {
    return stored;
  }
  return 'fr';
}

async function loadLocale(lang) {
  const response = await fetch(`locales/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load locale: ${lang}`);
  }
  strings = await response.json();
}

function t(key) {
  return Object.prototype.hasOwnProperty.call(strings, key) ? strings[key] : key;
}

function closeOpenPanels() {
  try {
    const openMembre = document.querySelector('.membre.open');
    if (openMembre && typeof toggleBio === 'function') {
      toggleBio(openMembre);
    }

    const openPhotoEvent = document.querySelector('.photo-event.open');
    if (openPhotoEvent && typeof togglePhotoEvent === 'function') {
      togglePhotoEvent(openPhotoEvent);
    }

    document.querySelectorAll('.song.open .song-header').forEach(button => {
      if (typeof toggleSong === 'function') {
        toggleSong(button);
      }
    });
  } catch {
    // Keep language switch working even if a panel fails to close.
  }
}

function parseIsoDate(iso) {
  if (typeof iso !== 'string') {
    return null;
  }
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) {
    return null;
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function formatConcertDates() {
  const locale = DATE_LOCALES[currentLang] ?? currentLang;
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return;
  }

  document.querySelectorAll('[data-i18n-date]').forEach(el => {
    const date = parseIsoDate(el.dataset.i18nDate);
    if (!date) {
      return;
    }
    const formatted = fmt.format(date);
    const timeEl = el.querySelector('time');
    if (timeEl) {
      timeEl.dateTime = el.dataset.i18nDate;
      timeEl.textContent = formatted;
    } else {
      el.textContent = formatted;
    }
  });
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = t(el.dataset.i18n);
    if (value.includes('\n')) {
      el.textContent = '';
      value.split('\n').forEach((line, index, lines) => {
        el.appendChild(document.createTextNode(line));
        if (index < lines.length - 1) {
          el.appendChild(document.createElement('br'));
        }
      });
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    el.alt = t(el.dataset.i18nAlt);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  document.title = t('meta.title');
  formatConcertDates();
  updateLangToggleState();
}

function updateLangToggleState() {
  document.querySelectorAll('[data-lang]').forEach(button => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function setupLangToggle() {
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
}

async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) {
    return;
  }

  closeOpenPanels();
  currentLang = lang;
  localStorage.setItem(I18N_STORAGE_KEY, lang);
  document.documentElement.lang = lang;

  try {
    await loadLocale(lang);
  } catch {
    currentLang = 'fr';
    document.documentElement.lang = 'fr';
    localStorage.setItem(I18N_STORAGE_KEY, 'fr');
    await loadLocale('fr');
  }

  applyTranslations();
}

async function initI18n() {
  currentLang = getPreferredLang();
  document.documentElement.lang = currentLang;
  localStorage.setItem(I18N_STORAGE_KEY, currentLang);

  try {
    await loadLocale(currentLang);
    applyTranslations();
  } catch (error) {
    if (currentLang !== 'fr') {
      currentLang = 'fr';
      document.documentElement.lang = 'fr';
      await loadLocale('fr');
      applyTranslations();
    }
  }

  setupLangToggle();
}

document.addEventListener('DOMContentLoaded', initI18n);
