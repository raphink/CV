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
      var title = '';
      if (typeof item.name === 'string' && !(typeof item.logo === 'boolean' && item.logo === false)) {
        var logo_file_type = 'png';
        if (typeof item.logo_type === 'string') {
          logo_file_type = item.logo_type;
        }
        title += '<img src="skills/'+item.name+'/logo.'+logo_file_type+'" class="logo small" onerror="this.parentNode.removeChild(this)" /> ';
      }
      title += item.content;

      if (item.type === 'background') {
        return title;
      } else {
        var html = '<span class="zoom" vis-item-id="'+item.id+'" title="Zoom on item and display details"><i class="glyphicon glyphicon-zoom-in"></i></span> ';
        html += '<a class="details-toggle" data-toggle="collapse" href="#details-'+item.id+'" title="Toggle details">'+title+'</a>';
        html += '<div class="details collapse" id="details-'+item.id+'"></div>';
        return html;
      }
    }
  };

  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);

  loadGroups(timeline);
}
$(document).ready(function () {
  skills()
});

function zoomItem(timeline, id) {
  var data = timeline.components[3].items[id].data;
  timeline.setWindow(data.start, data.end);
  $('#details-'+id).collapse('show');
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
      for (var id = 0; id < data.length; id++) {
        if (typeof data[id].id === 'undefined') {
          data[id].id = id;
        }
      }
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

      $('.zoom').on('click', function(e) {
        zoomItem(timeline, e.currentTarget.getAttribute('vis-item-id'));
      });

      $('#toggle-details').on('click', function(e) {
        toggleDetails();
      });

      $('#reset-zoom').on('click', function(e) {
        timeline.setWindow(timeline.options.start, timeline.options.end);
      });
    }
  });
}

function loadDetails(items) {
  for (var i in items._data) {
    var ii = items._data[i];
    if ((typeof ii.details === 'boolean' && ii.details === false) || typeof ii.name === 'undefined') {
      $('#details-'+ii.id).html('No details');
    } else {
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
}
