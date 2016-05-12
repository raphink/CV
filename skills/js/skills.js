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
    {id: 'Orange', content: '<img src="img/orange.png" class="logo" /> Orange Portails — Systems Engineer', start: '2006-06-01', end: c2c_start, type: 'background', className: 'orange'},
    {id: 'Camptocamp', content: '<img src="img/camptocamp.png" class="logo" /> Camptocamp — Infrastructure Developer', start: c2c_start, end: new Date(), type: 'background', className: 'camptocamp'},

    // 0: Provisioning
    {id: 01, group: 0, content: 'Debian FAI', start: '2006-06-01', end: c2c_start, className: 'contributed'},
    {id: 02, group: 0, content: 'Kickstart', start: '2006-06-01', end: new Date(), className: 'implemented'},
    {id: 03, group: 0, content: 'Terraform', start: '2016-05-01', end: new Date(), className: 'implemented'},

    // 1: Cloud / IAAS
    {id: 11, group: 1, content: 'Amazon Web Services', start: '2010', end: new Date(), className: 'implemented'},
    {id: 12, group: 1, content: 'Openstack', start: '2013', end: new Date(), className: 'used'},

    // 2: Virtualization
    {id: 21, group: 2, content: 'Qemu', start: '2005', end: '2007', className: 'used'},
    {id: 22, group: 2, content: 'Xen', start: '2008', end: c2c_start, className: 'used'},
    {id: 23, group: 2, content: 'Virtualbox / Vagrant', start: c2c_start, end: new Date(), className: 'used'},

    // 3: Operating Systems
    {id: 31, group: 3, content: 'Debian<sup>*</sup> / Ubuntu<sup>**</sup>', start: '2002', end: new Date(), className: 'contributed'},
    {id: 32, group: 3, content: 'RedHat / CentOS', start: '2006', end: new Date(), className: 'implemented'},

    // 4: VCS
    {id: 41, group: 4, content: 'CVS', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 42, group: 4, content: 'Bazaar NG', start: '2005', end: '2008', className: 'used'},
    {id: 43, group: 4, content: 'Git', start: '2008', end: new Date(), className: 'implemented'},

    // 5: OS coding
    {id: 51, group: 5, content: 'Bash / Dash', start: '2005', end: new Date(), className: 'used'},
    {id: 52, group: 5, content: 'Perl', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 53, group: 5, content: 'Ruby', start: c2c_start, end: new Date(), className: 'implemented'},
    {id: 54, group: 5, content: 'Go', start: '2016', end: new Date(), className: 'used'},

    // 6: Configuration Management
    {id: 61, group: 6, content: 'Cfengine', start: '2006', end: c2c_start, className: 'implemented'},
    {id: 62, group: 6, content: 'Puppet<sup>*</sup>', start: '2007', end: new Date(), className: 'contributed'},
    {id: 63, group: 6, content: 'Augeas<sup>**</sup>', start: '2008', end: new Date(), className: 'contributed'},

    // 7: Containers
    {id: 71, group: 7, content: 'Chroot', start: '2006', end: '2010', className: 'used'},
    {id: 72, group: 7, content: 'LXC', start: '2008', end: c2c_start, className: 'implemented'},
    {id: 73, group: 7, content: 'OpenVZ', start: c2c_start, end: '2014', className: 'used'},
    {id: 74, group: 7, content: 'Docker / Rancher', start: '2014', end: new Date(), className: 'implemented'},

    // 8: Databases
    {id: 81, group: 8, content: 'MySQL', start: '2002', end: new Date(), className: 'implemented'},
    {id: 82, group: 8, content: 'PostgreSQL', start: '2007', end: new Date(), className: 'implemented'},

    // 9: Cloud / PAAS
    {id: 91, group: 9, content: 'Google AppEngine', start: '2008', end: '2010', className: 'used'},

    // 10: Web backend
    {id: 101, group: 10, content: 'PHP', logo: 'php', start: '2002', end: new Date(), className: 'used'},
    {id: 102, group: 10, content: 'Python', logo: 'python', details: '<p>When Google Wave came out, I was really interested in the concept and started coding extensions and bots for it. The best platform to easily achieve that was Google App Engine with Python.</p>', start: '2008', end: new Date(), className: 'implemented'},
    {id: 103, group: 10, content: 'Ruby', logo: 'ruby', details: '<p>My first contributions to Puppet in 2007 introduced me to Ruby. Since I started using Puppet extensively in 2012, Ruby has become my main programming language.</p><p>In spite of its speed downfalls, I appreciates the language\'s extreme flexibility.</p>', start: '2013', end: new Date(), className: 'implemented'},
    {id: 104, group: 10, content: 'Go', logo: 'go', details: '<p>I have been interested in Go every since it came out publicly.</p><p>When I started using Consul and Docker/Rancher, I finally had the occasion to read code and start contributing in Go.</p><p>I strongly appreciated the thorough approach of this language, combining the speed and robustness of compiled and strongly typed languages with the agility of its structures and interfaces.</p>', start: '2016', end: new Date(), className: 'used'},

    // 11: Web frontend
    {id: 111, group: 11, content: 'HTML / Javascript / CSS', details: "Yeah", start: '2002', end: new Date(), className: 'implemented'},
    {id: 112, group: 11, content: 'JQuery', start: c2c_start, end: new Date(), className: 'used'},
    {id: 113, group: 11, content: 'Bootstrap', start: '2015', end: new Date(), className: 'used'},
  ]);

  var container = document.getElementById('visualization');
  var end_date = new Date();
  end_date.setMonth( end_date.getMonth() + 4 )
  var options = {
    start: '2006-01-01',
    end: end_date,
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
        var html = '<a data-toggle="collapse" href="#data-'+item.id+'">'+title+'</a>';
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
