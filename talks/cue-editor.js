(function () {
  'use strict';

  var archive = [];
  var sourceCues = {};
  var sourceNotes = {};
  var drafts = {};
  var activeTalk = null;
  var player = null;
  var playerReady = false;
  var ticker = null;
  var searchMidpoint = null;
  var storageKey = 'raphink-talk-cue-drafts-v1';
  var select = document.getElementById('talk-select');
  var cueRows = document.getElementById('cue-rows');
  var cueEmpty = document.getElementById('cue-empty');
  var slidePreview = document.getElementById('slide-preview');
  var currentPageInput = document.getElementById('current-page');
  var cueNoteInput = document.getElementById('cue-note');
  var draftStatus = document.getElementById('draft-status');
  var videoTime = document.getElementById('video-time');
  var videoDuration = document.getElementById('video-duration');

  function safeLoadDrafts() {
    try {
      drafts = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    } catch (error) {
      drafts = {};
    }
  }

  function saveDrafts() {
    if (!activeTalk) return;
    drafts[activeTalk.id] = {
      slideCues: activeTalk.slideCues || [],
      slideCueNote: activeTalk.slideCueNote || ''
    };
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
    draftStatus.textContent = 'Draft saved in this browser';
  }

  function formatTime(seconds) {
    var total = Math.max(0, Math.floor(Number(seconds) || 0));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var secs = total % 60;
    return hours ? hours + ':' + String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0') : minutes + ':' + String(secs).padStart(2, '0');
  }

  function currentTime() {
    return playerReady && player && player.getCurrentTime ? Number(player.getCurrentTime()) || 0 : 0;
  }

  function slidePath(talk, page) {
    var deckName = talk.deck.replace(/^decks\//, '').replace(/\.pdf$/i, '');
    return 'decks/rendered/' + deckName + '/slide-' + String(page).padStart(3, '0') + '.jpg';
  }

  function maxPage() {
    return activeTalk ? Number(activeTalk.pageCount) || 1 : 1;
  }

  function setPage(page) {
    if (!activeTalk) return;
    var nextPage = Math.max(1, Math.min(maxPage(), Math.round(Number(page) || 1)));
    currentPageInput.value = String(nextPage);
    slidePreview.src = slidePath(activeTalk, nextPage);
    slidePreview.alt = 'Slide ' + nextPage + ' of ' + activeTalk.title;
    document.getElementById('slide-status').textContent = 'Slide ' + nextPage + ' of ' + maxPage();
  }

  function sortCues() {
    activeTalk.slideCues = (activeTalk.slideCues || []).map(function (cue) {
      return { time: Math.max(0, Number(cue.time) || 0), page: Math.max(1, Math.min(maxPage(), Math.round(Number(cue.page) || 1))) };
    }).sort(function (a, b) { return a.time - b.time; });
  }

  function renderCues() {
    sortCues();
    cueRows.innerHTML = (activeTalk.slideCues || []).map(function (cue, index) {
      return '<tr class="cue-row" data-cue-index="' + index + '"><td><label><span class="visually-hidden">Cue time in seconds</span><input class="cue-time-input" type="number" min="0" step="0.1" value="' + cue.time + '"></label></td><td><label><span class="visually-hidden">PDF page</span><input class="cue-page-input" type="number" min="1" max="' + maxPage() + '" step="1" value="' + cue.page + '"></label></td><td>' + formatTime(cue.time) + '</td><td><button type="button" data-cue-seek>Seek</button> <button type="button" class="cue-delete" data-cue-delete>Remove</button></td></tr>';
    }).join('');
    cueEmpty.hidden = Boolean(activeTalk.slideCues && activeTalk.slideCues.length);
  }

  function addCue(time) {
    if (!activeTalk) return;
    var cueTime = Math.max(0, Number(time) || 0);
    var page = Math.max(1, Math.min(maxPage(), Math.round(Number(currentPageInput.value) || 1)));
    var nearby = (activeTalk.slideCues || []).findIndex(function (cue) { return Math.abs(cue.time - cueTime) < 1; });
    if (nearby >= 0) activeTalk.slideCues[nearby] = { time: cueTime, page: page };
    else activeTalk.slideCues.push({ time: cueTime, page: page });
    sortCues();
    renderCues();
    saveDrafts();
  }

  function seekVideo(time) {
    if (playerReady && player && player.seekTo) player.seekTo(Math.max(0, Number(time) || 0), true);
  }

  function showTalk(talk) {
    activeTalk = talk;
    var draft = drafts[talk.id];
    talk.slideCues = JSON.parse(JSON.stringify(draft ? draft.slideCues : sourceCues[talk.id] || []));
    talk.slideCueNote = draft ? draft.slideCueNote : sourceNotes[talk.id] || '';
    cueNoteInput.value = talk.slideCueNote;
    document.getElementById('open-deck').href = talk.deck;
    setPage((talk.slideCues[0] && talk.slideCues[0].page) || 1);
    renderCues();
    draftStatus.textContent = draft ? 'Draft loaded from this browser' : 'Source cues loaded';
    document.getElementById('search-start').value = '0';
    document.getElementById('search-end').value = player && player.getDuration ? String(Math.floor(player.getDuration()) || '') : '';
    document.getElementById('search-status').textContent = 'Choose a transition window, then inspect the video frame.';
    if (playerReady && player) player.cueVideoById(talk.id);
  }

  function updateClock() {
    if (!playerReady || !player || !player.getCurrentTime) return;
    var time = currentTime();
    videoTime.textContent = formatTime(time);
    var duration = Number(player.getDuration()) || 0;
    videoDuration.textContent = duration ? formatTime(duration) : '—';
    var endInput = document.getElementById('search-end');
    if (!endInput.value && duration) endInput.value = String(Math.floor(duration));
  }

  function loadYouTubePlayer() {
    if (player || !activeTalk || !window.YT || !window.YT.Player) return;
    player = new window.YT.Player('video-player', {
      videoId: activeTalk.id,
      playerVars: { controls: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: function () {
          playerReady = true;
          if (ticker) window.clearInterval(ticker);
          ticker = window.setInterval(updateClock, 250);
          updateClock();
        },
        onError: function () { draftStatus.textContent = 'The video player could not load this recording'; }
      }
    });
  }

  function loadApi() {
    window.onYouTubeIframeAPIReady = loadYouTubePlayer;
    if (window.YT && window.YT.Player) {
      loadYouTubePlayer();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  }

  function renderMidpoint() {
    var start = Number(document.getElementById('search-start').value);
    var end = Number(document.getElementById('search-end').value);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      document.getElementById('search-status').textContent = 'Enter a window end later than the start.';
      searchMidpoint = null;
      return;
    }
    searchMidpoint = (start + end) / 2;
    document.getElementById('midpoint-time').textContent = 'Midpoint: ' + formatTime(searchMidpoint) + ' (' + searchMidpoint.toFixed(1) + 's)';
    document.getElementById('search-status').textContent = 'Inspect the current video frame beside the selected PDF page.';
    seekVideo(searchMidpoint);
  }

  function narrowWindow(newSlideVisible) {
    if (searchMidpoint === null) {
      renderMidpoint();
      return;
    }
    if (newSlideVisible) document.getElementById('search-end').value = searchMidpoint.toFixed(1);
    else document.getElementById('search-start').value = searchMidpoint.toFixed(1);
    document.getElementById('search-status').textContent = newSlideVisible ? 'The new slide is visible by this time. Search the earlier half.' : 'The previous slide is still visible. Search the later half.';
    renderMidpoint();
  }

  function exportArchive() {
    var output = JSON.parse(JSON.stringify(archive));
    output.forEach(function (talk) {
      var draft = drafts[talk.id];
      if (draft && talk.deck && talk.id) {
        talk.slideCues = draft.slideCues;
        if (draft.slideCueNote) talk.slideCueNote = draft.slideCueNote;
        else delete talk.slideCueNote;
      }
    });
    var blob = new Blob([JSON.stringify(output, null, 2) + '\n'], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'talks.json';
    link.click();
    URL.revokeObjectURL(link.href);
    draftStatus.textContent = 'Exported talks.json';
  }

  function initialize() {
    fetch('talks.json', { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('Could not load talks.json');
      return response.json();
    }).then(function (items) {
      archive = items;
      safeLoadDrafts();
      var paired = archive.filter(function (talk) { return talk.id && talk.deck; }).sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      paired.forEach(function (talk) {
        sourceCues[talk.id] = JSON.parse(JSON.stringify(talk.slideCues || []));
        sourceNotes[talk.id] = talk.slideCueNote || '';
        var option = document.createElement('option');
        option.value = talk.id;
        option.textContent = (talk.dateDisplay || talk.event || 'Date not listed') + ' · ' + talk.title;
        select.appendChild(option);
      });
      if (!paired.length) throw new Error('No talks have both a video and a local deck');
      var initialId = new URLSearchParams(window.location.search).get('video');
      if (initialId && paired.some(function (talk) { return talk.id === initialId; })) select.value = initialId;
      showTalk(paired.find(function (talk) { return talk.id === select.value; }) || paired[0]);
      loadApi();
    }).catch(function (error) {
      draftStatus.textContent = error.message + ' — open this page through the local web server.';
    });
  }

  select.addEventListener('change', function () {
    var talk = archive.find(function (item) { return item.id === select.value; });
    if (talk) showTalk(talk);
  });
  currentPageInput.addEventListener('change', function () { setPage(currentPageInput.value); });
  document.getElementById('slide-prev').addEventListener('click', function () { setPage(Number(currentPageInput.value) - 1); });
  document.getElementById('slide-next').addEventListener('click', function () { setPage(Number(currentPageInput.value) + 1); });
  document.getElementById('add-current-cue').addEventListener('click', function () { addCue(currentTime()); });
  document.getElementById('check-midpoint').addEventListener('click', renderMidpoint);
  document.getElementById('frame-old').addEventListener('click', function () { narrowWindow(false); });
  document.getElementById('frame-new').addEventListener('click', function () { narrowWindow(true); });
  document.getElementById('add-boundary-cue').addEventListener('click', function () { addCue(Number(document.getElementById('search-end').value)); });
  cueNoteInput.addEventListener('change', function () {
    if (!activeTalk) return;
    activeTalk.slideCueNote = cueNoteInput.value.trim();
    saveDrafts();
  });
  cueRows.addEventListener('change', function (event) {
    var row = event.target.closest('[data-cue-index]');
    if (!row || !activeTalk) return;
    var cue = activeTalk.slideCues[Number(row.dataset.cueIndex)];
    if (event.target.matches('.cue-time-input')) cue.time = Math.max(0, Number(event.target.value) || 0);
    if (event.target.matches('.cue-page-input')) cue.page = Math.max(1, Math.min(maxPage(), Math.round(Number(event.target.value) || 1)));
    renderCues();
    saveDrafts();
  });
  cueRows.addEventListener('click', function (event) {
    var row = event.target.closest('[data-cue-index]');
    if (!row || !activeTalk) return;
    var cue = activeTalk.slideCues[Number(row.dataset.cueIndex)];
    if (event.target.closest('[data-cue-seek]')) {
      setPage(cue.page);
      seekVideo(cue.time);
    }
    if (event.target.closest('[data-cue-delete]')) {
      activeTalk.slideCues.splice(Number(row.dataset.cueIndex), 1);
      renderCues();
      saveDrafts();
    }
  });
  document.getElementById('restore-source').addEventListener('click', function () {
    if (!activeTalk) return;
    delete drafts[activeTalk.id];
    activeTalk.slideCues = JSON.parse(JSON.stringify(sourceCues[activeTalk.id] || []));
    activeTalk.slideCueNote = sourceNotes[activeTalk.id] || '';
    cueNoteInput.value = activeTalk.slideCueNote;
    window.localStorage.setItem(storageKey, JSON.stringify(drafts));
    renderCues();
    setPage((activeTalk.slideCues[0] && activeTalk.slideCues[0].page) || 1);
    draftStatus.textContent = 'Restored source cues';
  });
  document.getElementById('export-json').addEventListener('click', exportArchive);

  initialize();
}());
