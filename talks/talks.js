(function () {
  'use strict';

  var talksUrl = 'talks.json';
  var grid = document.getElementById('talk-grid');
  var filters = document.getElementById('topic-filters');
  var search = document.getElementById('talk-search');
  var languageFilters = document.getElementById('language-filters');
  var results = document.getElementById('results-label');
  var empty = document.getElementById('no-results');
  var yearRail = document.getElementById('year-rail');
  var detail = document.getElementById('talk-detail');
  var modal = document.getElementById('talk-modal');
  var browser = document.querySelector('.talk-browser');
  var talks = [];
  var activeTopic = 'All topics';
  var activeLanguage = '';
  var searchTerm = '';
  var youtubePlayer = null;
  var youtubePlayerReady = false;
  var youtubeTimer = null;
  var nativeVideo = null;
  var youtubeApiLoading = false;
  var youtubeApiCallbacks = [];
  var activeTalk = null;
  var currentSlide = 1;
  var detailRenderSequence = 0;
  var visibleYears = [];
  var yearRailFrame = null;

  window.onYouTubeIframeAPIReady = function () {
    youtubeApiCallbacks.forEach(function (callback) { callback(); });
    youtubeApiCallbacks = [];
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
    });
  }

  function slugify(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function formatDate(value) {
    if (/^\d{4}$/.test(value)) return value;
    var date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function trackTalkView(talk) {
    if (typeof window.gtag !== 'function') return;
    var hasVideo = Boolean(talk.id || talk.recordingUrl);
    var hasSlides = Boolean(talk.deck);
    window.gtag('event', 'view_talk', {
      talk_title: talk.title,
      talk_slug: talkSlug(talk),
      talk_event: talk.event || '',
      talk_topic: talk.topic || '',
      talk_year: String(talk.date || '').slice(0, 4),
      media_type: hasVideo && hasSlides ? 'video_and_slides' : (hasVideo ? 'video' : (hasSlides ? 'slides' : 'details_only'))
    });
  }

  function talkLanguage(talk) {
    var languages = {
      en: { name: 'English', flag: '🇬🇧', code: 'EN' },
      fr: { name: 'French', flag: '🇫🇷', code: 'FR' }
    };
    return (talk.id || talk.recordingUrl || talk.recordingPageUrl) ? languages[talk.language] || null : null;
  }

  function fallbackCover(talk) {
    var words = String(talk.title).split(/\s+/);
    var lines = [];
    var line = '';
    words.forEach(function (word) {
      if ((line + ' ' + word).trim().length > 27 && line) {
        lines.push(line);
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    });
    if (line) lines.push(line);
    lines = lines.slice(0, 4);
    var title = lines.map(function (item, index) {
      return '<tspan x="92" dy="' + (index ? 76 : 0) + '">' + escapeHtml(item) + '</tspan>';
    }).join('');
    var event = escapeHtml(talk.event || talk.topic || 'Talk archive');
    var date = escapeHtml(talk.dateDisplay || 'Date not listed');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#071a22"/><stop offset="1" stop-color="#0d4651"/></linearGradient><pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse"><path d="M54 0H0V54" fill="none" stroke="#8de8e7" stroke-opacity=".12"/></pattern></defs><rect width="1600" height="900" fill="url(#bg)"/><rect width="1600" height="900" fill="url(#grid)"/><circle cx="1370" cy="270" r="215" fill="none" stroke="#ffd562" stroke-opacity=".72" stroke-width="3"/><circle cx="1370" cy="270" r="280" fill="none" stroke="#61e0e7" stroke-opacity=".28" stroke-width="2"/><text x="92" y="390" fill="#f6fbfc" font-family="Arial, sans-serif" font-size="67" font-weight="700">' + title + '</text><text x="92" y="744" fill="#b4c8ce" font-family="monospace" font-size="23" letter-spacing="2">' + event + '</text><text x="92" y="798" fill="#ffd562" font-family="monospace" font-size="21" letter-spacing="2">' + date + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function talkSlug(talk) {
    if (talk.slug) return talk.slug;
    var base = slugify(talk.title);
    var duplicates = talks.filter(function (item) { return slugify(item.title) === base; });
    if (duplicates.length < 2) return base;
    return base + '-' + (talk.id || talks.indexOf(talk));
  }

  function topicList() {
    return ['All topics'].concat(Array.from(new Set(talks.map(function (talk) { return talk.topic; }))));
  }

  function renderFilters() {
    filters.innerHTML = topicList().map(function (topic) {
      var selected = topic === activeTopic;
      return '<button class="topic-filter" type="button" data-topic="' + escapeHtml(topic) + '" aria-pressed="' + selected + '">' + escapeHtml(topic) + '</button>';
    }).join('');
  }

  function talkMatches(talk) {
    var text = [talk.title, talk.topic, talk.event || '', talk.dateDisplay || '', talk.date || ''].join(' ').toLowerCase();
    return (activeTopic === 'All topics' || talk.topic === activeTopic) && (!activeLanguage || talk.language === activeLanguage) && (!searchTerm || text.includes(searchTerm));
  }

  function cardMarkup(talk) {
    var slug = talkSlug(talk);
    var event = talk.event ? '<span class="talk-card-event">' + escapeHtml(talk.event) + '</span>' : '';
    var hasSlides = Boolean(talk.deck);
    // Reuse a local deck cover across entries from the same event so the archive
    // reads as one visual set even when an event has several recordings.
    var eventDeck = talk.event && talks.find(function (item) { return item.deck && item.event === talk.event; });
    var imageDeck = talk.deck ? talk : eventDeck;
    var thumbnail = imageDeck ? '<img src="' + escapeHtml(slideImagePath(imageDeck, 1)) + '" alt="" loading="lazy">' : (talk.id ? '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(talk.id) + '/hqdefault.jpg" alt="" loading="lazy">' : '<img src="' + fallbackCover(talk) + '" alt="" loading="lazy">');
    if (talk.id || talk.recordingUrl || talk.recordingPageUrl) thumbnail += '<span class="play-mark" aria-hidden="true">▶</span>';
    var thumbClass = imageDeck ? ' deck-cover' : '';
    var dateMarkup = talk.date ? '<time class="talk-card-date" datetime="' + escapeHtml(talk.date) + '">' + escapeHtml(talk.dateDisplay || formatDate(talk.date)) + '</time>' : '<span class="talk-card-date">' + escapeHtml(talk.dateDisplay || 'Date not listed') + '</span>';
    var hasRecording = Boolean(talk.id || talk.recordingUrl || talk.recordingPageUrl);
    var language = talkLanguage(talk);
    var languageMarkup = language ? '<span class="talk-card-language" role="img" aria-label="Language: ' + language.name + '" title="Language: ' + language.name + '"><span aria-hidden="true">' + language.flag + '</span><span>' + language.code + '</span></span>' : '';
    var formatLabel = hasRecording ? (hasSlides ? 'Recording and slides' : 'Recording') : (hasSlides ? 'PDF slides' : 'Conference session');
    var formatIcons = (hasRecording ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="1.5"/><path d="m15 10 6-3v10l-6-3z"/></svg>' : '') + (hasSlides ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 12h7M9 16h7"/></svg>' : '');
    var thumbFormat = formatIcons ? '<span class="talk-thumb-kind" role="img" aria-label="' + formatLabel + '" title="' + formatLabel + '">' + formatIcons + '</span>' : '';
    var year = talk.date && talk.date.match(/^\d{4}/) ? talk.date.slice(0, 4) : '';
    return '<a class="talk-card" href="?talk=' + encodeURIComponent(slug) + '" data-talk="' + escapeHtml(slug) + '" data-year="' + year + '">' +
      '<span class="talk-thumb' + thumbClass + '">' + thumbnail + thumbFormat + '</span>' +
      '<span class="talk-card-copy"><span class="talk-card-meta"><span>' + escapeHtml(talk.topic) + '</span><span class="talk-card-meta-right">' + dateMarkup + languageMarkup + (formatIcons ? '<span class="talk-card-formats" role="img" aria-label="' + formatLabel + '" title="' + formatLabel + '">' + formatIcons + '</span>' : '') + '</span></span>' +
      '<h3>' + escapeHtml(talk.title) + '</h3>' + event + '</span></a>';
  }

  function renderGrid() {
    var visible = talks.filter(talkMatches);
    visible.sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || '')) || a.title.localeCompare(b.title);
    });
    grid.innerHTML = visible.map(cardMarkup).join('');
    results.textContent = visible.length + (visible.length === 1 ? ' item' : ' items');
    empty.hidden = visible.length !== 0;
    renderFilters();
    renderYearRail(visible);
    scheduleYearRailUpdate();
  }

  function renderYearRail(items) {
    visibleYears = Array.from(new Set(items.map(function (talk) { return talk.date && talk.date.match(/^\d{4}/) ? talk.date.slice(0, 4) : null; }).filter(Boolean))).sort();
    if (visibleYears.length < 2) {
      yearRail.hidden = true;
      yearRail.parentElement.classList.remove('has-year-rail');
      yearRail.innerHTML = '';
      return;
    }
    yearRail.hidden = false;
    yearRail.parentElement.classList.add('has-year-rail');
    yearRail.innerHTML = '<span class="year-rail-label">Year</span><output class="year-value" id="year-current" for="year-range">' + visibleYears[visibleYears.length - 1] + '</output><input id="year-range" type="range" min="0" max="' + (visibleYears.length - 1) + '" step="1" value="' + (visibleYears.length - 1) + '" aria-label="Jump to year ' + visibleYears[visibleYears.length - 1] + '" aria-valuetext="' + visibleYears[visibleYears.length - 1] + '"><span class="year-rail-end year-value">' + visibleYears[0] + '</span>';
  }

  function scheduleYearRailUpdate() {
    if (yearRailFrame !== null) return;
    yearRailFrame = window.requestAnimationFrame(updateYearRailFromScroll);
  }

  function updateYearRailFromScroll() {
    yearRailFrame = null;
    if (yearRail.hidden || !visibleYears.length) return;
    var cards = Array.from(grid.querySelectorAll('.talk-card[data-year]'));
    if (!cards.length) return;

    // Keep the rail aligned to the card nearest the reader's natural scan line.
    var scanLine = Math.min(window.innerHeight * 0.32, 250);
    var activeCard = null;
    var smallestDistance = Infinity;
    cards.forEach(function (card) {
      if (!card.dataset.year) return;
      var rect = card.getBoundingClientRect();
      var distance = scanLine < rect.top ? rect.top - scanLine : (scanLine > rect.bottom ? scanLine - rect.bottom : 0);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        activeCard = card;
      }
    });
    if (!activeCard) return;
    var yearIndex = visibleYears.indexOf(activeCard.dataset.year);
    if (yearIndex < 0) return;
    var range = yearRail.querySelector('#year-range');
    var output = yearRail.querySelector('#year-current');
    if (range && Number(range.value) !== yearIndex) range.value = String(yearIndex);
    if (output && output.textContent !== activeCard.dataset.year) output.textContent = activeCard.dataset.year;
    if (range) {
      range.setAttribute('aria-label', 'Jump to year ' + activeCard.dataset.year);
      range.setAttribute('aria-valuetext', activeCard.dataset.year);
    }
  }

  function renderDetail(talk) {
    var renderSequence = ++detailRenderSequence;
    activeTalk = talk;
    modal.classList.remove('expanded');
    currentSlide = (talk.slideCues && talk.slideCues.length) ? talk.slideCues[0].page : 1;
    var pageCount = Number(talk.pageCount) || 1;
    var hasVideo = Boolean(talk.id || talk.recordingUrl);
    var hasDeck = Boolean(talk.deck);
    var hasBoth = hasVideo && hasDeck;
    var videoStart = Number(talk.videoStart) || 0;
    var localDeck = hasDeck ? '<section class="media-pane slides-pane" aria-label="Slides"><div class="slide-toolbar"><div class="slide-toolbar-title"><span class="eyebrow">Slides</span><span class="slide-page-status" aria-live="polite">Slide <b id="slide-current">' + currentSlide + '</b> of ' + pageCount + '</span></div><div class="slide-controls"><button type="button" data-slide-step="-1" aria-label="Previous slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><button type="button" data-slide-step="1" aria-label="Next slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></div><a class="open-pdf" href="' + escapeHtml(talk.deck) + '" target="_blank" rel="noopener noreferrer">Open PDF ↗</a></div><div class="slide-canvas"><img id="slide-image" src="' + escapeHtml(slideImagePath(talk, currentSlide)) + '" alt="Slide ' + currentSlide + ' of ' + escapeHtml(talk.title) + '" decoding="async"></div></section>' : '';
    var cuesAvailable = hasBoth && Array.isArray(talk.slideCues) && talk.slideCues.length;
    var syncControl = cuesAvailable ? '<div class="sync-control-wrap"><label class="sync-control"><input type="checkbox" id="sync-slides" checked> <span>Slides follow video</span></label><span class="sync-status" id="sync-status" aria-live="polite">Waiting for video</span></div>' : '';
    var videoMarkup = hasVideo ? '<section class="media-pane video-pane" aria-label="Recording"><div class="detail-video">' + (talk.id ? '<iframe id="talk-video-frame" src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(talk.id) + '?autoplay=1&rel=0&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin) + (videoStart > 0 ? '&start=' + Math.floor(videoStart) : '') + '" title="' + escapeHtml(talk.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' : '<video id="talk-video-frame" controls playsinline preload="metadata"' + (videoStart > 0 ? ' data-start="' + Math.floor(videoStart) + '"' : '') + '><source src="' + escapeHtml(talk.recordingUrl) + '" type="' + escapeHtml(talk.recordingType || 'video/webm') + '"></video>') + '</div></section>' : '';
    var mediaClass = hasBoth ? 'detail-media' : (hasDeck ? 'detail-media deck-only' : 'detail-media video-only');
    var mobileTabs = hasBoth ? '<div class="mobile-media-tabs" role="group" aria-label="Choose media"><button type="button" data-media="video" aria-pressed="true">Video</button><button type="button" data-media="slides" aria-pressed="false">Slides</button><button type="button" data-media="both" aria-label="Show video and slides together" aria-pressed="false">Both</button></div>' : '';
    var playerToolbar = hasBoth ? '<div class="player-toolbar"><div class="layout-controls" role="group" aria-label="Player layout"><button type="button" data-layout="split" aria-pressed="true">Side by side</button><button type="button" data-layout="video" aria-pressed="false">Focus video</button><button type="button" data-layout="slides" aria-pressed="false">Focus slides</button></div><div class="player-toolbar-right">' + syncControl + mobileTabs + '<button class="expand-player" type="button" data-expand-player aria-label="Expand side-by-side view" title="Expand side-by-side view" aria-pressed="false"><svg data-expand-icon viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3"/></svg><span class="visually-hidden">Expand side-by-side view</span></button></div></div>' : '';
    var mediaMarkup = hasVideo || hasDeck ? playerToolbar + '<div class="' + mediaClass + '" data-layout="' + (hasBoth ? 'split' : (hasDeck ? 'slides' : 'video')) + '" data-active="video">' + videoMarkup + localDeck + '</div>' : '';
    detail.innerHTML = '<a class="detail-back" href="./">← All talks</a>' +
      '<div class="detail-heading"><div><p class="eyebrow">' + escapeHtml(talk.topic) + (talk.event ? ' · ' + escapeHtml(talk.event) : '') + ' · ' + escapeHtml(talk.dateDisplay || formatDate(talk.date || '')) + '</p><h1 id="modal-title">' + escapeHtml(talk.title) + '</h1>' + (talk.summary ? '<p class="detail-summary">' + escapeHtml(talk.summary) + '</p>' : '') + '</div></div>' +
      mediaMarkup + (hasBoth && talk.slideCueNote ? '<p class="slide-cue-note">' + escapeHtml(talk.slideCueNote) + '</p>' : '') +
      '<div class="detail-actions">' + (talk.id ? '<a href="https://www.youtube.com/watch?v=' + encodeURIComponent(talk.id) + '" target="_blank" rel="noopener noreferrer">Open recording ↗</a>' : (talk.recordingPageUrl ? '<a href="' + escapeHtml(talk.recordingPageUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(talk.recordingLinkLabel || 'Recording details ↗') + '</a>' : (talk.recordingUrl ? '<a href="' + escapeHtml(talk.recordingUrl) + '" target="_blank" rel="noopener noreferrer">Open recording ↗</a>' : ''))) + (talk.alternateDeck ? '<a href="' + escapeHtml(talk.alternateDeck) + '" target="_blank" rel="noopener noreferrer">Open alternate PDF deck ↗</a>' : '') + (talk.programUrl ? '<a href="' + escapeHtml(talk.programUrl) + '" target="_blank" rel="noopener noreferrer">Conference program ↗</a>' : (talk.conferenceUrl ? '<a href="' + escapeHtml(talk.conferenceUrl) + '" target="_blank" rel="noopener noreferrer">Conference site ↗</a>' : '')) + '<button type="button" class="copy-permalink">Copy permalink</button></div>';
    detail.querySelectorAll('[data-slide-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        setSlidePage(currentSlide + Number(button.dataset.slideStep), true);
      });
    });
    if (!modal.open) modal.showModal();
    document.title = talk.title + ' — Raphaël Pinson';
    trackTalkView(talk);
    var htmlVideo = detail.querySelector('video#talk-video-frame');
    if (htmlVideo && Number(htmlVideo.dataset.start)) {
      htmlVideo.addEventListener('loadedmetadata', function () { htmlVideo.currentTime = Number(htmlVideo.dataset.start); }, { once: true });
    }
    if (cuesAvailable) initializeSlideSync(talk);
    else if (talk.cueFile) {
      loadTalkCues(talk).then(function (loaded) {
        if (!loaded || activeTalk !== talk || renderSequence !== detailRenderSequence || !modal.open) return;
        activateLoadedCues(talk);
      });
    }
  }

  function loadTalkCues(talk) {
    if (Array.isArray(talk.slideCues)) return Promise.resolve(true);
    if (!talk.cueFile) return Promise.resolve(false);
    if (talk.cueLoadPromise) return talk.cueLoadPromise;
    talk.cueLoadPromise = fetch(talk.cueFile).then(function (response) {
      if (!response.ok) throw new Error('Could not load slide cues.');
      return response.json();
    }).then(function (data) {
      if (!Array.isArray(data.slideCues) || !data.slideCues.length) throw new Error('Invalid slide cue data.');
      talk.slideCues = data.slideCues;
      if (data.slideCueNote) talk.slideCueNote = data.slideCueNote;
      return true;
    }).catch(function () {
      delete talk.cueLoadPromise;
      return false;
    });
    return talk.cueLoadPromise;
  }

  function activateLoadedCues(talk) {
    var controls = detail.querySelector('.player-toolbar-right');
    if (!controls || !talk.slideCues || !talk.slideCues.length) return;
    if (!detail.querySelector('#sync-slides')) {
      controls.insertAdjacentHTML('afterbegin', '<div class="sync-control-wrap"><label class="sync-control"><input type="checkbox" id="sync-slides" checked> <span>Slides follow video</span></label><span class="sync-status" id="sync-status" aria-live="polite">Waiting for video</span></div>');
    }
    if (talk.slideCueNote && !detail.querySelector('.slide-cue-note')) {
      var media = detail.querySelector('.detail-media');
      if (media) {
        var note = document.createElement('p');
        note.className = 'slide-cue-note';
        note.textContent = talk.slideCueNote;
        media.insertAdjacentElement('afterend', note);
      }
    }
    setSlidePage(talk.slideCues[0].page, false);
    initializeSlideSync(talk);
  }

  function loadYouTubeApi(callback) {
    if (window.YT && window.YT.Player) {
      callback();
      return;
    }
    youtubeApiCallbacks.push(callback);
    if (youtubeApiLoading) return;
    youtubeApiLoading = true;
    var script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  }

  function initializeSlideSync(talk) {
    if (!talk.id) {
      nativeVideo = document.getElementById('talk-video-frame');
      if (!nativeVideo) return;
      nativeVideo.addEventListener('play', function () {
        var toggle = document.getElementById('sync-slides');
        if (toggle && toggle.checked) startSlideSync(talk);
      });
      nativeVideo.addEventListener('pause', function () {
        stopSlideSync();
        var toggle = document.getElementById('sync-slides');
        if (toggle && toggle.checked) setSyncStatus('Paused');
      });
      nativeVideo.addEventListener('ended', function () {
        stopSlideSync();
        setSyncStatus('Video ended');
      });
      if (nativeVideo.paused) setSyncStatus('Play video to start');
      else startSlideSync(talk);
      return;
    }
    loadYouTubeApi(function () {
      var videoFrame = document.getElementById('talk-video-frame');
      if (!videoFrame) return;
      youtubePlayer = new window.YT.Player(videoFrame, {
        events: {
          onReady: function () {
            youtubePlayerReady = true;
            var toggle = document.getElementById('sync-slides');
            if (toggle && toggle.checked) {
              if (youtubePlayer.getPlayerState() === 1) startSlideSync(talk);
              else setSyncStatus('Play video to start');
            }
          },
          onStateChange: function (event) {
            var toggle = document.getElementById('sync-slides');
            if (event.data === 1 && toggle && toggle.checked) startSlideSync(talk);
            else if (event.data !== 1) {
              stopSlideSync();
              if (toggle && toggle.checked) setSyncStatus(event.data === 2 ? 'Paused' : 'Waiting for video');
            }
          }
        }
      });
    });
  }

  function startSlideSync(talk) {
    stopSlideSync();
    var page = null;
    setSyncStatus('Following slides');
    youtubeTimer = window.setInterval(function () {
      var seconds;
      if (youtubePlayer && youtubePlayer.getCurrentTime) seconds = youtubePlayer.getCurrentTime();
      else if (nativeVideo) seconds = nativeVideo.currentTime;
      else return;
      var cue = talk.slideCues.filter(function (item) { return item.time <= seconds; }).slice(-1)[0];
      if (!cue || cue.page === page) return;
      page = cue.page;
      setSlidePage(page, false);
      setSyncStatus('Following · slide ' + page);
    }, 900);
  }

  function setSyncStatus(message) {
    var status = detail.querySelector('#sync-status');
    if (status) status.textContent = message;
  }

  function setSlidePage(page, manual) {
    if (!activeTalk || !activeTalk.deck) return;
    var maxPage = Number(activeTalk.pageCount) || 9999;
    currentSlide = Math.max(1, Math.min(maxPage, Number(page) || 1));
    var image = detail.querySelector('#slide-image');
    var status = detail.querySelector('#slide-current');
    if (image) {
      image.src = slideImagePath(activeTalk, currentSlide);
      image.alt = 'Slide ' + currentSlide + ' of ' + activeTalk.title;
    }
    if (status) status.textContent = currentSlide;
    if (manual) {
      var toggle = detail.querySelector('#sync-slides');
      if (toggle) toggle.checked = false;
      stopSlideSync();
      setSyncStatus('Manual · slide ' + currentSlide);
    }
  }

  function slideImagePath(talk, page) {
    var deckName = talk.deck.replace(/^decks\//, '').replace(/\.pdf$/i, '');
    return 'decks/rendered/' + deckName + '/slide-' + String(page).padStart(3, '0') + '.jpg';
  }

  function stopSlideSync() {
    if (youtubeTimer) window.clearInterval(youtubeTimer);
    youtubeTimer = null;
  }

  function showArchive() {
    if (modal.open) modal.close();
    modal.classList.remove('expanded');
    detail.innerHTML = '';
    browser.hidden = false;
    document.title = 'Talks — Raphaël Pinson';
  }

  function applyUrl() {
    var slug = new URLSearchParams(window.location.search).get('talk');
    if (!slug) {
      showArchive();
      return;
    }
    var selected = talks.find(function (talk) { return talkSlug(talk) === slug; });
    if (selected) renderDetail(selected);
    else showArchive();
  }

  search.addEventListener('input', function () {
    searchTerm = search.value.trim().toLowerCase();
    renderGrid();
  });

  languageFilters.addEventListener('click', function (event) {
    var button = event.target.closest('[data-language]');
    if (!button) return;
    activeLanguage = button.dataset.language;
    languageFilters.querySelectorAll('[data-language]').forEach(function (option) {
      option.setAttribute('aria-pressed', String(option === button));
    });
    renderGrid();
  });

  filters.addEventListener('click', function (event) {
    var button = event.target.closest('[data-topic]');
    if (!button) return;
    activeTopic = button.dataset.topic;
    renderGrid();
  });

  yearRail.addEventListener('change', function (event) {
    if (!event.target.matches('#year-range')) return;
    var year = visibleYears[Number(event.target.value)];
    var output = yearRail.querySelector('#year-current');
    if (output) output.textContent = year;
    event.target.setAttribute('aria-label', 'Jump to year ' + year);
    event.target.setAttribute('aria-valuetext', year);
    var card = grid.querySelector('[data-year="' + year + '"]');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  window.addEventListener('scroll', scheduleYearRailUpdate, { passive: true });
  window.addEventListener('resize', scheduleYearRailUpdate);

  grid.addEventListener('click', function (event) {
    var card = event.target.closest('[data-talk]');
    if (!card || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var talk = talks.find(function (item) { return talkSlug(item) === card.dataset.talk; });
    if (!talk) return;
    event.preventDefault();
    history.pushState({ talkArchive: true }, '', card.href);
    renderDetail(talk);
  });

  window.addEventListener('popstate', applyUrl);

  modal.addEventListener('change', function (event) {
    if (!event.target.matches('#sync-slides')) return;
    if (!event.target.checked) {
      stopSlideSync();
      setSyncStatus('Off');
      return;
    }
    if (activeTalk && !activeTalk.id && nativeVideo) {
      if (nativeVideo.paused) setSyncStatus('Play video to start');
      else startSlideSync(activeTalk);
      return;
    }
    if (!youtubePlayerReady || !youtubePlayer) {
      setSyncStatus('Connecting to video…');
      return;
    }
    if (youtubePlayer.getPlayerState() === 1) startSlideSync(activeTalk);
    else setSyncStatus('Play video to start');
  });

  document.querySelector('.modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (event) { if (event.target === modal) modal.close(); });
  modal.addEventListener('click', function (event) {
    var expandButton = event.target.closest('[data-expand-player]');
    if (expandButton) {
      var expanded = modal.classList.toggle('expanded');
      expandButton.setAttribute('aria-pressed', String(expanded));
      var label = expanded ? 'Restore normal size' : 'Expand side-by-side view';
      expandButton.setAttribute('aria-label', label);
      expandButton.title = label;
      expandButton.querySelector('.visually-hidden').textContent = label;
      expandButton.querySelector('[data-expand-icon]').innerHTML = expanded ? '<path d="M9 4v5H4M20 9h-5V4M4 15h5v5M15 20v-5h5"/>' : '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3"/>';
      return;
    }
    var layoutButton = event.target.closest('.layout-controls [data-layout]');
    if (layoutButton) {
      var layout = layoutButton.dataset.layout;
      var media = detail.querySelector('.detail-media');
      var activeMedia = layout === 'slides' ? 'slides' : (layout === 'video' ? 'video' : 'both');
      if (media) {
        media.dataset.layout = layout;
        media.dataset.active = activeMedia;
      }
      modal.querySelectorAll('.layout-controls [data-layout]').forEach(function (button) { button.setAttribute('aria-pressed', String(button === layoutButton)); });
      modal.querySelectorAll('.mobile-media-tabs [data-media]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.media === activeMedia)); });
      return;
    }
    var mediaButton = event.target.closest('.mobile-media-tabs [data-media]');
    if (mediaButton) {
      var mediaStage = detail.querySelector('.detail-media');
      if (mediaStage) mediaStage.dataset.active = mediaButton.dataset.media;
      modal.querySelectorAll('.mobile-media-tabs [data-media]').forEach(function (button) { button.setAttribute('aria-pressed', String(button === mediaButton)); });
      return;
    }
    var copyButton = event.target.closest('.copy-permalink');
    if (!copyButton || !navigator.clipboard) return;
    navigator.clipboard.writeText(window.location.href).then(function () {
      copyButton.textContent = 'Link copied';
      window.setTimeout(function () { if (copyButton.isConnected) copyButton.textContent = 'Copy permalink'; }, 1800);
    });
  });
  modal.addEventListener('close', function () {
    stopSlideSync();
    if (youtubePlayer && youtubePlayer.destroy) youtubePlayer.destroy();
    youtubePlayer = null;
    youtubePlayerReady = false;
    nativeVideo = null;
    activeTalk = null;
    detail.innerHTML = '';
    document.title = 'Talks — Raphaël Pinson';
    var current = new URL(window.location.href);
    if (current.searchParams.has('talk')) {
      if (history.state && history.state.talkArchive) history.back();
      else history.replaceState({}, '', current.pathname);
    }
  });

  fetch(talksUrl).then(function (response) {
    if (!response.ok) throw new Error('Could not load talks.');
    return response.json();
  }).then(function (items) {
    talks = items;
    renderGrid();
    applyUrl();
  }).catch(function () {
    grid.innerHTML = '<p class="no-results">The talk archive could not be loaded. Please refresh the page.</p>';
  });
}());
