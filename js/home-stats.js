(function () {
  'use strict';

  var heroCount = document.getElementById('hero-talk-count');
  var summary = document.getElementById('talks-summary');
  var archiveCount = document.getElementById('talks-archive-count');
  if (!heroCount && !summary && !archiveCount) return;

  fetch('talks/talks.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Talk archive unavailable');
      return response.json();
    })
    .then(function (talks) {
      if (!Array.isArray(talks)) throw new Error('Talk archive has an unexpected format');
      var recordings = talks.filter(function (talk) { return Boolean(talk.id || talk.recordingUrl); }).length;
      var decks = talks.filter(function (talk) { return Boolean(talk.deck); }).length;
      if (heroCount) heroCount.textContent = talks.length;
      if (summary) summary.textContent = talks.length + ' talks and workshops · ' + recordings + ' recordings · ' + decks + ' slide decks.';
      if (archiveCount) archiveCount.textContent = talks.length + ' sessions · ' + recordings + ' recordings · ' + decks + ' slide decks';
    })
    .catch(function () {
      if (heroCount) heroCount.textContent = '—';
      if (summary) summary.textContent = 'Browse talks, workshops, and recordings from across my career.';
      if (archiveCount) archiveCount.textContent = 'Browse talks, workshops, and recordings';
    });
})();
