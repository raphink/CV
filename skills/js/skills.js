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
    {id: 03, group: 0, content: 'Terraform', logo: 'terraform', start: '2016-05-01', end: new Date(), className: 'implemented'},

    // 1: Cloud / IAAS
    {id: 11, group: 1, content: 'Amazon Web Services', logo: 'aws', start: '2010', end: new Date(), className: 'implemented'},
    {id: 12, group: 1, content: 'Openstack', logo: 'openstack', start: '2013', end: new Date(), className: 'used'},

    // 2: Virtualization
    {id: 21, group: 2, content: 'Qemu', logo: 'qemu', start: '2005', end: '2007', className: 'used'},
    {id: 22, group: 2, content: 'Xen', logo: 'xen', start: '2008', end: c2c_start, className: 'used'},
    {id: 23, group: 2, content: 'Virtualbox / Vagrant', logo: 'virtualbox', start: c2c_start, end: new Date(), className: 'used'},

    // 3: Operating Systems
    {id: 31, group: 3, content: 'Debian', logo: 'debian', start: '2002', end: new Date(), className: 'contributed'},
    {id: 32, group: 3, content: 'Ubuntu', logo: 'ubuntu', start: '2004', end: new Date(), className: 'developed'},
    {id: 33, group: 3, content: 'RedHat / CentOS', logo: 'redhat', start: '2006', end: new Date(), className: 'implemented'},

    // 4: VCS
    {id: 41, group: 4, content: 'CVS', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 42, group: 4, content: 'Bazaar NG', logo: 'bzr', start: '2005', end: '2008', className: 'used'},
    {id: 43, group: 4, content: 'Git', logo: 'git', start: '2008', end: new Date(), className: 'implemented'},

    // 5: OS coding
    {id: 51, group: 5, content: 'Bash / Dash', start: '2005', end: new Date(), className: 'used'},
    {id: 52, group: 5, content: 'Perl', logo: 'perl', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 53, group: 5, content: 'C', start: '2008', end: new Date(), className: 'used'},
    {id: 54, group: 5, content: 'Ruby', logo: 'ruby', start: c2c_start, end: new Date(), className: 'implemented'},
    {id: 55, group: 5, content: 'Go', logo: 'go', start: '2016', end: new Date(), className: 'used'},

    // 6: Configuration Management
    {id: 61, group: 6, content: 'Cfengine', logo: 'cfengine', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 62, group: 6, content: 'Puppet', logo: 'puppet', start: '2007', end: new Date(), className: 'contributed'},
    {id: 63, group: 6, content: 'Augeas', logo: 'augeas', details: '<h5>Lenses</h5><p>When the Augeas project was first presented to me in 2007, I was very enthusiastic and started contributing new lenses very early. I quickly became the main contributor of Augeas lenses.</p><h5>API contributions</h5><p>Later on, I contributed C code for the API, as well bindings code for Python/Ruby and Perl (which I maintain on the CPAN).</p><h5>Augeasproviders</h5><p>I joined Dominic Cleal when he started the Augeasproviders project and am now the main developer.</p><h5>Talks and trainings</h5><p>I have talked about Augeas at various conferences and have written and taught a one-day course on using Augeas.</p>', start: '2008', end: new Date(), className: 'developed'},

    // 7: Containers
    {id: 71, group: 7, content: 'Chroot', start: '2006', end: '2010', className: 'used'},
    {id: 72, group: 7, content: 'LXC', logo: 'lxc', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 73, group: 7, content: 'OpenVZ', logo: 'openvz', start: c2c_start, end: '2014', className: 'used'},
    {id: 74, group: 7, content: 'Docker / Rancher', logo: 'docker', start: '2014', end: new Date(), className: 'implemented'},

    // 8: Databases
    {id: 81, group: 8, content: 'MySQL', logo: 'mysql', start: '2002', end: new Date(), className: 'implemented'},
    {id: 82, group: 8, content: 'PostgreSQL', logo: 'postgresql', start: '2007', end: new Date(), className: 'implemented'},


    // 9: Cloud / PAAS
    {id: 91, group: 9, content: 'Google AppEngine', logo: 'google_appengine', start: '2008', end: '2010', className: 'used'},

    // 10: Web backend
    {id: 101, group: 10, content: 'PHP', logo: 'php', start: '2002', end: new Date(), className: 'used'},
    {id: 102, group: 10, content: 'Python', logo: 'python', details: '<h5>Google Wave</h5><p>When Google Wave came out, I was really interested in the concept and started coding extensions and bots for it. The best platform to easily achieve that was Google App Engine with Python.</p><h5>Projects</h5><ul class="list-group"><li><a href="https://launchpad.net/wavebiblebot">Flammard</a>, a Bible bot for Google Wave</li><li><a href="https://launchpad.net/annoty">Annoty</a>, a generic, programmable, annotations bot for Google Wave</li></ul>', start: '2008', end: new Date(), className: 'implemented'},
    {id: 103, group: 10, content: 'Ruby', logo: 'ruby', details: '<p>My first contributions to Puppet in 2007 introduced me to Ruby. Since I started using Puppet extensively in 2012, Ruby has become my main programming language.</p><p>In spite of its speed downfalls, I appreciates the language\'s extreme flexibility.</p>', start: '2013', end: new Date(), className: 'implemented'},
    {id: 104, group: 10, content: 'Go', logo: 'go', details: '<p>I have been interested in Go every since it came out publicly.</p><p>When I started using Consul and Docker/Rancher, I finally had the occasion to read code and start contributing in Go.</p><p>I strongly appreciated the thorough approach of this language, combining the speed and robustness of compiled and strongly typed languages with the agility of its structures and interfaces.</p>', start: '2016', end: new Date(), className: 'used'},

    // 11: Web frontend
    {id: 111, group: 11, content: 'HTML / Javascript / CSS', logo: 'html_css_js', details: "<h5>Projects</h5><ul><li><a href='https://github.com/camptocamp/puppet-catalog-diff-viewer'>Puppet Catalog Diff Viewer</a>, a client web interface using JQuery and D3js</li><li><a href='https://github.com/camptocamp/r10k-dashboard'>R10k dashboard</a>, a dashboard using the GitHub JavaScript library</li></ul>", start: '2002', end: new Date(), className: 'implemented'},
    {id: 112, group: 11, content: 'JQuery', logo: 'jquery', start: c2c_start, end: new Date(), className: 'used'},
    {id: 113, group: 11, content: 'Bootstrap', logo: 'bootstrap', start: '2015', end: new Date(), className: 'used'},
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
      var title;
      if (item.logo) {
        title = '<img src="img/'+item.logo+'.png" class="logo small" /> '+item.content;
      } else {
        title = item.content;
      }

      if (item.details) {
        var html = '<a class="details-toggle" data-toggle="collapse" href="#data-'+item.id+'">'+title+'</a>';
        html += '<div class="details collapse" id="data-'+item.id+'">'+item.details+'</div>';
        return html;
        } else {
        return title;
      }
    }
  };

  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(groups);
  timeline.setItems(items);

  $('div.details').on('shown.bs.collapse hidden.bs.collapse', function(e) {
    timeline.redraw();
  });
}


function toggleDetails() {
  $('.details').collapse('toggle');
}
