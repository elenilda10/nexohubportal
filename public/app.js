import { renderHomeNext } from "./home-next.js";
import { config, bots, notices, faqs, releases, roadmap } from "./data.js";
import { createExtraPages } from "./extras.js";
import { renderSaveVidDetails } from "./savevid-detail.js";
import { renderSaveVidLanding } from "./savevid-landing.js";
import {brandLogo} from "./brand-icons.js";

const app = document.querySelector("#app");
const categories = ["Todos", ...new Set(bots.map((bot) => bot.category))];
const state = { category: "Todos", search: "" };
const svgPaths = {
  "network": '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><path d="M10 6.5h4a4 4 0 0 1 4 4V14"/><path d="M6.5 10v4a4 4 0 0 0 4 4H14"/>',
  "arrow-right": '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "download": '<path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  "music": '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  "trophy": '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
  "bell": '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
  "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  "sparkles": '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM4 2l.7 2.3L7 5l-2.3.7L4 8l-.7-2.3L1 5l2.3-.7L4 2Z"/>',
  "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
  "close": '<path d="M5 5 19 19M19 5 5 19"/>',
  "check": '<path d="m5 12 4 4L19 6"/>',
  "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/>',
  "layers": '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  "shield": '<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/>',
  "zap": '<path d="m13 2-9 12h7l-1 8 10-12h-7V2Z"/>',
  "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m14-18a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  "send": '<path d="m22 2-7 20-4-9-9-4 20-7Zm0 0L11 13"/>',
  "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  "moon": '<path d="M20.96 13a9 9 0 0 1-9.96-9.96A9 9 0 1 0 20.96 13Z"/>',
  "monitor": '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/>',
};
const icon = (name, size = 20) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.sparkles}</svg>`;
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch { return null; }
};
const encodeMailto = (subject) => `mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}`;
const link = (href, text, cls = "button button-primary", symbol = "arrow-right") =>
  `<a class="${cls}" href="${escapeHtml(href)}" ${href.startsWith("/") ? "data-nav" : ""}>${text}${icon(symbol, 18)}</a>`;
const dateLabel = (value) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T12:00:00Z"));
const getNotices = () => [...notices].sort((a, b) => b.date.localeCompare(a.date));
const extras = createExtraPages({ icon, escapeHtml, link, dateLabel, encodeMailto });

function header() {
  return `<header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="/" data-nav aria-label="NexoHub, página inicial">
        <span class="brand-mark">N<span></span></span><span class="brand-word">Nexo<span>Hub</span></span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="Navegação principal">
        <a data-nav href="/" class="${location.pathname === "/" ? "current" : ""}">Início</a>
        <a data-nav href="/bots" class="${location.pathname.startsWith("/bots") ? "current" : ""}">Nossos bots</a>
        <a data-nav href="/avisos" class="${location.pathname.startsWith("/avisos") ? "current" : ""}">Avisos</a>
        <a data-nav href="/atualizacoes" class="${location.pathname === "/atualizacoes" ? "current" : ""}">Atualizações</a>
        <a data-nav href="/ajuda" class="${location.pathname === "/ajuda" ? "current" : ""}">Ajuda</a>
        <a data-nav href="/status" class="${location.pathname === "/status" ? "current" : ""}">Status</a>
        <a data-nav href="/sobre" class="${location.pathname === "/sobre" ? "current" : ""}">Sobre</a>
      </nav>
      <div class="header-actions">
        <div class="theme-control" id="theme-control">
          <button class="theme-toggle" type="button" id="theme-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="theme-menu" aria-label="Alterar tema claro, escuro ou automático" title="Mudar aparência">
            <span class="theme-sun">${icon("sun",20)}</span><span class="theme-moon">${icon("moon",20)}</span>
          </button>
          <div class="theme-popover" id="theme-menu" role="group" aria-label="Preferência de aparência">
            <button class="theme-option" type="button" data-theme-choice="system" aria-pressed="false">${icon("monitor",17)} Automático</button>
            <button class="theme-option" type="button" data-theme-choice="light" aria-pressed="false">${icon("sun",17)} Claro</button>
            <button class="theme-option" type="button" data-theme-choice="dark" aria-pressed="false">${icon("moon",17)} Escuro</button>
          </div>
        </div>
        <a data-nav href="/pesquisar" class="header-search" aria-label="Pesquisar" title="Pesquisar no NexoHub">${icon("search", 20)}</a>
        <a class="header-contact" href="${encodeMailto("Contato com o NexoHub")}">${icon("mail", 17)}<span>Contato</span></a>
        <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="site-nav">${icon("menu", 23)}</button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-about">
          <a class="brand" href="/" data-nav><span class="brand-mark">N<span></span></span><span class="brand-word">Nexo<span>Hub</span></span></a>
          <p>O ponto de encontro dos nossos bots, novidades e serviços. Informação clara, sempre no mesmo lugar.</p>
        </div>
        <div class="footer-links"><span>Navegar</span><a href="/bots" data-nav>Projetos</a><a href="/avisos" data-nav>Avisos</a><a href="/atualizacoes" data-nav>Atualizações</a><a href="/status" data-nav>Status dos bots</a></div>
        <div class="footer-links"><span>Saiba mais</span><a href="/ajuda" data-nav>Central de ajuda</a><a href="/contato" data-nav>Contato e sugestões</a><a href="/planejamento" data-nav>Planejamento</a><a href="/sobre" data-nav>Sobre nós</a><a href="/privacidade" data-nav>Privacidade</a><a href="/termos" data-nav>Termos de uso</a></div>
      </div>
      <div class="footer-bottom"><small>© ${new Date().getFullYear()} NexoHub. Todos os direitos reservados.</small><small>Feito para conectar pessoas e projetos ${icon("heart", 13)}</small></div>
    </div>
  </footer>`;
}

function botCard(bot, index = 0) {
  return `<article class="bot-card accent-${escapeHtml(bot.accent)}" style="--card-order:${index}">
    <div class="bot-card-top"><div class="bot-symbol">${icon(bot.icon, 28)}</div><span class="bot-category">${escapeHtml(bot.category)}</span></div>
    <div class="bot-card-body">
      <h3>${escapeHtml(bot.name)}</h3><p>${escapeHtml(bot.short)}</p>
      ${bot.slug==="savevid" ? `<div class="bot-platform-icons" aria-label="Exemplos de plataformas do Save Vid DL">
        ${["Instagram","TikTok","YouTube e YouTube Music","Spotify"].filter(name=>bot.platformDetails?.some(p=>p.name===name)).map(name=>`<span title="${escapeHtml(name)}">${brandLogo(name,{size:20,decorative:true})}</span>`).join("")}
        <small>e mais serviços</small></div>`: ""}
    </div>
    <div class="bot-card-bottom"><a href="/bots/${encodeURIComponent(bot.slug)}" data-nav class="card-link" aria-label="Conhecer ${escapeHtml(bot.name)}">Conhecer projeto ${icon("arrow-up-right", 18)}</a></div>
    <div class="card-glow" aria-hidden="true"></div>
  </article>`;
}
function noticeCard(notice, index = 0) {
  return `<article class="notice-card" style="--card-order:${index}">
    <div class="notice-top"><span class="notice-tag">${escapeHtml(notice.category)}</span><time datetime="${notice.date}">${dateLabel(notice.date)}</time></div>
    <h3><a href="/avisos/${encodeURIComponent(notice.slug)}" data-nav>${escapeHtml(notice.title)}</a></h3>
    <p>${escapeHtml(notice.summary)}</p>
    <a class="text-link" href="/avisos/${encodeURIComponent(notice.slug)}" data-nav>Ler comunicado ${icon("arrow-right", 16)}</a>
  </article>`;
}
function sectionTitle(eyebrow, title, subtitle, href = "", actionText = "") {
  return `<div class="section-title"><div><span class="eyebrow">${escapeHtml(eyebrow)}</span><h2>${title}</h2><p>${escapeHtml(subtitle)}</p></div>${href ? link(href, escapeHtml(actionText), "quiet-link", "arrow-up-right") : ""}</div>`;
}

function home() {
  return renderHomeNext({ bots, getNotices, icon, link, sectionTitle, botCard, noticeCard, extras, escapeHtml, brandLogo, encodeMailto });
}

function botList() {
  return `<section class="inner-hero container">
    <span class="eyebrow">PROJETOS NEXOHUB</span><h1>Explore nossos <span class="gradient-text">bots.</span></h1>
    <p>Encontre informações, funcionalidades e novidades de cada um dos nossos projetos.</p>
  </section>
  <section class="container catalog-section"><div class="catalog-toolbar">
    <label class="search-box" for="bot-search">${icon("search", 20)}<input type="search" id="bot-search" autocomplete="off" value="${escapeHtml(state.search)}" placeholder="Pesquise por nome ou categoria..." aria-label="Pesquisar bots" /></label>
    <div class="filter-list" aria-label="Filtrar bots">${categories.map((category) => `<button type="button" class="filter-chip ${state.category === category ? "active" : ""}" data-filter="${escapeHtml(category)}" aria-pressed="${state.category === category}">${escapeHtml(category)}</button>`).join("")}</div>
  </div>
  <div class="catalog-meta"><span data-count></span><span>Conheça cada projeto</span></div><div class="bot-grid" id="catalog-results"></div>
  </section>`;
}

function updateCatalog() {
  const container = document.getElementById("catalog-results");
  if (!container) return;
  const search = state.search.toLocaleLowerCase("pt-BR").trim();
  const results = bots.filter((bot) =>
    (state.category === "Todos" || bot.category === state.category) &&
    [bot.name, bot.category, bot.short].some((text) => text.toLocaleLowerCase("pt-BR").includes(search))
  );
  container.innerHTML = results.length ? results.map(botCard).join("") : `<div class="empty-state">${icon("search", 29)}<h3>Nenhum projeto encontrado</h3><p>Tente outro termo de busca ou selecione outra categoria.</p></div>`;
  const count = document.querySelector("[data-count]");
  if (count) count.textContent = `${results.length} ${results.length === 1 ? "projeto encontrado" : "projetos encontrados"}`;
}

function botDetail(bot) {
  const official = safeUrl(bot.telegram);
  return `<section class="detail-hero accent-${escapeHtml(bot.accent)}"><div class="container">
    <div class="breadcrumbs"><a href="/" data-nav>Início</a>${icon("chevron-right", 15)}<a href="/bots" data-nav>Projetos</a>${icon("chevron-right", 15)}<span>${escapeHtml(bot.name)}</span></div>
    <div class="detail-heading"><div class="detail-icon">${icon(bot.icon, 42)}</div><div><span class="eyebrow">${escapeHtml(bot.category)}</span><h1>${escapeHtml(bot.name)}</h1><p>${escapeHtml(bot.short)}</p></div></div>
  </div></section>
  <section class="section detail-content"><div class="container detail-grid">
    <div class="detail-main">
      <div class="content-panel"><span class="eyebrow">SOBRE O PROJETO</span><h2>Conheça o ${escapeHtml(bot.name)}.</h2><p>${escapeHtml(bot.description)}</p></div>
      <div class="content-panel"><span class="eyebrow">RECURSOS</span><h2>O que você encontra</h2><ul class="feature-list">${bot.features.map((feature) => `<li><span>${icon("check", 17)}</span>${escapeHtml(feature)}</li>`).join("")}</ul></div>
      ${bot.slug === "savevid" && Array.isArray(bot.platformDetails) && bot.platformDetails.length
        ? renderSaveVidDetails(bot, {escapeHtml, icon, link})
        : `<div class="content-panel"><span class="eyebrow">INFORMAÇÕES</span><h2>Plataformas e compatibilidade</h2>
      ${bot.platforms.length
        ? `<p>Plataformas cadastradas para este projeto:</p><div class="platform-list">${bot.platforms.map((platform) => `<span>${icon("check", 14)}${escapeHtml(platform)}</span>`).join("")}</div>`
        : `<div class="info-placeholder">${icon("info", 20)}<p>A relação detalhada de plataformas ou integrações confirmadas ainda está sendo organizada. Consulte os avisos para acompanhar as atualizações.</p></div>`}
      </div>`}
    </div>
    <aside class="detail-aside"><div class="aside-card"><span class="eyebrow">ACESSO OFICIAL</span><h3>Quer conhecer esse projeto?</h3><p>Encontre informações e atualizações em nossa central.</p>
    ${official ? `<a class="button button-primary button-full" href="${escapeHtml(official)}" target="_blank" rel="noopener noreferrer">Abrir projeto ${icon("arrow-up-right", 18)}</a>` : `<div class="pending-link">${icon("clock", 17)} Link oficial ainda não cadastrado</div>`}
    <a class="button button-outline button-full" href="/avisos" data-nav>Ver comunicados ${icon("arrow-right", 18)}</a></div>
    <div class="aside-help">${icon("mail", 20)}<h3>Tem alguma dúvida?</h3><p>Envie sua pergunta ou sugestão para a nossa equipe.</p><a href="${encodeMailto("Dúvida sobre " + bot.name)}">Entrar em contato ${icon("arrow-up-right", 16)}</a></div></aside>
  </div></section>
  <section class="container related-section"><div class="related-top"><h2>Outros projetos que você pode gostar</h2><a href="/bots" data-nav>Ver catálogo ${icon("arrow-right", 16)}</a></div><div class="bot-grid related-grid">${bots.filter((other) => other.slug !== bot.slug).map(botCard).join("")}</div></section>`;
}

function noticesPage() {
  return `<section class="inner-hero container"><span class="eyebrow">COMUNICADOS OFICIAIS</span><h1>Tudo o que <span class="gradient-text">acontece.</span></h1><p>Acompanhe novidades, avisos importantes e atualizações dos nossos projetos.</p></section>
  <section class="container notices-page"><div class="notices-grid">${getNotices().map(noticeCard).join("")}</div></section>`;
}

function noticeDetail(notice) {
  return `<section class="inner-hero container article-hero">
    <div class="breadcrumbs"><a href="/" data-nav>Início</a>${icon("chevron-right", 15)}<a href="/avisos" data-nav>Avisos</a>${icon("chevron-right", 15)}<span>Comunicado</span></div>
    <span class="notice-tag">${escapeHtml(notice.category)}</span><h1>${escapeHtml(notice.title)}</h1>
    <div class="article-date">${icon("calendar", 17)} <time datetime="${notice.date}">${dateLabel(notice.date)}</time></div>
  </section>
  <article class="container article-shell"><div class="article-body"><p class="lead">${escapeHtml(notice.summary)}</p>${notice.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
  <div class="article-bottom"><a href="/avisos" data-nav>${icon("arrow-right", 16)} Voltar aos comunicados</a></div></article>`;
}

function about() {
  return `<section class="inner-hero container"><span class="eyebrow">QUEM SOMOS</span><h1>Conectando ideias.<br><span class="gradient-text">Simplificando acessos.</span></h1><p>O NexoHub nasceu para reunir diferentes projetos em um lugar organizado, onde cada novidade fica fácil de encontrar.</p></section>
  <section class="container about-grid">
    <article class="about-feature"><span class="about-icon">${icon("globe", 26)}</span><h2>Uma central para tudo</h2><p>Avisos, detalhes e atualizações dos nossos projetos reunidos em um único portal.</p></article>
    <article class="about-feature"><span class="about-icon">${icon("layers", 26)}</span><h2>Cada projeto, sua identidade</h2><p>Uma página individual para conhecer melhor cada bot e acompanhar sua evolução.</p></article>
    <article class="about-feature"><span class="about-icon">${icon("users", 26)}</span><h2>Construído com sugestões</h2><p>Ideias e pedidos dos usuários ajudam a orientar o que vamos analisar e melhorar.</p></article>
  </section>
  <section class="container about-bottom"><div class="suggest-banner"><div class="suggest-light"></div><div class="suggest-icon">${icon("mail", 25)}</div><div class="suggest-copy"><span class="eyebrow">ENTRE EM CONTATO</span><h2>Sua mensagem é bem-vinda.</h2><p>Envie dúvidas, sugestões e novas ideias para os nossos projetos.</p></div>${link(encodeMailto("Contato NexoHub"), "Enviar mensagem", "button button-light", "arrow-up-right")}</div></section>`;
}

function notFound() {
  return `<section class="container not-found"><span class="big-404">404</span><span class="eyebrow">OPS, NÃO ENCONTRAMOS</span><h1>Essa página não está por aqui.</h1><p>O endereço pode ter mudado, ou a página ainda não existe.</p>${link("/", "Voltar ao início")}</section>`;
}

function updateSaveVidPlatformFilters() {
  const input = document.getElementById("sv-search-input");
  if (!input) return;
  const query = input.value.trim().toLocaleLowerCase("pt-BR");
  const active = document.querySelector("[data-sv-filter].selected")?.getAttribute("data-sv-filter") || "Todas";
  const cards = [...document.querySelectorAll("[data-sv-platform]")];
  let visible = 0;
  cards.forEach(card => {
    const matchesCategory = active === "Todas" || card.dataset.category === active;
    const matchesText = !query || card.textContent.toLocaleLowerCase("pt-BR").includes(query);
    card.hidden = !(matchesCategory && matchesText);
    if (!card.hidden) visible++;
  });
  const count = document.getElementById("sv-count");
  if (count) count.textContent = visible + (visible === 1 ? " plataforma encontrada" : " plataformas encontradas");
  const empty = document.getElementById("sv-no-results");
  if (empty) empty.hidden = visible !== 0;
}

function render() {
  const path = decodeURI(window.location.pathname).replace(/\/+$/, "") || "/";
  let html = "";
  let title = "NexoHub — Central de bots e novidades";
  if (path === "/") html = home();
  else if (path === "/bots") { html = botList(); title = "Nossos bots | NexoHub"; }
  else if (path.startsWith("/bots/")) {
    const bot = bots.find((item) => "/bots/" + item.slug === path);
    html = bot ? (bot.slug === "savevid" ? renderSaveVidLanding(bot, {escapeHtml,icon,link,safeUrl}) : botDetail(bot)) : notFound();
    title = bot ? bot.name + " | NexoHub" : "Página não encontrada | NexoHub";
  } else if (path === "/avisos") { html = noticesPage(); title = "Avisos e novidades | NexoHub"; }
  else if (path.startsWith("/avisos/")) {
    const notice = notices.find((item) => "/avisos/" + item.slug === path);
    html = notice ? noticeDetail(notice) : notFound();
    title = notice ? notice.title + " | NexoHub" : "Página não encontrada | NexoHub";
  } else if (path === "/sobre") { html = about(); title = "Sobre o NexoHub"; }
  else if (path === "/ajuda") { html = extras.help(); title = "Central de ajuda | NexoHub"; }
  else if (path === "/atualizacoes") { html = extras.updates(); title = "Atualizações | NexoHub"; }
  else if (path === "/status") { html = extras.status(); title = "Status dos serviços | NexoHub"; }
  else if (path === "/planejamento") { html = extras.planning(); title = "Planejamento | NexoHub"; }
  else if (path === "/contato") { html = extras.contact(); title = "Contato | NexoHub"; }
  else if (path === "/pesquisar") { html = extras.search(); title = "Pesquisar | NexoHub"; }
  else if (path === "/privacidade") { html = extras.policy("privacidade"); title = "Privacidade | NexoHub"; }
  else if (path === "/termos") { html = extras.policy("termos"); title = "Termos de uso | NexoHub"; }
  else { html = notFound(); title = "Página não encontrada | NexoHub"; }
  document.title = title;
  app.innerHTML = header() + '<main id="main">' + html + '</main>' + footer();
  if (path === "/bots") updateCatalog();
  if (path === "/pesquisar") extras.updateSearch();
  window.NexoTheme?.refreshControls?.();
}
function navigate(href) {
  const url = new URL(href, window.location.origin);
  if (url.pathname === window.location.pathname && url.search === window.location.search) return;
  history.pushState({}, "", url.pathname + url.search + url.hash);
  state.category = "Todos";
  state.search = "";
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}
document.addEventListener("click", (event) => {
  const menu = event.target.closest("#menu-toggle");
  if (menu) {
    const nav = document.querySelector("#site-nav");
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    menu.innerHTML = icon(expanded ? "menu" : "close", 23);
    nav.classList.toggle("open", !expanded);
    return;
  }
  const slide = event.target.closest("[data-sv-slide]");
  if (slide) {
    const carousel = document.getElementById("sv-media-carousel");
    if (carousel) {
      const card = carousel.querySelector(".sv-media-card");
      const amount = card ? card.getBoundingClientRect().width + 18 : 300;
      carousel.scrollBy({left:(slide.dataset.svSlide==="prev"?-1:1)*amount,behavior:"smooth"});
    }
    return;
  }
  const categoryJump = event.target.closest("[data-category-jump]");
  if (categoryJump) {
    document.querySelectorAll("[data-sv-filter]").forEach(button => {
      const selected = button.dataset.svFilter === categoryJump.dataset.categoryJump;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateSaveVidPlatformFilters();
    return;
  }
  const selectedBrand = event.target.closest("[data-sv-brand-focus]");
  if (selectedBrand) {
    event.preventDefault();
    const name = selectedBrand.getAttribute("data-sv-brand-focus");
    const search = document.getElementById("sv-search-input");
    if (search) {
      search.value = name || "";
      document.querySelectorAll("[data-sv-filter]").forEach(button => {
        const selected = button.getAttribute("data-sv-filter") === "Todas";
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      updateSaveVidPlatformFilters();
      const target = [...document.querySelectorAll("[data-sv-platform]")].find(card => card.getAttribute("data-platform-name") === name);
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block:"center"
      });
      target?.classList.add("sv-highlight");
      if (target) setTimeout(() => target.classList.remove("sv-highlight"), 2100);
    }
    return;
  }
  const svFilter = event.target.closest("[data-sv-filter]");
  if (svFilter) {
    document.querySelectorAll("[data-sv-filter]").forEach(button => {
      const selected = button === svFilter;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateSaveVidPlatformFilters();
    return;
  }
    const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.category = filter.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("active", button.getAttribute("data-filter") === state.category);
      button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === state.category));
    });
    updateCatalog();
    return;
  }
  const anchor = event.target.closest("a[data-nav]");
  if (anchor && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    navigate(anchor.getAttribute("href"));
  }
});
document.addEventListener("input", (event) => {
  if (event.target.id === "bot-search") {
    state.search = event.target.value;
    updateCatalog();
  }
  if (event.target.id === "sv-search-input") updateSaveVidPlatformFilters();
    if (event.target.id === "global-search") {
    const q = event.target.value.trim();
    history.replaceState({}, "", "/pesquisar" + (q ? "?q=" + encodeURIComponent(q) : ""));
    extras.updateSearch();
  }
});
window.addEventListener("popstate", () => {
  state.category = "Todos";
  state.search = "";
  render();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (location.pathname !== "/pesquisar") navigate("/pesquisar");
    document.getElementById("global-search")?.focus();
  }
});
/*
 * O D1 é a fonte oficial depois da importação inicial.
 * Até a ativação do CMS, os dados estáticos mantêm o portal funcionando.
 * Novidades publicadas no painel aparecem após o próximo carregamento.
 */
async function loadManagedContent() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch("/api/content", { cache: "no-store", signal: controller.signal });
    if (!response.ok) return;
    const content = await response.json();
    if (!content.active) return;
    for (const [target, key] of [
      [bots, "bots"], [notices, "notices"], [faqs, "faqs"], [releases, "releases"], [roadmap, "roadmap"]
    ]) {
      if (Array.isArray(content[key])) target.splice(0, target.length, ...content[key]);
    }
  } catch {
    // Cloudflare ou rede indisponível: a versão estática continua acessível.
  } finally {
    clearTimeout(timer);
  }
}
loadManagedContent().finally(render);
