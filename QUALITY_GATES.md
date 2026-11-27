# Conceptual portfolio quality gates

The page is an interface to Raphaël Pinson’s practice, not a project list or technology inventory.

## Meaning

1. **Human proposition first** — identity and “Making infrastructure work better for people” are understood before interaction.
2. **Practice, not personality claim** — the page states the repeated action: track constraints, redesign technical and human interfaces.
3. **One transferable grammar** — every route visibly connects a constraint to an interface and a shared capability.
4. **Impact before tooling** — DevOps, Platform Engineering, and Technical Education are the primary routes; technologies appear only as chronological evidence.
5. **Accurate continuity** — DevOps since 2005, Technical Education since 2008, Platform Engineering since 2012.
6. **Public proof** — the talk count is derived from the archive, while recordings, 100k+ lab sessions, and open-source work since 2005 remain visible and linked.

## Experience

7. **Exploration teaches the thesis** — scrolling advances DevOps, Platform Engineering, and Technical Education through one stable evidence stage; direct selection remains available.
8. **Immediate orientation** — route columns are explicitly labelled Constraint, Interface, and Shared capability.
9. **Keyboard-complete** — routes use tab semantics and support arrow, Home, and End keys.
10. **Responsive transformation** — narrow screens read as three complete chapters in order beneath a compact sticky route selector.
11. **Self-contained** — the experience uses local HTML, CSS, JavaScript, and imagery with no rendering dependency.
12. **Accessible and calm** — visible focus, semantic landmarks, useful alt text, and reduced-motion support.
13. **Archive continuity** — the technical timeline remains dense and functional while clearly belonging to the portfolio’s visual system.
14. **Shareable identity** — canonical, Open Graph, and Twitter metadata resolve to a purpose-built 1200×630 card.

The published homepage, creative portfolio, talk archive, and credentials page share a Jekyll layout and common header, footer, metadata, Analytics tag, and responsive styles. The technical archive remains a separate dense visualization; the experimental career timeline stays unpublished.

Before release, run:

```sh
node scripts/quality-gates.mjs
node --check js/skills.js
node --check talks/talks.js
node --check js/home-stats.js
node --check certifications/certifications.js
python3 -m json.tool certifications/credentials.json >/dev/null
python3 -m py_compile scripts/sync-public-credentials.py
git diff --check
```

The pull request workflow also builds the site with GitHub Pages Jekyll so the shared Liquid templates are checked before merge.
