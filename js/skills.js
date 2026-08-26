(function () {
  'use strict';

  var routes = {
    devops: {
      period: '2005—now',
      title: 'Teach the why, not just the tool.',
      summary: 'Tools must serve people and human processes. Understanding their history, purpose, and trade-offs is what turns automation into better work.',
      tools: '<a href="https://www.debian.org/">Debian</a> · <a href="https://www.puppet.com/">Puppet</a> · <a href="https://augeas.net/">Augeas</a> · <a href="https://developer.hashicorp.com/terraform/plugin">Terraform providers</a> · <a href="https://www.docker.com/">Docker</a> · <a href="https://kubernetes.io/">Kubernetes</a> · <a href="https://cilium.io/">Cilium</a>',
      link: 'https://github.com/raphink',
      linkText: 'Explore the work ↗',
      journey: [
        ['2005', 'Ubuntu Developer', 'Reproducible operations', 'Turn server knowledge into code and shared practice.'],
        ['2007', 'Systems Engineer · Orange', 'Configuration as an interface', 'Puppet and Augeas connect intent to system state.'],
        ['2016', 'Infrastructure Developer · Camptocamp', 'Infrastructure as code', 'Reusable Terraform work makes change reviewable.'],
        ['Today', 'Technical Marketing Engineer · Isovalent at Cisco', 'Context before commands', 'Teach the reason a tool exists, then how to use it.']
      ]
    },
    platform: {
      period: '2012—now',
      title: 'Make the useful path easier than the workaround.',
      summary: 'A platform is an interface between infrastructure and the people who depend on it. Its value is not hidden capability, but confident, shared operation.',
      tools: '<a href="https://www.openstack.org/">OpenStack</a> · <a href="https://www.rancher.com/">Rancher</a> · <a href="https://kubernetes.io/">Kubernetes</a> · <a href="https://www.redhat.com/en/technologies/cloud-computing/openshift">OpenShift</a> · <a href="https://argo-cd.readthedocs.io/">Argo CD</a> · <a href="https://cilium.io/">Cilium</a> · <a href="https://docs.cilium.io/en/stable/observability/hubble/">Hubble</a> · <a href="https://tetragon.io/">Tetragon</a>',
      link: 'https://www.youtube.com/watch?v=yf_exP0ohOU',
      linkText: 'Watch: Bridging Dev and Ops ↗',
      journey: [
        ['2012', 'Infrastructure Developer · Camptocamp', 'Cloud foundations', 'Expose infrastructure as a coherent service with OpenStack.'],
        ['2015', 'Infrastructure Developer · Camptocamp', 'Container platforms', 'Rancher begins the path from clusters to usable operations.'],
        ['2017', 'Infrastructure Developer · Camptocamp', 'Kubernetes practice', 'Build, teach, and operate shared cloud-native foundations.'],
        ['2022', 'Solutions Architect · Isovalent', 'See the system together', 'Cilium, Hubble, and eBPF connect technical signals to action.']
      ]
    },
    education: {
      period: '2008—now',
      title: 'Turn expertise into practice at scale.',
      summary: 'Education is an interface between knowing and doing. The learning environment must let people form a mental model, act on a real system, and learn from feedback.',
      tools: '<a href="https://www.debian.org/doc/manuals/maint-guide/">Debian packaging</a> · <a href="https://www.puppet.com/">Puppet</a> · <a href="https://www.docker.com/">Docker</a> · <a href="https://developer.hashicorp.com/terraform">Terraform</a> · <a href="https://kubernetes.io/">Kubernetes</a> · <a href="https://cilium.io/">Cilium</a> · <a href="https://tetragon.io/">Tetragon</a>',
      link: 'https://isovalent.com/blog/post/cilium-lab-champion/',
      linkText: 'Read: Lab Champion programme ↗',
      journey: [
        ['2008', 'Systems Engineer · Orange', 'Teach the local practice', 'Help colleagues at Orange package software for Debian.'],
        ['2012', 'Infrastructure Developer · Camptocamp', 'Build a curriculum', 'Teach Puppet, then develop structured technical programmes.'],
        ['2014—21', 'Infrastructure Developer · Camptocamp', 'Follow the platform shift', 'Create programmes for Docker, Terraform, and Kubernetes.'],
        ['2022—now', 'Isovalent · now Cisco', 'Learning as a system', 'Hands-on labs, automation, feedback, badges—and 100k+ sessions.']
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
  var detailPanel = document.getElementById('route-detail');

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
    tools.innerHTML = route.tools;
    link.href = route.link;
    link.textContent = route.linkText;
    journey.innerHTML = route.journey.map(function (stop) {
      return '<li><time><span>' + stop[0] + '</span><small>' + stop[1] + '</small></time><strong>' + stop[2] + '</strong><p>' + stop[3] + '</p></li>';
    }).join('');
    prepareExternalLinks(detailPanel);
    if (focusPanel) document.getElementById('route-detail').focus({ preventScroll: true });
  }

  function prepareExternalLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a[href^="http"]'), function (externalLink) {
      externalLink.target = '_blank';
      externalLink.rel = 'noopener noreferrer';
    });
  }

  function prepareScrollMotion() {
    var hero = document.querySelector('.hero');
    var slides = Array.prototype.slice.call(document.querySelectorAll('main > section:not(.hero)'));
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      hero.classList.add('is-visible');
      return;
    }

    document.documentElement.classList.add('motion-ready');
    slides.forEach(function (slide) {
      slide.classList.add('scroll-slide');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: .08
    });

    slides.forEach(function (slide) {
      observer.observe(slide);
    });

    window.requestAnimationFrame(function () {
      hero.classList.add('is-visible');
    });
  }

  buttons.forEach(function (button, index) {
    button.addEventListener('click', function () {
      render(button.dataset.route, false);
      if (window.matchMedia('(max-width: 900px)').matches) {
        window.requestAnimationFrame(function () {
          detailPanel.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          });
          detailPanel.focus({ preventScroll: true });
        });
      }
    });
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

  prepareExternalLinks(document);
  render('devops', false);
  prepareScrollMotion();
}());
