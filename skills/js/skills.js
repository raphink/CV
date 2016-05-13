function skills() {
  var groups = new vis.DataSet([
    {id: 0, content: 'Provisioning'},
    {id: 1, content: 'Cloud / IAAS'},
    {id: 2, content: 'Virtualization'},
    {id: 3, content: 'Operating<br />Systems'},
    {id: 4, content: 'VCS'},
    {id: 5, content: 'OS coding'},
    {id: 6, content: 'Configuration<br />Management'},
    {id: 7, content: 'Containers'},
    {id: 8, content: 'Databases'},
    {id: 9, content: 'Cloud / PAAS'},
    {id: 10, content: 'Web backend'},
    {id: 11, content: 'Web frontend'},

    // Empty group to display period names
    {id: 99, content: '&nbsp;', className: 'group-header'},
  ]);

  var c2c_start = '2012-03-01';

  var items = new vis.DataSet([
    {id: 'Orange', content: '<img src="img/orange.png" class="logo" /><b>Orange Portails</b><br />Systems Engineer', start: '2006-06-01', end: c2c_start, type: 'background', className: 'orange'},
    {id: 'Camptocamp', content: '<img src="img/camptocamp.png" class="logo" /><b>Camptocamp</b><br />Infrastructure Developer', start: c2c_start, end: new Date(), type: 'background', className: 'camptocamp'},

    // 0: Provisioning
    {id: 01, group: 0, content: 'Debian FAI', start: '2006-06-01', end: c2c_start, className: 'contributed'},
    {id: 02, group: 0, content: 'Kickstart', start: '2006-06-01', end: new Date(), className: 'implemented'},
    {id: 03, group: 0, content: 'Terraform', name: 'terraform', start: '2016-05-01', end: new Date(), className: 'implemented'},

    // 1: Cloud / IAAS
    {id: 11, group: 1, content: 'Amazon Web Services', name: 'aws', start: '2010', end: new Date(), className: 'implemented'},
    {id: 12, group: 1, content: 'Openstack', name: 'openstack', start: '2013', end: new Date(), className: 'used'},

    // 2: Virtualization
    {id: 21, group: 2, content: 'Qemu', name: 'qemu', start: '2005', end: '2007', className: 'used'},
    {id: 22, group: 2, content: 'Xen', name: 'xen', start: '2008', end: c2c_start, className: 'used'},
    {id: 23, group: 2, content: 'Virtualbox / Vagrant', name: 'virtualbox', start: c2c_start, end: new Date(), className: 'used'},
    {id: 24, group: 2, content: 'KVM', name: 'kvm', start: '2014', end: new Date(), className: 'used'},

    // 3: Operating Systems
    {id: 31, group: 3, content: 'Debian', name: 'debian', start: '2002', end: new Date(), className: 'contributed'},
    {id: 32, group: 3, content: 'Ubuntu', name: 'ubuntu', start: '2004', end: new Date(), className: 'developed'},
    {id: 33, group: 3, content: 'RedHat / CentOS', name: 'redhat', start: '2006', end: new Date(), className: 'implemented'},

    // 4: VCS
    {id: 41, group: 4, content: 'CVS', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 42, group: 4, content: 'Bazaar NG', name: 'bzr', start: '2005', end: '2008', className: 'used'},
    {id: 43, group: 4, content: 'Git', name: 'git', start: '2008', end: new Date(), className: 'implemented'},

    // 5: OS coding
    {id: 51, group: 5, content: 'Bash / Dash', start: '2005', end: new Date(), className: 'used'},
    {id: 52, group: 5, content: 'Perl', name: 'perl', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 53, group: 5, content: 'C', start: '2008', end: new Date(), className: 'used'},
    {id: 54, group: 5, content: 'Ruby', name: 'ruby', start: c2c_start, end: new Date(), className: 'implemented'},
    {id: 55, group: 5, content: 'Go', name: 'go', start: '2016', end: new Date(), className: 'used'},

    // 6: Configuration Management
    {id: 61, group: 6, content: 'Cfengine', name: 'cfengine', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 62, group: 6, content: 'Puppet', name: 'puppet', start: '2007', end: new Date(), className: 'contributed'},
    {id: 63, group: 6, content: 'Augeas', name: 'augeas', start: '2008', end: new Date(), className: 'developed'},

    // 7: Containers
    {id: 71, group: 7, content: 'Chroot', start: '2006', end: '2010', className: 'used'},
    {id: 72, group: 7, content: 'LXC', name: 'lxc', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 73, group: 7, content: 'OpenVZ', name: 'openvz', start: c2c_start, end: '2014', className: 'used'},
    {id: 74, group: 7, content: 'Docker / Rancher', name: 'docker', start: '2014', end: new Date(), className: 'implemented'},

    // 8: Databases
    {id: 81, group: 8, content: 'MySQL', name: 'mysql', start: '2002', end: new Date(), className: 'implemented'},
    {id: 82, group: 8, content: 'PostgreSQL', name: 'postgresql', start: '2007', end: new Date(), className: 'implemented'},


    // 9: Cloud / PAAS
    {id: 91, group: 9, content: 'Google AppEngine', name: 'google_appengine', start: '2008', end: '2010', className: 'used'},

    // 10: Web backend
    {id: 101, group: 10, content: 'PHP', name: 'php', start: '2002', end: new Date(), className: 'used'},
    {id: 102, group: 10, content: 'Python', name: 'python', details: 'python', start: '2008', end: new Date(), className: 'implemented'},
    {id: 103, group: 10, content: 'Ruby', name: 'ruby', details: 'ruby', start: '2013', end: new Date(), className: 'implemented'},
    {id: 104, group: 10, content: 'Go', name: 'go', details: 'go', start: '2016', end: new Date(), className: 'used'},

    // 11: Web frontend
    {id: 111, group: 11, content: 'HTML / Javascript / CSS', name: 'html_css_js', details: "html_css_js", start: '2002', end: new Date(), className: 'implemented'},
    {id: 112, group: 11, content: 'JQuery', name: 'jquery', start: c2c_start, end: new Date(), className: 'used'},
    {id: 113, group: 11, content: 'Bootstrap', name: 'bootstrap', start: '2015', end: new Date(), className: 'used'},
  ]);

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
    template: function(item) {
      var title = '<img src="skills/'+item.name+'/logo.png" class="logo small" onerror="this.parentNode.removeChild(this)" /> '+item.content;

      var html = '<div class="details-toggle" data-toggle="collapse" href="#details-'+item.id+'">'+title+'</div>';
        html += '<div class="details collapse" id="details-'+item.id+'"></div>';
      return html;
    }
  };

  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(groups);
  timeline.setItems(items);

  loadDetails(items);

  $('div.details').on('shown.bs.collapse hidden.bs.collapse', function(e) {
    timeline.redraw();
  });

  // Toggle items when legend is clicked
  $('.legend .used').on('click', function(e) {
    $('.vis-item.used').toggle();
    timeline.redraw();
  });

  $('.legend .implemented').on('click', function(e) {
    $('.vis-item.implemented').toggle();
    timeline.redraw();
  });

  $('.legend .contributed').on('click', function(e) {
    $('.vis-item.contributed').toggle();
    timeline.redraw();
  });

  $('.legend .developed').on('click', function(e) {
    $('.vis-item.developed').toggle();
    timeline.redraw();
  });
}

function toggleDetails() {
  $('.details').collapse('toggle');
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
