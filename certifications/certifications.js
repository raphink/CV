const certificationGrid = document.querySelector("#certification-grid");
const communityGrid = document.querySelector("#community-grid");
const message = document.querySelector("#credentials-message");
const count = document.querySelector("#credential-count");
const countLabel = document.querySelector("#credential-count-label");
const sourceStatus = document.querySelector("#credential-source-status");
const filterGroup = document.querySelector(".filter-group");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
let credentials = [];
let activeFilter = "all";
let updatedAt = null;

function dateLabel(value) {
  if (!value) return "";
  if (/^\d{4}$/.test(String(value))) return String(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function isExpired(item) {
  const status = item.status || "";
  if (/revoked|superseded/i.test(status)) return true;
  if (item.expires && /^\d{4}-\d{2}-\d{2}$/.test(item.expires)) {
    return item.expires < new Date().toISOString().slice(0, 10);
  }
  return /expired/i.test(status);
}

function groupedCredentials() {
  const ambassadors = credentials.filter((item) => /cncf ambassador/i.test(item.name || ""));
  const others = credentials.filter((item) => !/cncf ambassador/i.test(item.name || ""));
  if (ambassadors.length) {
    const current = ambassadors.filter((item) => !isExpired(item)).sort((a, b) => (b.expires || "").localeCompare(a.expires || ""));
    const latest = current[0] || ambassadors.sort((a, b) => (b.issued || "").localeCompare(a.issued || ""))[0];
    const earliest = ambassadors.map((item) => item.issued).filter(Boolean).sort()[0];
    others.push({ ...latest, name: "CNCF Ambassador", issued: earliest, status: current.length ? "Current" : "Historical" });
  }
  others.push({
    name: "Extraordinary Puppeteer Champion",
    issuer: "Puppet Community",
    issued: "2020",
    url: "https://puppet-champions.github.io/puppeteers/raphink.html",
    status: "Community recognition"
  });
  return others;
}

function isCommunity(item) {
  return /ambassador|organizer|speaker|advisory council|champion/i.test(item.name || "");
}

function render() {
  const visible = groupedCredentials().filter((item) => {
    if (activeFilter === "active") return !isExpired(item);
    if (activeFilter === "expired") return isExpired(item);
    return true;
  });

  const community = visible.filter(isCommunity);
  const certifications = visible.filter((item) => !isCommunity(item));

  function renderGrid(grid, items) {
    grid.replaceChildren(...items.map((item) => {
    const card = document.createElement("article");
    card.className = "credential-card";

    const top = document.createElement("div");
    top.className = "credential-card-top";
    const issuer = document.createElement("span");
    issuer.className = "credential-issuer";
    issuer.textContent = item.issuer || "Credential";
    top.append(issuer);
    if (item.status) {
      const state = document.createElement("span");
      const expired = isExpired(item);
      state.className = `credential-state ${expired ? "is-expired" : "is-current"}`;
      state.textContent = expired
        ? (/revoked|superseded/i.test(item.status) ? item.status : "Historical")
        : (/^(valid|current)$/i.test(item.status) ? "Current" : item.status);
      top.append(state);
    }

    const heading = document.createElement("div");
    heading.className = `credential-card-heading${item.image ? " has-image" : ""}`;
    if (item.image) {
      const art = document.createElement("img");
      art.className = "credential-art";
      art.src = item.image;
      art.alt = `${item.name || "Credential"} badge artwork`;
      art.loading = "lazy";
      art.decoding = "async";
      heading.append(art);
    }
    const title = document.createElement("h2");
    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = item.name || "Credential";
      title.append(link);
    } else {
      title.textContent = item.name || "Credential";
    }
    heading.append(title);
    const meta = document.createElement("div");
    meta.className = "credential-meta";
    const issued = document.createElement("span");
    issued.textContent = item.issued ? `Issued ${dateLabel(item.issued)}` : "";
    const expires = document.createElement("span");
    expires.textContent = item.expires ? `Expires ${dateLabel(item.expires)}` : "";
    meta.append(issued, expires);
    card.append(top, heading, meta);
      return card;
    }));
  }

  renderGrid(certificationGrid, certifications);
  renderGrid(communityGrid, community);
  certificationGrid.closest(".credential-section").hidden = certifications.length === 0;
  communityGrid.closest(".credential-section").hidden = community.length === 0;

  count.textContent = updatedAt ? String(groupedCredentials().length) : "—";
  countLabel.textContent = groupedCredentials().length === 1 ? "item" : "items";
  sourceStatus.textContent = updatedAt ? `Updated ${dateLabel(updatedAt)}` : "Public profile";
  filterGroup.hidden = !updatedAt;
  message.hidden = visible.length > 0;
  message.textContent = credentials.length
    ? "No credentials match this filter."
    : "View the current public credential record on CertDirectory: ";
  if (!credentials.length) {
    const link = document.createElement("a");
    link.href = "https://certdirectory.io/profile/raphink";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open the credential profile ↗";
    message.append(link);
  }
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((candidate) => {
    const selected = candidate === button;
    candidate.classList.toggle("is-active", selected);
    candidate.setAttribute("aria-pressed", String(selected));
  });
  render();
}));

fetch("credentials.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Credential feed returned ${response.status}`);
    return response.json();
  })
  .then((data) => {
    credentials = Array.isArray(data.credentials) ? data.credentials : [];
    updatedAt = data.updatedAt || null;
    render();
  })
  .catch(() => {
    credentials = [];
    sourceStatus.textContent = "Profile available";
    render();
  });
