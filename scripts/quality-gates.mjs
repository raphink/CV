import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/overrides.css', import.meta.url), 'utf8');
let failed = 0;
const gate = (name, condition) => {
  if (condition) console.log(`PASS  ${name}`);
  else { failed += 1; console.error(`FAIL  ${name}`); }
};
const includesAll = (source, terms) => terms.every((term) => source.includes(term));

gate('C1 personal identity leads the page', includesAll(html, ['Raphaël Pinson', 'Technical Marketing Engineer', 'Isovalent at Cisco', 'img/raphael-pinson-2025.webp']));
gate('C2 clear human-centred proposition', includesAll(html, ['Making infrastructure', 'for people.', 'tracked constraints holding teams back', 'technical and human interfaces']));
gate('C3 concrete scope of practice', includesAll(html, ['implementation meets adoption', 'Theory of Constraints', 'a UI, automation, a platform capability, or a learning experience', 'give people a clear way to understand the system']));
gate('C4 curated work, not generic claims', (html.match(/class="project"/g) ?? []).length === 3 && includesAll(html, ['DEVOPS', 'PLATFORM ENGINEERING', 'TECHNICAL EDUCATION', 'eBPF', 'Terraform']));
gate('C5 accurate public record', includesAll(html, ['20+ talks', 'More than 20 delivered; 19 recorded', '100k+']));
gate('C6 public evidence remains reachable', includesAll(html, ['yf_exP0ohOU', 'isovalent.com/blog/post/cilium-lab-champion/', '8yzDqDHGLGw', 'PLP1tb3WVc_wjlegrHszh0BdnBNn2NqNQe']) && !html.includes('n_g60hLXZOk'));
gate('C7 no generic or product-funnel language', !/seamlessly|help teams adopt complex systems|hero-cta|see the interfaces in action/i.test(html));
gate('P1 semantic portfolio landmarks', includesAll(html, ['<header class="site-header">', '<main id="top">', '<footer>', '<nav aria-label="Primary navigation">']));
gate('P2 single personal page title', (html.match(/<h1[ >]/g) ?? []).length === 1);
gate('P3 contemporary editorial hierarchy and personal image', includesAll(html, ['class="intro"', 'class="portrait-wrap"', 'class="margin-note"']) && includesAll(css, ['.intro h1{max-width:850px;font-size:clamp(52px,7.4vw,112px);font-weight:750', 'radial-gradient(circle at 13% 21%']));
gate('P4 work reads as a curated record', includesAll(html, ['Selected work', 'The longer record', 'Public thinking']) && !html.includes('class="work-card"'));
gate('P5 responsive layout coverage', includesAll(css, ['@media(max-width:850px)', '.intro{grid-template-columns:82px 1fr', '.project{grid-template-columns:1fr', '.record dl{grid-template-columns:1fr 1fr']));
gate('P6 accessible focus and reduced motion', includesAll(css, ['a:focus-visible', '@media(prefers-reduced-motion:reduce)']));
gate('P7 no runtime dependency', !/<script\b|<link[^>]+https?:/i.test(html));

if (failed) { console.error(`\n${failed} quality gate(s) failed.`); process.exitCode = 1; }
else console.log('\nAll portfolio quality gates passed.');
