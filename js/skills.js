(function () {
  'use strict';

  var routes = {
    devops: {
      period: '2005—now',
      title: 'Teach the why, not just the tool.',
      summary: 'Tools must serve people and human processes. Understanding their history, purpose, and trade-offs is what turns automation into better work.',
      tools: 'Debian · Puppet · Augeas · Terraform providers · Docker · Kubernetes · Cilium',
      link: 'https://github.com/raphink',
      linkText: 'Explore the work ↗',
      journey: [
        ['2005', 'Reproducible operations', 'Turn server knowledge into code and shared practice.'],
        ['2007', 'Configuration as an interface', 'Puppet and Augeas connect intent to system state.'],
        ['2016', 'Infrastructure as code', 'Reusable Terraform work makes change reviewable.'],
        ['Today', 'Context before commands', 'Teach the reason a tool exists, then how to use it.']
      ]
    },
    platform: {
      period: '2012—now',
      title: 'Make the useful path easier than the workaround.',
      summary: 'A platform is an interface between infrastructure and the people who depend on it. Its value is not hidden capability, but confident, shared operation.',
      tools: 'OpenStack · Rancher · Kubernetes · OpenShift · Argo CD · Cilium · Hubble · Tetragon',
      link: 'https://www.youtube.com/watch?v=yf_exP0ohOU',
      linkText: 'Watch: Bridging Dev and Ops ↗',
      journey: [
        ['2012', 'Cloud foundations', 'Expose infrastructure as a coherent service with OpenStack.'],
        ['2015', 'Container platforms', 'Rancher begins the path from clusters to usable operations.'],
        ['2017', 'Kubernetes practice', 'Build, teach, and operate shared cloud-native foundations.'],
        ['2022', 'See the system together', 'Cilium, Hubble, and eBPF connect technical signals to action.']
      ]
    },
    education: {
      period: '2008—now',
      title: 'Turn expertise into practice at scale.',
      summary: 'Education is an interface between knowing and doing. The learning environment must let people form a mental model, act on a real system, and learn from feedback.',
      tools: 'Debian packaging · Puppet · Docker · Terraform · Kubernetes · Cilium · Tetragon',
      link: 'https://isovalent.com/blog/post/cilium-lab-champion/',
      linkText: 'Read: Lab Champion programme ↗',
      journey: [
        ['2008', 'Teach the local practice', 'Help colleagues at Orange package software for Debian.'],
        ['2012', 'Build a curriculum', 'Teach Puppet, then develop structured technical programmes.'],
        ['2014—21', 'Follow the platform shift', 'Create programmes for Docker, Terraform, and Kubernetes.'],
        ['2022—now', 'Learning as a system', 'Hands-on labs, automation, feedback, badges—and 100k+ sessions.']
      ]
    }
  };

  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-route]'));
  var period = document.getElementById('detail-period');
  var title = document.getElementById('detail-title');
  var summary = document.getElementById('detail-summary');
  var journey = document.getElementById('detail-journey');
  var tools = document.getElementById('detail-tools');
  var link = document.getElementById('detail-link');

  function render(key, focusPanel) {
    var route = routes[key];
    if (!route) return;
    buttons.forEach(function (button) {
      var selected = button.dataset.route === key;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    period.textContent = route.period;
    title.textContent = route.title;
    summary.textContent = route.summary;
    tools.textContent = route.tools;
    link.href = route.link;
    link.textContent = route.linkText;
    journey.innerHTML = route.journey.map(function (stop) {
      return '<li><time>' + stop[0] + '</time><strong>' + stop[1] + '</strong><p>' + stop[2] + '</p></li>';
    }).join('');
    if (focusPanel) document.getElementById('route-detail').focus({ preventScroll: true });
  }

  buttons.forEach(function (button, index) {
    button.addEventListener('click', function () { render(button.dataset.route, false); });
    button.addEventListener('keydown', function (event) {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      var next = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      buttons[next].focus();
      render(buttons[next].dataset.route, false);
    });
  });

  render('devops', false);
}());
