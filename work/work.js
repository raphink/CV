(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.chapter-index a'));
  function trackWorkEvent(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }
  var chapters = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })[0];
      if (!visible) return;
      links.forEach(function (link) {
        if (link.getAttribute('href') === '#' + visible.target.id) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-26% 0px -62% 0px', threshold: 0 });

    chapters.forEach(function (chapter) { observer.observe(chapter); });
  }

  var carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-tour-slide]'));
  var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-tour-dot]'));
  var count = carousel.querySelector('[data-tour-count]');
  var current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === current;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    dots.forEach(function (dot, dotIndex) {
      var active = dotIndex === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (count) count.innerHTML = String(current + 1).padStart(2, '0') + ' <i>/ ' + String(slides.length).padStart(2, '0') + '</i>';
  }

  var previous = carousel.querySelector('[data-tour-prev]');
  var next = carousel.querySelector('[data-tour-next]');
  if (previous) previous.addEventListener('click', function () { showSlide(current - 1); });
  if (next) next.addEventListener('click', function () { showSlide(current + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-tour-dot')) || 0);
    });
  });
  carousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') showSlide(current - 1);
    if (event.key === 'ArrowRight') showSlide(current + 1);
  });

  var stickerCarousel = document.querySelector('[data-sticker-carousel]');
  if (stickerCarousel) {
    var stickerSlides = Array.prototype.slice.call(stickerCarousel.querySelectorAll('[data-sticker-slide]'));
    var stickerDots = Array.prototype.slice.call(stickerCarousel.querySelectorAll('[data-sticker-dot]'));
    var stickerCount = stickerCarousel.querySelector('[data-sticker-count]');
    var stickerCurrent = 0;

    function showSticker(index) {
      stickerCurrent = (index + stickerSlides.length) % stickerSlides.length;
      stickerSlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === stickerCurrent;
        slide.hidden = !active;
        slide.classList.toggle('is-active', active);
      });
      stickerDots.forEach(function (dot, dotIndex) {
        var active = dotIndex === stickerCurrent;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (stickerCount) stickerCount.innerHTML = String(stickerCurrent + 1).padStart(2, '0') + ' <i>/ ' + String(stickerSlides.length).padStart(2, '0') + '</i>';
      var stickerTitle = stickerSlides[stickerCurrent].querySelector('figcaption strong');
      trackWorkEvent('view_work_item', { item_category: 'sticker', item_name: stickerTitle ? stickerTitle.textContent : 'Sticker artwork' });
    }

    var stickerPrevious = stickerCarousel.querySelector('[data-sticker-prev]');
    var stickerNext = stickerCarousel.querySelector('[data-sticker-next]');
    if (stickerPrevious) stickerPrevious.addEventListener('click', function () { showSticker(stickerCurrent - 1); });
    if (stickerNext) stickerNext.addEventListener('click', function () { showSticker(stickerCurrent + 1); });
    stickerDots.forEach(function (dot) {
      dot.addEventListener('click', function () { showSticker(Number(dot.getAttribute('data-sticker-dot')) || 0); });
    });
    stickerCarousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') showSticker(stickerCurrent - 1);
      if (event.key === 'ArrowRight') showSticker(stickerCurrent + 1);
    });
  }

  var reader = document.getElementById('work-reader');
  if (!reader) return;

  var readerTitle = document.getElementById('reader-title');
  var readerKind = document.getElementById('reader-kind');
  var readerStatus = document.getElementById('reader-status');
  var readerImage = document.getElementById('reader-image');
  var readerVideo = document.getElementById('reader-video');
  var readerDescription = document.getElementById('reader-description');
  var readerToolbar = reader.querySelector('.reader-toolbar');
  var readerClose = reader.querySelector('.reader-close');
  var readerPrev = document.getElementById('reader-prev');
  var readerNext = document.getElementById('reader-next');
  var activeReader = null;
  var activePage = 1;

  function paintReaderPage() {
    if (!activeReader) return;
    var pageName = String(activePage).padStart(3, '0');
    var caption = activeReader.captions && activeReader.captions[activePage - 1];
    var stepLabel = activeReader.stepLabel || 'Page';
    var videoSource = activeReader.videos && activeReader.videos[activePage];
    if (readerVideo) {
      readerVideo.pause();
      try { readerVideo.currentTime = 0; } catch (error) {}
    }
    readerImage.alt = (caption || stepLabel + ' ' + activePage) + ' · ' + activeReader.title;
    readerStatus.textContent = stepLabel + ' ' + activePage + ' of ' + activeReader.count + (caption ? ' · ' + caption : '');
    if (videoSource && readerVideo) {
      readerImage.hidden = true;
      readerVideo.hidden = false;
      readerVideo.poster = activeReader.prefix + pageName + '.webp';
      if (readerVideo.getAttribute('src') !== videoSource) {
        readerVideo.src = videoSource;
        readerVideo.load();
      }
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) readerVideo.play().catch(function () {});
    } else {
      if (readerVideo) {
        readerVideo.pause();
        readerVideo.hidden = true;
      }
      readerImage.hidden = false;
      readerImage.src = activeReader.prefix + pageName + '.webp';
    }
    readerPrev.disabled = activePage <= 1;
    readerNext.disabled = activePage >= activeReader.count;
  }

  function openReader(trigger) {
    var kind = trigger.getAttribute('data-reader-kind');
    readerTitle.textContent = trigger.getAttribute('data-reader-title') || 'Selected work';
    readerKind.textContent = trigger.getAttribute('data-reader-label') || 'Selected work';
    trackWorkEvent('view_work_item', { item_category: kind || 'work', item_name: readerTitle.textContent });
    activeReader = null;
    readerDescription.hidden = true;
    readerDescription.textContent = '';
    readerImage.classList.remove('is-detail-image');
    readerImage.hidden = false;
    if (readerVideo) { readerVideo.pause(); readerVideo.hidden = true; }

    if (kind === 'pages') {
      activeReader = {
        prefix: trigger.getAttribute('data-reader-prefix'),
        count: Number(trigger.getAttribute('data-reader-count')) || 1,
        title: trigger.getAttribute('data-reader-title') || 'comic',
        stepLabel: trigger.getAttribute('data-reader-step-label') || 'Page',
        captions: trigger.getAttribute('data-reader-captions') ? trigger.getAttribute('data-reader-captions').split('|') : null,
        videos: trigger.getAttribute('data-reader-videos') ? trigger.getAttribute('data-reader-videos').split('|').reduce(function (result, item) {
          var pair = item.split(':');
          if (pair.length > 1) result[Number(pair.shift())] = pair.join(':');
          return result;
        }, {}) : null
      };
      activePage = 1;
      readerToolbar.hidden = false;
      readerDescription.textContent = trigger.getAttribute('data-reader-description') || '';
      readerDescription.hidden = !readerDescription.textContent;
      readerImage.classList.toggle('is-detail-image', activeReader.stepLabel !== 'Page');
      paintReaderPage();
    } else {
      readerToolbar.hidden = true;
      readerImage.src = trigger.getAttribute('data-reader-image');
      readerImage.alt = readerTitle.textContent;
      readerImage.classList.add('is-detail-image');
      readerDescription.textContent = trigger.getAttribute('data-reader-description') || '';
      readerDescription.hidden = !readerDescription.textContent;
    }

    if (!reader.open) reader.showModal();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-reader-kind]');
    if (trigger) openReader(trigger);
  });
  readerPrev.addEventListener('click', function () {
    if (activeReader && activePage > 1) { activePage -= 1; paintReaderPage(); }
  });
  readerNext.addEventListener('click', function () {
    if (activeReader && activePage < activeReader.count) { activePage += 1; paintReaderPage(); }
  });
  readerClose.addEventListener('click', function () { reader.close(); });
  reader.addEventListener('close', function () {
    if (!readerVideo) return;
    readerVideo.pause();
    readerVideo.removeAttribute('src');
    readerVideo.load();
    readerImage.hidden = false;
  });
  reader.addEventListener('click', function (event) {
    if (event.target === reader) reader.close();
  });
  reader.addEventListener('keydown', function (event) {
    if (!activeReader) return;
    if (event.key === 'ArrowLeft' && activePage > 1) { activePage -= 1; paintReaderPage(); }
    if (event.key === 'ArrowRight' && activePage < activeReader.count) { activePage += 1; paintReaderPage(); }
  });
}());
