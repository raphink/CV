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
        ['Infrastructure made inspectable', 'Terraboard', 'Built a web interface for Terraform state so teams could understand shared infrastructure without reading raw state files.', 'https://terraboard.io/', 'Explore Terraboard ↗'],
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
  var routeStops = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-route]'));
  var routesControl = document.querySelector('.routes');
  var mobileRouteSequence = document.getElementById('mobile-route-sequence');
  var mobileRouteMedia = window.matchMedia('(max-width: 900px)');
  var activeRouteKey = null;
  var routeChapterLabels = {
    devops: '01 · DevOps',
    platform: '02 · Platform engineering',
    education: '03 · Technical education'
  };

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

  var playlistRecordings = [
    ['yf_exP0ohOU', 'Bridging Dev and Ops with eBPF'],
    ['kTGU-Nc2Db0', 'Security observability with eBPF and Cilium Tetragon'],
    ['5dBbQlzUep8', 'How eBPF enables next-generation security enforcement'],
    ['0c_uSDD9r8U', 'Hands-on labs with Instruqt, gamification, and AI'],
    ['ge-iruUlYYs', 'Révolution eBPF : un noyau Linux dynamique · DevOps D-Day'],
    ['BO4MWeFkvRM', 'Révolution eBPF : un noyau Linux dynamique · CND France'],
    ['HqQlLtsZEp4', 'Avoiding technical debt in a cloud-native world'],
    ['nmJYlh-Vr0c', 'Open source, standards, and technical debt'],
    ['hzMif_cytLs', 'eBPF superpowers a dynamic kernel'],
    ['j8nT0eZcj54', 'Exploring Cilium, Tetragon, and eBPF'],
    ['goWY2S43cnE', 'Orchestrated functional testing with Puppet'],
    ['nGoB-w4tjvo', 'Cilium Service Mesh'],
    ['wBrlhctsmYs', 'Cilium and eBPF · CNCF Research End User Group'],
    ['qYXoA2gOXzU', 'Five-minute talks · DevOpsDays Amsterdam'],
    ['JJ1bFnJenms', 'Cloud-native application security with Cilium and eBPF'],
    ['n_g60hLXZOk', '100,000 sessions de labs réseau et sécurité cloud-native'],
    ['onzP72ZMXcw', 'Running Puppet on Kubernetes'],
    ['j_0KwA72ZPo', 'The platform engineer’s guide to Kubernetes networking'],
    ['8yzDqDHGLGw', 'Kubernetes networking foundations']
  ];
  var playlistCurrentIndex = 0;

  function journeyMarkup(route) {
    return route.journey.map(function (stop) {
      return '<li><time><span>' + stop[0] + '</span><small>' + stop[1] + '</small></time><strong>' + stop[2] + '</strong><p>' + stop[3] + '</p></li>';
    }).join('');
  }

  function casesMarkup(route) {
    return route.cases.map(function (project) {
      return '<a class="case-card" href="' + project[3] + '"><small>' + project[0] + '</small><strong>' + project[1] + '</strong><p>' + project[2] + '</p><span>' + project[4] + '</span></a>';
    }).join('');
  }

  function buildMobileRouteSequence() {
    mobileRouteSequence.innerHTML = Object.keys(routes).map(function (key) {
      var route = routes[key];
      return '<section class="route-detail mobile-route-panel" id="mobile-route-' + key + '" data-mobile-route="' + key + '" tabindex="-1"><div class="detail-intro"><p class="eyebrow">' + routeChapterLabels[key] + ' · ' + route.period + '</p><h3>' + route.title + '</h3><p>' + route.summary + '</p></div><ol class="journey">' + journeyMarkup(route) + '</ol><div class="case-studies"><span>Selected cases</span><div class="case-grid">' + casesMarkup(route) + '</div></div><div class="detail-foot"><div><span>Technical landscape</span><p>' + route.tools + '</p></div><a href="' + route.link + '">' + route.linkText + '</a></div></section>';
    }).join('');
    document.documentElement.classList.add('route-sequence-ready');
  }

  function updateRouteSelection(key) {
    buttons.forEach(function (button) {
      var selected = button.dataset.route === key;
      button.classList.toggle('is-active', selected);
      if (mobileRouteMedia.matches) {
        button.removeAttribute('aria-selected');
        if (selected) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      } else {
        button.removeAttribute('aria-current');
        button.setAttribute('aria-selected', String(selected));
      }
    });
  }

  function syncRouteMode() {
    routesControl.setAttribute('role', mobileRouteMedia.matches ? 'navigation' : 'tablist');
    buttons.forEach(function (button) {
      if (mobileRouteMedia.matches) {
        button.removeAttribute('role');
        button.setAttribute('aria-controls', 'mobile-route-' + button.dataset.route);
      } else {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', 'route-detail');
      }
    });
    updateRouteSelection(activeRouteKey || 'devops');
  }

  function render(key, focusPanel) {
    var route = routes[key];
    if (!route) return;
    if (activeRouteKey === key) {
      updateRouteSelection(key);
      if (focusPanel) detailPanel.focus({ preventScroll: true });
      return;
    }
    var changing = activeRouteKey !== null;
    activeRouteKey = key;
    updateRouteSelection(key);
    period.textContent = route.period;
    title.textContent = route.title;
    summary.textContent = route.summary;
    tools.innerHTML = route.tools;
    link.href = route.link;
    link.textContent = route.linkText;
    journey.innerHTML = journeyMarkup(route);
    cases.innerHTML = casesMarkup(route);
    prepareEmbeddableLinks(detailPanel);
    prepareExternalLinks(detailPanel);
    if (changing && typeof detailPanel.animate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detailPanel.animate([
        { opacity: .45, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    }
    if (focusPanel) document.getElementById('route-detail').focus({ preventScroll: true });
  }

  function prepareRouteNarrative() {
    if (!('IntersectionObserver' in window)) return;
    var routeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) render(entry.target.dataset.scrollRoute, false);
      });
    }, {
      rootMargin: '-47% 0px -47% 0px',
      threshold: 0
    });
    routeStops.forEach(function (stop) { routeObserver.observe(stop); });

    var mobileRouteObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && mobileRouteMedia.matches) render(entry.target.dataset.mobileRoute, false);
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-mobile-route]'), function (panel) {
      mobileRouteObserver.observe(panel);
    });
  }

  function scrollToRoute(key) {
    var stop = routeStops.find(function (candidate) { return candidate.dataset.scrollRoute === key; });
    if (!stop) return;
    stop.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });
  }

  function scrollToMobileRoute(key) {
    var panel = document.getElementById('mobile-route-' + key);
    if (!panel) return;
    panel.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
    panel.focus({ preventScroll: true });
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

  function recordingEmbedUrl(id) {
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
  }

  function renderPlaylistRecording(index) {
    var recording = playlistRecordings[index];
    if (!recording) return;
    playlistCurrentIndex = index;
    var frame = viewerBody.querySelector('iframe');
    var currentTitle = viewerBody.querySelector('.playlist-current-title');
    var currentCount = viewerBody.querySelector('.playlist-current-count');
    var previous = viewerBody.querySelector('[data-playlist-step="-1"]');
    var next = viewerBody.querySelector('[data-playlist-step="1"]');
    frame.src = recordingEmbedUrl(recording[0]);
    frame.title = recording[1];
    currentTitle.textContent = recording[1];
    currentCount.textContent = String(index + 1).padStart(2, '0') + ' / ' + playlistRecordings.length;
    previous.disabled = index === 0;
    next.disabled = index === playlistRecordings.length - 1;
    var currentButton = null;
    Array.prototype.forEach.call(viewerBody.querySelectorAll('[data-playlist-index]'), function (button) {
      var selected = Number(button.dataset.playlistIndex) === index;
      button.classList.toggle('is-current', selected);
      if (selected) {
        button.setAttribute('aria-current', 'true');
        currentButton = button;
      }
      else button.removeAttribute('aria-current');
    });
    if (currentButton && viewer.open) currentButton.scrollIntoView({ block: 'nearest' });
    viewerSource.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(recording[0]) + '&list=PLP1tb3WVc_wjlegrHszh0BdnBNn2NqNQe';
  }

  function renderPlaylist() {
    viewerKind.textContent = 'Video archive · 19 recordings';
    viewerTitle.textContent = 'Choose a recording';
    viewerBody.innerHTML = '<div class="playlist-browser"><div class="playlist-stage"><div class="viewer-frame"><iframe title="Public recording" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="playlist-current"><p class="playlist-current-count"></p><h3 class="playlist-current-title"></h3><div class="playlist-controls"><button type="button" data-playlist-step="-1">← Previous</button><button type="button" data-playlist-step="1">Next →</button></div></div></div><div class="playlist-index" role="list" aria-label="Public recordings">' + playlistRecordings.map(function (recording, index) {
      return '<button type="button" role="listitem" data-playlist-index="' + index + '"><span>' + String(index + 1).padStart(2, '0') + '</span><strong>' + escapeHtml(recording[1]) + '</strong></button>';
    }).join('') + '</div></div>';
    renderPlaylistRecording(0);
  }

  function openViewer(trigger) {
    if (typeof viewer.showModal !== 'function') return false;
    var kind = trigger.dataset.contentKind;
    var id = trigger.dataset.contentId;
    var titleElement = trigger.querySelector('strong');
    viewerTrigger = trigger;
    viewerSource.href = trigger.href;

    viewer.classList.toggle('playlist-mode', kind === 'playlist');

    if (kind === 'video') {
      var embedUrl = recordingEmbedUrl(id);
      viewerKind.textContent = 'Recording';
      viewerTitle.textContent = titleElement ? titleElement.textContent : 'Public recording';
      viewerBody.innerHTML = '<div class="viewer-frame"><iframe src="' + embedUrl + '" title="' + escapeHtml(viewerTitle.textContent) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
    }

    if (kind === 'playlist') renderPlaylist();

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
      if (mobileRouteMedia.matches) {
        window.requestAnimationFrame(function () {
          scrollToMobileRoute(button.dataset.route);
        });
      } else scrollToRoute(button.dataset.route);
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
      if (mobileRouteMedia.matches) scrollToMobileRoute(buttons[next].dataset.route);
      else scrollToRoute(buttons[next].dataset.route);
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
    var selection = event.target.closest('[data-playlist-index]');
    var step = event.target.closest('[data-playlist-step]');
    if (selection) renderPlaylistRecording(Number(selection.dataset.playlistIndex));
    if (step && !step.disabled) renderPlaylistRecording(playlistCurrentIndex + Number(step.dataset.playlistStep));
    if (event.target === viewer) closeViewer();
  });
  viewer.addEventListener('close', function () {
    document.body.classList.remove('viewer-open');
    viewer.classList.remove('playlist-mode');
    viewerBody.innerHTML = '';
    if (viewerTrigger) viewerTrigger.focus();
    viewerTrigger = null;
  });

  buildMobileRouteSequence();
  syncRouteMode();
  if (typeof mobileRouteMedia.addEventListener === 'function') mobileRouteMedia.addEventListener('change', syncRouteMode);
  prepareExternalLinks(document);
  prepareEmbeddableLinks(document);
  render('devops', false);
  prepareRouteNarrative();
  prepareScrollMotion();
}());
