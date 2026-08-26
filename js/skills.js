/* global vis, commonmark */
(function () {
  'use strict';
  var timeline, allDetailsVisible = false;
  var startDate = new Date('2006-01-01');
  var endDate = new Date(); endDate.setMonth(endDate.getMonth() + 4);

  function logo(item) {
    if (typeof item.name !== 'string' || item.logo === false) return '';
    var type = typeof item.logo_type === 'string' ? item.logo_type : 'png';
    return '<img src="skills/' + item.name + '/logo.' + type + '" class="logo small" alt="" onerror="this.remove()">';
  }
  function template(item) {
    var title = logo(item) + '<span>' + item.content + (item.award ? ' <span title="Award received">★</span>' : '') + '</span>';
    if (item.type === 'background') return title;
    return '<div class="skill-title"><button class="zoom" type="button" data-zoom-id="' + item.id + '" aria-label="Zoom to ' + item.content + '">⌕</button><button class="skill-toggle" type="button" data-details-id="' + item.id + '" aria-expanded="false">' + title + '</button></div><div class="details" id="details-' + item.id + '" hidden></div>';
  }
  function redraw() { window.setTimeout(function () { timeline.redraw(); }, 0); }
  function toggleDetail(id, show) {
    var detail = document.getElementById('details-' + id);
    var toggle = document.querySelector('[data-details-id="' + id + '"]');
    if (!detail) return;
    detail.hidden = typeof show === 'boolean' ? !show : !detail.hidden;
    if (toggle) toggle.setAttribute('aria-expanded', String(!detail.hidden));
    redraw();
  }
  function loadDetails(items) {
    items.forEach(function (item) {
      var detail = document.getElementById('details-' + item.id);
      if (!detail) return;
      if (item.details === false || typeof item.name === 'undefined') { detail.textContent = 'No details available.'; return; }
      fetch('./skills/' + item.name + '/details.md').then(function (response) { if (!response.ok) throw new Error(); return response.text(); }).then(function (markdown) {
        var reader = new commonmark.Parser(); detail.innerHTML = new commonmark.HtmlRenderer().render(reader.parse(markdown));
      }).catch(function () { detail.textContent = 'No details available.'; });
    });
  }
  function applyFilter(filter) {
    document.querySelectorAll('.vis-item:not(.vis-background)').forEach(function (item) { item.classList.toggle('is-filtered-out', filter !== 'all' && !item.classList.contains(filter)); });
    document.querySelectorAll('.filter').forEach(function (button) { var active = button.dataset.filter === filter; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  function init(items, groups) {
    var maxDate = new Date(endDate); maxDate.setFullYear(maxDate.getFullYear() + 2);
    timeline = new vis.Timeline(document.getElementById('visualization'));
    timeline.setOptions({start:startDate,end:endDate,min:new Date('2001-01-01'),max:maxDate,zoomMin:18144000000,editable:false,groupOrder:function(a,b){return b.id-a.id;},order:function(a,b){return b.id-a.id;},orientation:'both',autoResize:true,zoomKey:'altKey',template:template});
    timeline.setGroups(new vis.DataSet(groups)); timeline.setItems(items); timeline.addCustomTime(new Date(), 'today'); timeline.setCustomTimeTitle('Today', 'today'); loadDetails(items);
    document.getElementById('visualization').addEventListener('click', function (event) {
      var zoom = event.target.closest('[data-zoom-id]'), details = event.target.closest('[data-details-id]');
      if (zoom) { var data = items.get(zoom.dataset.zoomId); timeline.setWindow(data.start, data.end); toggleDetail(zoom.dataset.zoomId, true); }
      if (details) toggleDetail(details.dataset.detailsId);
    });
    document.querySelectorAll('.filter').forEach(function (button) { button.addEventListener('click', function () { applyFilter(button.dataset.filter); }); });
    document.getElementById('reset-zoom').addEventListener('click', function () { timeline.setWindow(startDate, endDate); });
    document.getElementById('jump-to-now').addEventListener('click', function () { timeline.moveTo(new Date(), { animation: { duration: 400, easingFunction: 'easeInOutQuad' } }); });
    document.getElementById('toggle-details').addEventListener('click', function (event) { allDetailsVisible = !allDetailsVisible; items.forEach(function (item) { toggleDetail(item.id, allDetailsVisible); }); event.currentTarget.textContent = allDetailsVisible ? 'Hide details' : 'Show details'; });
  }
  window.addEventListener('DOMContentLoaded', function () {
    Promise.all([fetch('./groups.json').then(function(r){return r.json();}),fetch('./items.json').then(function(r){return r.json();})]).then(function (data) {
      var groups = data[0], sourceItems = data[1], map = {}, now = new Date();
      groups.forEach(function (group, index) { group.id = typeof group.id === 'undefined' ? index : group.id; map[group.content.toLowerCase()] = group.id; });
      sourceItems.forEach(function (item, index) { item.id = typeof item.id === 'undefined' ? index : item.id; if (typeof item.group === 'string') item.group = map[item.group]; if (typeof item.end === 'undefined') item.end = now; });
      init(new vis.DataSet(sourceItems), groups);
    });
  });
}());
