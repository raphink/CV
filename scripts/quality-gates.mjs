import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/overrides.css', import.meta.url), 'utf8');
const mobileCss = readFileSync(new URL('../css/mobile.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/skills.js', import.meta.url), 'utf8');
let failed = 0;
const gate = (name, condition) => { if (condition) console.log(`PASS  ${name}`); else { failed++; console.error(`FAIL  ${name}`); } };
const all = (source, terms) => terms.every((term) => source.includes(term));

gate('C1 identity and human proposition lead', all(html, ['Raphaël Pinson', 'Making infrastructure work better', 'for people.', 'people on both sides of the interface']));
gate('C2 active constraint practice is explicit', all(html, ['tracked constraints holding teams back', 'technical and human interfaces']));
gate('C3 three impact routes replace tool inventory', (html.match(/class="route(?: |")/g) ?? []).length === 3 && all(html, ['DevOps', 'Platform engineering', 'Technical education']));
gate('C4 repeated constraint-interface-capability grammar', all(html, ['Constraint</span>', 'Interface</span>', 'Shared capability</span>']));
gate('C5 histories are accurate and contextualised', all(html, ['2005—now', '2012—now', '2008—now']) && all(js, ['Ubuntu Developer', 'Systems Engineer · Orange', 'Infrastructure Developer · Camptocamp', 'Solutions Architect · Isovalent']));
gate('C6 evidence is subordinate but reachable', all(js, ['yf_exP0ohOU', 'cilium-lab-champion', 'kubernetes.io', 'cilium.io']) && all(html, ['https://labs.isovalent.com/', '100k+ ↗', '20+ ↗']));
gate('C7 public-speaking record is accurate', all(html, ['More than 20 talks delivered; 19 recorded.', 'PlatformCon', '19 recordings']));
gate('C8 route introduction is direct', html.includes('Each route below shows the same practice') && !html.includes('Select a route.'));
gate('P1 semantic landmarks and one H1', all(html, ['<header class="site-header">', '<main id="top">', '<footer>', 'role="tablist"', 'role="tabpanel"']) && (html.match(/<h1[ >]/g) ?? []).length === 1);
gate('P2 interaction works without dependency', all(html, ['<script src="js/skills.js" defer></script>']) && !/<script[^>]+https?:|<link[^>]+https?:/i.test(html));
gate('P3 keyboard route navigation', all(js, ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End', "setAttribute('aria-selected'"]));
gate('P4 current portrait is local', html.includes('img/raphael-pinson-2025.webp') && existsSync(new URL('../img/raphael-pinson-2025.webp', import.meta.url)));
gate('P5 hero principle belongs elegantly to a balanced orbit', all(html, ['class="hero-orbit-copy"', 'M 60 160 C 165 -35 435 -35 540 160', 'IT is about people on both sides of the interface.']) && all(mobileCss, ['.hero-orbit-copy text', 'ui-sans-serif', 'text-anchor: middle', '@media (min-width: 901px) and (max-width: 1050px)', 'right: -11vw', '.hero-principle']) && !mobileCss.includes('paint-order: stroke fill'));
gate('P6 responsive layouts cover map and evidence', all(css, ['@media(max-width:900px)', '.route{grid-template-columns:1fr', '.journey{grid-template-columns:1fr 1fr', '@media(max-width:520px)']) && all(mobileCss, ['position: sticky', 'grid-template-columns: repeat(3', '.route-step,', 'scroll-margin-top: 140px']));
gate('P7 mobile selection reveals evidence immediately', all(js, ["matchMedia('(max-width: 900px)')", 'detailPanel.scrollIntoView', "detailPanel.focus({ preventScroll: true })"]));
gate('P8 external evidence opens safely in new tabs', all(js, ["querySelectorAll('a[href^=\"http\"]')", "externalLink.target = '_blank'", "externalLink.rel = 'noopener noreferrer'"]));
gate('P9 restrained scroll motion with a static fallback', all(js, ['IntersectionObserver', "querySelectorAll('main > section:not(.hero)')", "matchMedia('(prefers-reduced-motion: reduce)')", "hero.classList.add('is-visible')"]) && all(mobileCss, ['.motion-ready .hero-orbit-copy', 'transform: rotate(38deg)', '.motion-ready .scroll-slide', '@media (prefers-reduced-motion: reduce)']));
gate('P10 accessible focus and reduced motion', all(css, ['a:focus-visible,button:focus-visible', '@media(prefers-reduced-motion:reduce)']));
gate('P11 no product funnel language', !/see the interfaces in action|work-card|system-map|hero-cta/i.test(html));

if (failed) { console.error(`\n${failed} quality gate(s) failed.`); process.exitCode = 1; }
else console.log('\nAll conceptual portfolio gates passed.');
