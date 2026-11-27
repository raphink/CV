import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const talks = JSON.parse(readFileSync(join(root, 'talks/talks.json'), 'utf8'));
const output = join(root, 'talk-pages');

function slugify(value) {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function talkSlug(talk, index) {
  if (talk.slug) return talk.slug;
  const base = slugify(talk.title);
  return talks.filter((item) => slugify(item.title) === base).length < 2 ? base : `${base}-${talk.id || index}`;
}

function yamlString(value) {
  return JSON.stringify(String(value || ''));
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const slugs = new Set();

talks.forEach((talk, index) => {
  const slug = talkSlug(talk, index);
  if (!slug || slugs.has(slug)) throw new Error(`Duplicate or empty talk slug: ${slug}`);
  slugs.add(slug);
  const description = talk.summary || [talk.title, talk.event, talk.dateDisplay].filter(Boolean).join(' · ');
  const image = talk.deck
    ? `/talks/decks/rendered/${talk.deck.replace(/^decks\//, '').replace(/\.pdf$/i, '')}/slide-001.jpg`
    : (talk.id ? `https://i.ytimg.com/vi/${talk.id}/hqdefault.jpg` : '/img/social-card.png');
  let hasSync = false;
  if (talk.id && talk.deck) {
    try { readFileSync(join(root, `talks/cues/${slug}.json`)); hasSync = true; } catch { hasSync = false; }
  }
  const frontMatter = [
    '---',
    'layout: talk-detail',
    `title: ${yamlString(`${talk.title} — Raphaël Pinson`)}`,
    `description: ${yamlString(description)}`,
    `og_description: ${yamlString(description)}`,
    `og_image: ${yamlString(image)}`,
    `og_alt: ${yamlString(talk.title)}`,
    `canonical: https://raphink.info/talks/${slug}/`,
    'stylesheets:',
    '  - /talks/talk-detail.css',
    'nav_section: talks',
    'body_class: talk-detail-page',
    `talk_slug: ${yamlString(slug)}`,
    `talk_index: ${index}`,
    `has_sync: ${hasSync}`,
    `permalink: /talks/${slug}/`,
    '---',
    ''
  ].join('\n');
  writeFileSync(join(output, `${slug}.html`), frontMatter);
});

console.log(`Generated ${talks.length} shareable talk pages.`);
