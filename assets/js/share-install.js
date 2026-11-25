/* UQNS: install as an Android app, share, and service-worker registration.
   The install and share UI lives on install.html (Menu → Install & share).
   This file is loaded on the home page too, because it registers the service worker.
   Labels use data-sh="key" (text) and data-sh-attr="attr:key" (attributes);
   the language follows the header toggle (uqns:lang). Every UI hook is optional. */
(function () {
  'use strict';

  var SITE_URL = 'https://mj-ahmad.github.io/';

  var STRINGS = {
    en: {
      'install.title': 'Get UQNS on your phone',
      'install.lead': 'Install UQNS as an app on Android. It opens full-screen from your home screen.',
      'install.button': 'Install Android app',
      'install.done': 'UQNS is installed on this device.',
      'perk.full': 'Opens full-screen',
      'perk.home': 'Icon on your home screen',
      'perk.offline': 'Home page opens offline',
      'perk.free': 'Free',
      'steps.title': 'How to install',
      'steps.a1': 'Open this page in Chrome.',
      'steps.a2': 'Tap the ⋮ menu at the top right.',
      'steps.a3': 'Choose “Install app” (or “Add to Home screen”).',
      'steps.a4': 'Open UQNS from the icon on your home screen.',
      'steps.i1': 'Open this page in Safari.',
      'steps.i2': 'Tap the Share button at the bottom of the screen.',
      'steps.i3': 'Choose “Add to Home Screen”.',
      'steps.i4': 'Tap “Add”, then open UQNS from your home screen.',
      'share.title': 'Share UQNS',
      'share.lead': 'Know someone who would benefit from the Qur\'an? Send them this page.',
      'share.text': 'UQNS — A Digital Entrance into the Qur\'an',
      'share.native': 'Share…',
      'share.copy': 'Copy link',
      'share.copied': 'Link copied',
      'share.failed': 'Could not copy. Copy the address from the address bar instead.',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.facebook': 'Facebook',
      'share.x': 'X',
      'share.email': 'Email',
      'qr.title': 'Someone next to you?',
      'qr.text': 'Let them scan this code with their phone camera to open UQNS.',
      'qr.alt': 'QR code that opens UQNS',
      'back.home': 'Back to home'
    },
    bn: {
      'install.title': 'আপনার ফোনে UQNS নিন',
      'install.lead': 'Android-এ UQNS একটি অ্যাপ হিসেবে ইনস্টল করুন। হোম স্ক্রিন থেকে ফুল-স্ক্রিনে খুলবে।',
      'install.button': 'Android অ্যাপ ইনস্টল করুন',
      'install.done': 'UQNS এই ডিভাইসে ইনস্টল করা আছে।',
      'perk.full': 'ফুল-স্ক্রিনে খোলে',
      'perk.home': 'হোম স্ক্রিনে আইকন',
      'perk.offline': 'হোম পেজ অফলাইনেও খোলে',
      'perk.free': 'সম্পূর্ণ বিনামূল্যে',
      'steps.title': 'কীভাবে ইনস্টল করবেন',
      'steps.a1': 'এই পেজটি Chrome-এ খুলুন।',
      'steps.a2': 'উপরের ডানদিকের ⋮ মেনুতে চাপ দিন।',
      'steps.a3': '“Install app” (অথবা “Add to Home screen”) বাছাই করুন।',
      'steps.a4': 'হোম স্ক্রিনের UQNS আইকন থেকে অ্যাপটি খুলুন।',
      'steps.i1': 'এই পেজটি Safari-তে খুলুন।',
      'steps.i2': 'স্ক্রিনের নিচের Share বোতামে চাপ দিন।',
      'steps.i3': '“Add to Home Screen” বাছাই করুন।',
      'steps.i4': '“Add” চাপুন, তারপর হোম স্ক্রিন থেকে UQNS খুলুন।',
      'share.title': 'UQNS শেয়ার করুন',
      'share.lead': 'কুরআন নিয়ে কারো উপকার হবে ভাবছেন? এই পেজটি পাঠিয়ে দিন।',
      'share.text': 'UQNS — কুরআনের একটি ডিজিটাল প্রবেশদ্বার',
      'share.native': 'শেয়ার করুন…',
      'share.copy': 'লিংক কপি করুন',
      'share.copied': 'লিংক কপি হয়েছে',
      'share.failed': 'কপি করা যায়নি। ঠিকানা বার থেকে লিংকটি কপি করুন।',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.facebook': 'Facebook',
      'share.x': 'X',
      'share.email': 'ইমেইল',
      'qr.title': 'পাশে কেউ আছেন?',
      'qr.text': 'ফোনের ক্যামেরা দিয়ে এই কোড স্ক্যান করলেই UQNS খুলে যাবে।',
      'qr.alt': 'UQNS খোলার QR কোড',
      'back.home': 'হোমে ফিরুন'
    },
    ar: {
      'install.title': 'احصل على UQNS على هاتفك',
      'install.lead': 'ثبّت UQNS كتطبيق على أندرويد. يفتح بملء الشاشة من الشاشة الرئيسية.',
      'install.button': 'تثبيت تطبيق أندرويد',
      'install.done': 'UQNS مثبّت على هذا الجهاز.',
      'perk.full': 'يفتح بملء الشاشة',
      'perk.home': 'أيقونة على الشاشة الرئيسية',
      'perk.offline': 'الصفحة الرئيسية تعمل دون إنترنت',
      'perk.free': 'مجاني',
      'steps.title': 'طريقة التثبيت',
      'steps.a1': 'افتح هذه الصفحة في Chrome.',
      'steps.a2': 'اضغط على قائمة ⋮ أعلى الشاشة.',
      'steps.a3': 'اختر «تثبيت التطبيق» (أو «إضافة إلى الشاشة الرئيسية»).',
      'steps.a4': 'افتح UQNS من أيقونته على الشاشة الرئيسية.',
      'steps.i1': 'افتح هذه الصفحة في Safari.',
      'steps.i2': 'اضغط زر المشاركة أسفل الشاشة.',
      'steps.i3': 'اختر «إضافة إلى الشاشة الرئيسية».',
      'steps.i4': 'اضغط «إضافة»، ثم افتح UQNS من الشاشة الرئيسية.',
      'share.title': 'شارك UQNS',
      'share.lead': 'هل تعرف من ينتفع بالقرآن؟ أرسل له هذه الصفحة.',
      'share.text': 'UQNS — مدخل رقمي إلى القرآن الكريم',
      'share.native': 'مشاركة…',
      'share.copy': 'نسخ الرابط',
      'share.copied': 'تم نسخ الرابط',
      'share.failed': 'تعذّر النسخ. انسخ العنوان من شريط المتصفح.',
      'share.whatsapp': 'واتساب',
      'share.telegram': 'تيليجرام',
      'share.facebook': 'فيسبوك',
      'share.x': 'X',
      'share.email': 'بريد إلكتروني',
      'qr.title': 'هل بجانبك أحد؟',
      'qr.text': 'دعه يمسح هذا الرمز بكاميرا هاتفه ليفتح UQNS.',
      'qr.alt': 'رمز QR لفتح UQNS',
      'back.home': 'العودة إلى الرئيسية'
    }
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  function t(key) {
    var d = STRINGS[lang] || STRINGS.en;
    return d[key] !== undefined ? d[key] : STRINGS.en[key] || '';
  }
  function $(id) { return document.getElementById(id); }

  function shareData() {
    return { title: "UQNS · Universal Qur'an Navigation System", text: t('share.text'), url: SITE_URL };
  }

  /* ---------- Labels ---------- */
  function applyStrings() {
    document.querySelectorAll('[data-sh]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-sh'));
    });
    document.querySelectorAll('[data-sh-attr]').forEach(function (el) {
      el.getAttribute('data-sh-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    var copy = $('shareCopy');
    if (copy) { copy.setAttribute('aria-label', t('share.copy')); copy.setAttribute('title', t('share.copy')); }
    var qr = $('qrImg');
    if (qr) qr.setAttribute('alt', t('qr.alt'));
    setShareLinks();
    render();
  }

  /* ---------- Install as an app ---------- */
  var deferredPrompt = null;
  var installedNow = false;
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                   window.navigator.standalone === true;
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || '');

  function render() {
    var installed = standalone || installedNow;
    var btn = $('installBtn'), done = $('installDone'), steps = $('installSteps');
    if (btn) btn.hidden = installed || !deferredPrompt;
    if (done) done.hidden = !installed;
    if (steps) steps.hidden = installed;
    var cta = $('ipCta');
    if (cta) cta.hidden = !!(btn && btn.hidden && done && done.hidden);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    // Hold the browser's prompt only where we have our own install button.
    if (!$('installBtn')) return;
    e.preventDefault();
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

  /* Manual steps: Android or iPhone (starts on the visitor's own device) */
  var osButtons = document.querySelectorAll('.ip-seg [data-os]');
  function showOS(os) {
    osButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-os') === os)); });
    var a = $('stepsAndroid'), i = $('stepsIos');
    if (a) a.hidden = os !== 'android';
    if (i) i.hidden = os !== 'ios';
  }
  osButtons.forEach(function (b) {
    b.addEventListener('click', function () { showOS(b.getAttribute('data-os')); });
  });
  if (osButtons.length) showOS(isIOS ? 'ios' : 'android');

  /* ---------- Share ---------- */
  function setShareLinks() {
    var d = shareData();
    var msg = encodeURIComponent(d.text + ' ' + d.url);
    var u = encodeURIComponent(d.url);
    var text = encodeURIComponent(d.text);
    var links = {
      whatsapp: 'https://wa.me/?text=' + msg,
      telegram: 'https://t.me/share/url?url=' + u + '&text=' + text,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      x: 'https://x.com/intent/post?text=' + text + '&url=' + u,
      email: 'mailto:?subject=' + encodeURIComponent(d.title) + '&body=' + msg
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
      navigator.share(shareData()).catch(function () { /* cancelled */ });
    });
  }

  var copyBtn = $('shareCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyText(SITE_URL)
        .then(function () { say(t('share.copied')); })
        .catch(function () { say(t('share.failed')); });
    });
  }

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
