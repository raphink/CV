var timeline;
function skills() {

  var container = document.getElementById('visualization');

  var start_date = new Date('2006-01-01');
  var min_date = new Date();
  min_date.setFullYear(start_date.getFullYear() - 5);

  var end_date = new Date();
  end_date.setMonth(end_date.getMonth() + 4);
  var max_date = new Date();
  max_date.setFullYear(end_date.getFullYear() + 2);

  var options = {
    start: start_date,
    end: end_date,
    min: min_date,
    max: max_date,
    zoomMin: 18144000000,  // 1000*3600*24*7*30 = 1 month
    editable: false,
    groupOrder: function(a, b) {
      return b.id - a.id;
    },
    order: function(a, b) {
      return b.id - a.id;
    },
    orientation: 'both',
    autoResize: true,
    zoomKey: 'altKey',
    template: function(item) {
      var title = '<img src="skills/'+item.name+'/logo.png" class="logo small" onerror="this.parentNode.removeChild(this)" /> '+item.content;

      if (item.type === 'background') {
        return title;
      } else {
        var html = '<a class="zoom" href="javascript:zoomItem('+item.id+');"><small><i class="glyphicon glyphicon-zoom-in"></i></small></a> ';
        html += '<a class="details-toggle" data-toggle="collapse" href="#details-'+item.id+'">'+title+'</a>';
        html += '<div class="details collapse" id="details-'+item.id+'"></div>';
        return html;
      }
    }
  };

  timeline = new vis.Timeline(container);
  timeline.setOptions(options);

  loadGroups(timeline);
}

function zoomItem(id) {
  timeline.setWindow(timeline.components[3].items[id].data.start, timeline.components[3].items[id].data.end);
}

function filterItems(timeline, type) {
  $('.vis-item').not('.'+type).not('.vis-background').hide();
  $('.vis-item.'+type).show();
  timeline.redraw();
}

function toggleDetails() {
  $('.details').collapse('toggle');
}

function loadGroups(timeline) {
  $.ajax({
    url: './groups.json',
    timeline: timeline,
    success: function(data) {
      var items = new vis.DataSet(data);
      var timeline = this.timeline;
      timeline.setGroups(items);
      loadItems(timeline);
    }
  });
}

function loadItems(timeline) {
  $.ajax({
    url: './items.json',
    timeline: timeline,
    success: function(data) {
      var items = new vis.DataSet(data);

      // Preprocess items
      // Add end if missing
      var now = new Date();
      for (var item in items._data) {
        if (items._data[item].end === undefined) {
          items._data[item].end = now;
        }
      }

      this.timeline.setItems(items);

      loadDetails(items);

      var timeline = this.timeline;

      $('div.details').on('shown.bs.collapse hidden.bs.collapse', function(e) {
        timeline.redraw();
      });

      // Toggle items when legend is clicked
      $('#legend .used').on('click', function(e) {
        filterItems(timeline, 'used');
      });

      $('#legend .implemented').on('click', function(e) {
        filterItems(timeline, 'implemented');
      });

      $('#legend .contributed').on('click', function(e) {
        filterItems(timeline, 'contributed');
      });

      $('#legend .developed').on('click', function(e) {
        filterItems(timeline, 'developed');
      });

      $('#showAllItems').on('click', function(e) {
        // All items
        filterItems(timeline, 'vis-item');
      });
    }
  });
}

function loadDetails(items) {
  for (var i in items._data) {
    var ii = items._data[i];
    $.ajax({
        url: './skills/'+ii.name+'/details.md',
        id: i,
        success: function(details) {
          var reader = new commonmark.Parser();
          var writer = new commonmark.HtmlRenderer();
          var parsed = reader.parse(details);
          var html = writer.render(parsed);
          $('#details-'+this.id).html(html);
        },
        error: function() {
          $('#details-'+this.id).html('No details');
        }
    });
  }
}
