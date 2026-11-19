/* UQNS: share, install as an Android app, and service-worker registration.
   Separate from app.js so the splash and home page logic stay as they are.
   Labels use data-sh="key"; the language follows the header toggle (uqns:lang). */
(function () {
  'use strict';

  var SITE_URL = 'https://mj-ahmad.github.io/';
  var SHARE = {
    title: "UQNS · Universal Qur'an Navigation System",
    text: "UQNS — A Digital Entrance into the Qur'an",
    url: SITE_URL
  };

  var STRINGS = {
    en: {
      'install.title': 'Get UQNS on your phone',
      'install.lead': 'Install UQNS as an app on Android. It opens full-screen from your home screen.',
      'install.button': 'Install Android app',
      'install.done': 'UQNS is installed on this device.',
      'install.ios': 'On iPhone or iPad: tap the Share button in Safari, then "Add to Home Screen".',
      'install.other': 'On Android: open this page in Chrome, then choose "Install app" from the menu.',
      'share.title': 'Share UQNS',
      'share.lead': 'Know someone who would benefit from the Qur\'an? Share this page.',
      'share.native': 'Share…',
      'share.copy': 'Copy link',
      'share.copied': 'Link copied',
      'share.failed': 'Could not copy. Copy the address from the address bar instead.',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.facebook': 'Facebook',
      'share.x': 'X',
      'share.email': 'Email'
    },
    bn: {
      'install.title': 'আপনার ফোনে UQNS নিন',
      'install.lead': 'Android-এ UQNS একটি অ্যাপ হিসেবে ইনস্টল করুন। হোম স্ক্রিন থেকে ফুল-স্ক্রিনে খুলবে।',
      'install.button': 'Android অ্যাপ ইনস্টল করুন',
      'install.done': 'UQNS এই ডিভাইসে ইনস্টল করা আছে।',
      'install.ios': 'iPhone বা iPad-এ: Safari-র Share বোতাম চাপুন, তারপর “Add to Home Screen” বাছাই করুন।',
      'install.other': 'Android-এ: এই পেজটি Chrome-এ খুলুন, তারপর মেনু থেকে “Install app” বাছাই করুন।',
      'share.title': 'UQNS শেয়ার করুন',
      'share.lead': 'কুরআন নিয়ে কারো উপকার হবে ভাবছেন? এই পেজটি শেয়ার করুন।',
      'share.native': 'শেয়ার করুন…',
      'share.copy': 'লিংক কপি করুন',
      'share.copied': 'লিংক কপি হয়েছে',
      'share.failed': 'কপি করা যায়নি। ঠিকানা বার থেকে লিংকটি কপি করুন।',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.facebook': 'Facebook',
      'share.x': 'X',
      'share.email': 'ইমেইল'
    },
    ar: {
      'install.title': 'احصل على UQNS على هاتفك',
      'install.lead': 'ثبّت UQNS كتطبيق على أندرويد. يفتح بملء الشاشة من الشاشة الرئيسية.',
      'install.button': 'تثبيت تطبيق أندرويد',
      'install.done': 'UQNS مثبّت على هذا الجهاز.',
      'install.ios': 'على iPhone أو iPad: اضغط زر المشاركة في Safari ثم «إضافة إلى الشاشة الرئيسية».',
      'install.other': 'على أندرويد: افتح هذه الصفحة في Chrome ثم اختر «تثبيت التطبيق» من القائمة.',
      'share.title': 'شارك UQNS',
      'share.lead': 'هل تعرف من ينتفع بالقرآن؟ شارك هذه الصفحة.',
      'share.native': 'مشاركة…',
      'share.copy': 'نسخ الرابط',
      'share.copied': 'تم نسخ الرابط',
      'share.failed': 'تعذّر النسخ. انسخ العنوان من شريط المتصفح.',
      'share.whatsapp': 'واتساب',
      'share.telegram': 'تيليجرام',
      'share.facebook': 'فيسبوك',
      'share.x': 'X',
      'share.email': 'بريد إلكتروني'
    }
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  function t(key) {
    var d = STRINGS[lang] || STRINGS.en;
    return d[key] !== undefined ? d[key] : STRINGS.en[key] || '';
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- Labels ---------- */
  function applyStrings() {
    document.querySelectorAll('[data-sh]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-sh'));
    });
    render();
  }

  /* ---------- Install as an app ---------- */
  var deferredPrompt = null;
  var installedNow = false;
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                   window.navigator.standalone === true;
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua);

  function render() {
    var installed = standalone || installedNow;
    var btn = $('installBtn'), done = $('installDone'), hint = $('installHint');
    if (!btn || !done || !hint) return;
    btn.hidden = installed || !deferredPrompt;
    done.hidden = !installed;
    hint.hidden = installed || !!deferredPrompt;
    hint.textContent = isIOS ? t('install.ios') : t('install.other');
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();          // show our own button instead of the browser banner
    deferredPrompt = e;
    render();
  });
  window.addEventListener('appinstalled', function () {
    installedNow = true;
    deferredPrompt = null;
    render();
  });

  var installBtn = $('installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        render();
      });
    });
  }

  /* ---------- Share ---------- */
  function setShareLinks() {
    var msg = encodeURIComponent(SHARE.text + ' ' + SHARE.url);
    var u = encodeURIComponent(SHARE.url);
    var text = encodeURIComponent(SHARE.text);
    var links = {
      whatsapp: 'https://wa.me/?text=' + msg,
      telegram: 'https://t.me/share/url?url=' + u + '&text=' + text,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      x: 'https://x.com/intent/post?text=' + text + '&url=' + u,
      email: 'mailto:?subject=' + encodeURIComponent(SHARE.title) + '&body=' + msg
    };
    Object.keys(links).forEach(function (k) {
      var a = document.querySelector('[data-share-link="' + k + '"]');
      if (a) a.setAttribute('href', links[k]);
    });
  }

  var status = $('shareStatus'), statusTimer = null;
  function say(msg) {
    if (!status) return;
    status.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { status.textContent = ''; }, 3000);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      return ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  var nativeBtn = $('shareNative');
  if (nativeBtn && navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', function () {
      navigator.share({ title: SHARE.title, text: SHARE.text, url: SHARE.url }).catch(function () { /* cancelled */ });
    });
  }

  var copyBtn = $('shareCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyText(SHARE.url)
        .then(function () { say(t('share.copied')); })
        .catch(function () { say(t('share.failed')); });
    });
  }

  setShareLinks();

  /* ---------- Language follows the header toggle ---------- */
  document.addEventListener('uqns:lang', function (e) {
    lang = (e.detail && e.detail.lang) || 'en';
    applyStrings();
  });
  applyStrings();

  /* ---------- Offline shell ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* optional enhancement */ });
    });
  }
})();
