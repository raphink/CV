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
      cases: [
        ['Open-source configuration', 'Augeas as an interface', 'Contributed lenses and APIs, then became the main developer of AugeasProviders: typed, testable configuration interfaces for Puppet.', 'https://github.com/hercules-team/augeas/tree/master/lenses', 'Explore the lenses ↗'],
        ['Practice shared at ecosystem scale', 'Puppet contributor and educator', 'Turned operational practice into modules, courses, and community contribution; recognised as an Extraordinary Puppeteer Champion in 2020.', 'https://puppet-champions.github.io/puppeteers/raphink.html', 'See the recognition ↗']
      ],
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
      tools: 'OpenStack · Rancher · Kubernetes · OpenShift · Argo CD · Cilium · Hubble · Tetragon',
      link: 'https://www.youtube.com/watch?v=yf_exP0ohOU',
      linkText: 'Watch here: Bridging Dev and Ops ↓',
      cases: [
        ['Infrastructure made inspectable', 'Terraboard', 'Built a web interface for Terraform state so teams could understand shared infrastructure without reading raw state files.', 'https://github.com/camptocamp/terraboard', 'Explore Terraboard ↗'],
        ['A reusable path to operation', 'DevOps Stack', 'Helped shape a shared Kubernetes platform around declarative delivery, reusable components, and an operable path for teams.', 'https://devops-stack.io/', 'Explore DevOps Stack ↗']
      ],
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
      tools: 'Debian packaging · Puppet · Docker · Terraform · Kubernetes · Cilium · Tetragon',
      link: 'https://isovalent.com/blog/post/cilium-lab-champion/',
      linkText: 'Read here: Lab Champion programme ↓',
      cases: [
        ['Learning environment as product', 'Isovalent labs', 'Built a guided cloud-native practice environment with immediate feedback, clear progress, and more than 100k lab sessions supported.', 'https://labs.isovalent.com/', 'Enter the labs ↗'],
        ['Mental model, then real system', 'Public workshops and talks', 'Made complex infrastructure approachable through explanations, live systems, and reusable hands-on workshops delivered to public audiences.', 'https://www.youtube.com/playlist?list=PLP1tb3WVc_wjlegrHszh0BdnBNn2NqNQe', 'Browse 19 recordings ↗']
      ],
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
  var cases = document.getElementById('detail-cases');
  var tools = document.getElementById('detail-tools');
  var link = document.getElementById('detail-link');
  var detailPanel = document.getElementById('route-detail');
  var viewer = document.getElementById('content-viewer');
  var viewerBody = document.getElementById('viewer-body');
  var viewerKind = document.getElementById('viewer-kind');
  var viewerTitle = document.getElementById('viewer-title');
  var viewerSource = document.getElementById('viewer-source');
  var viewerClose = viewer.querySelector('.viewer-close');
  var viewerTrigger = null;

  var articles = {
    'lab-champion': {
      title: 'Introducing the Isovalent Lab Champion Program',
      meta: '16 May 2024 · Raphaël Pinson & Nico Vibert · Isovalent',
      image: 'https://cdn.sanity.io/images/xinsvxfu/production/44d09c29515cf6ce45320f68a23841b4cadc4463-6085x5539.png?rect=0,1173,6085,3195&w=1200&h=630',
      imageAlt: 'Isovalent Lab Champion Program',
      summary: 'A look at the programme built around Isovalent’s hands-on labs: how repeated practice becomes visible progress, recognised expertise, and a path for learners to help others.',
      points: ['Learning through real cloud-native environments', 'Progress and recognition designed into the experience', 'A community path from learner to champion']
    }
  };

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
    cases.innerHTML = route.cases.map(function (project) {
      return '<a class="case-card" href="' + project[3] + '"><small>' + project[0] + '</small><strong>' + project[1] + '</strong><p>' + project[2] + '</p><span>' + project[4] + '</span></a>';
    }).join('');
    prepareEmbeddableLinks(detailPanel);
    prepareExternalLinks(detailPanel);
    if (focusPanel) document.getElementById('route-detail').focus({ preventScroll: true });
  }

  function prepareExternalLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a[href^="http"]'), function (externalLink) {
      externalLink.target = '_blank';
      externalLink.rel = 'noopener noreferrer';
    });
  }

  function youtubeContent(url) {
    var parsed = new URL(url);
    var videoId = parsed.searchParams.get('v');
    var playlistId = parsed.searchParams.get('list');
    if (videoId) return { kind: 'video', id: videoId };
    if (playlistId) return { kind: 'playlist', id: playlistId };
    return null;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
    });
  }

  function prepareEmbeddableLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a[href]'), function (contentLink) {
      var href = contentLink.href;
      delete contentLink.dataset.contentKind;
      delete contentLink.dataset.contentId;
      contentLink.classList.remove('has-embedded-content');
      contentLink.removeAttribute('aria-haspopup');
      var youtube = href.includes('youtube.com/') ? youtubeContent(href) : null;
      if (youtube) {
        contentLink.dataset.contentKind = youtube.kind;
        contentLink.dataset.contentId = youtube.id;
      }
      if (href === 'https://isovalent.com/blog/post/cilium-lab-champion/') {
        contentLink.dataset.contentKind = 'article';
        contentLink.dataset.contentId = 'lab-champion';
      }
      if (contentLink.dataset.contentKind) {
        contentLink.classList.add('has-embedded-content');
        contentLink.setAttribute('aria-haspopup', 'dialog');
      }
    });
  }

  function openViewer(trigger) {
    if (typeof viewer.showModal !== 'function') return false;
    var kind = trigger.dataset.contentKind;
    var id = trigger.dataset.contentId;
    var titleElement = trigger.querySelector('strong');
    viewerTrigger = trigger;
    viewerSource.href = trigger.href;

    if (kind === 'video' || kind === 'playlist') {
      var embedUrl = kind === 'video'
        ? 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0'
        : 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(id) + '&autoplay=1&rel=0';
      viewerKind.textContent = kind === 'video' ? 'Recording' : 'Video archive';
      viewerTitle.textContent = titleElement ? titleElement.textContent : 'Public recording';
      viewerBody.innerHTML = '<div class="viewer-frame"><iframe src="' + embedUrl + '" title="' + escapeHtml(viewerTitle.textContent) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
    }

    if (kind === 'article') {
      var article = articles[id];
      if (!article) return false;
      viewerKind.textContent = 'Article preview';
      viewerTitle.textContent = article.title;
      viewerBody.innerHTML = '<article class="article-reader"><img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.imageAlt) + '"><div><p class="article-meta">' + escapeHtml(article.meta) + '</p><p class="article-summary">' + escapeHtml(article.summary) + '</p><ul>' + article.points.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join('') + '</ul></div></article>';
    }

    document.body.classList.add('viewer-open');
    viewer.showModal();
    viewerClose.focus();
    return true;
  }

  function closeViewer() {
    viewer.close();
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

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('a[data-content-kind]');
    if (!trigger) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (openViewer(trigger)) event.preventDefault();
  });

  viewerClose.addEventListener('click', closeViewer);
  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) closeViewer();
  });
  viewer.addEventListener('close', function () {
    document.body.classList.remove('viewer-open');
    viewerBody.innerHTML = '';
    if (viewerTrigger) viewerTrigger.focus();
    viewerTrigger = null;
  });

  prepareExternalLinks(document);
  prepareEmbeddableLinks(document);
  render('devops', false);
  prepareScrollMotion();
}());
