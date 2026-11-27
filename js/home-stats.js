(function () {
  'use strict';

  var countLink = document.getElementById('record-talk-count');
  var summary = document.getElementById('talks-summary');
  var archiveCount = document.getElementById('talks-archive-count');
  if (!countLink || !summary || !archiveCount) return;

  fetch('talks/talks.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Talk archive unavailable');
      return response.json();
    })
    .then(function (talks) {
      if (!Array.isArray(talks)) throw new Error('Talk archive has an unexpected format');
      var recordings = talks.filter(function (talk) {
        return Boolean(talk.id || talk.recordingUrl || talk.recordingPageUrl);
      }).length;
      countLink.textContent = talks.length + ' ↗';
      countLink.setAttribute('aria-label', 'Browse all ' + talks.length + ' public talks and workshops');
      summary.textContent = talks.length + ' talks and workshops in the archive · ' + recordings + ' with recordings.';
      archiveCount.textContent = talks.length + ' sessions · ' + recordings + ' with recordings';
    })
    .catch(function () {
      countLink.textContent = 'Browse ↗';
      countLink.removeAttribute('aria-label');
      summary.textContent = 'Browse talks, workshops, and recordings from across my career.';
      archiveCount.textContent = 'Browse talks, workshops, and recordings';
    });
})();
