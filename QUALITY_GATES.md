# Portfolio quality gates

The page is evaluated as a personal portfolio for a future employer or Principal Engineer reviewer. Every gate must pass before the page is considered ready.

## Content

1. **A person leads** — name, current role, location, and a real portrait appear before the work.
2. **The point of view is immediate** — within the opening, explain that the work is about making infrastructure better for people, not merely operating technology.
3. **The scope is concrete** — name the kinds of work: architecture, platforms, workflows, labs, and feedback loops.
4. **Work is curated and evidenced** — three distinct bodies of work show learning at scale, technical communication/observability, and long-term open-source practice; public links support the claims.
5. **The public record is accurate** — 20+ talks delivered, 19 recorded, 100k+ lab sessions, and open-source work since 2005.
6. **Language earns its place** — no generic adoption claim or sales-funnel language; keep the user’s own interface thesis only where it explains the work.

## Presentation and usability

7. **It reads as a portfolio, not a product** — an editorial identity, portrait, selected-work list, and longer record replace product diagrams, dashboard metrics, and conversion CTAs.
8. **The reading order is calm** — identity → point of view → selected work → record → talks → résumé, with one clear H1.
9. **Mobile is intentional** — header, opening, project list, record, and talks reflow without squeezed columns.
10. **Accessible by default** — semantic landmarks, visible keyboard focus, useful image alt text, and reduced-motion handling.
11. **Self-contained and fast** — no framework, tracking script, or third-party runtime is needed to render the page.

`scripts/quality-gates.mjs` checks the deterministic parts of these gates. `node scripts/quality-gates.mjs && git diff --check` is the release check.
