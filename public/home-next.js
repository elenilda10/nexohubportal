/* Portal NexoHub — home de 2026. Mantém o conteúdo editável em data.js e o CMS. */
export function renderHomeNext({bots,getNotices,icon,link,sectionTitle,botCard,noticeCard,extras,escapeHtml,brandLogo,encodeMailto}) {
  const latest=getNotices().slice(0,3);
  const featured=bots.find(b=>b.slug==="savevid")||bots[0];
  const trusted=["Instagram","TikTok","YouTube e YouTube Music","Spotify","Pinterest"].filter(name=>featured?.platformDetails?.some(p=>p.name===name));
  return `<div class="nx-home">
  <section class="nx-hero" aria-labelledby="nx-hero-title">
    <div class="nx-hero-grid" aria-hidden="true"></div>
    <div class="container nx-hero-inner">
      <div class="nx-hero-content">
        <a class="nx-hero-chip" href="/sobre" data-nav><span class="nx-chip-orb"></span><span>Bem-vindo ao seu ponto de conexão</span>${icon("arrow-up-right",14)}</a>
        <h1 id="nx-hero-title">Ideias que viram<br><span>soluções de verdade.</span></h1>
        <p>Encontre nossos bots, descubra o que cada projeto faz e acompanhe tudo o que está chegando. Simples, organizado e sempre ao seu alcance.</p>
        <div class="nx-hero-actions">${link("/bots","Conhecer os projetos","button button-primary","arrow-up-right")}${link("/atualizacoes","Ver o que mudou","button button-outline","arrow-right")}</div>
        <div class="nx-proof"><div class="nx-proof-icons"><span>${icon("download",17)}</span><span>${icon("music",17)}</span><span>${icon("trophy",17)}</span></div><span>Downloads, música, futebol e novas ideias.</span></div>
      </div>
      <div class="nx-hero-product">
        <div class="nx-product-glow" aria-hidden="true"></div>
        <div class="nx-browser">
          <div class="nx-browser-bar"><div class="nx-dots"><i></i><i></i><i></i></div><span>${icon("shield",13)} nexohub.dev / projetos</span><span class="nx-bar-symbol">✳</span></div>
          <div class="nx-browser-main">
            <div class="nx-browser-heading"><div><span class="nx-label">SEU ESPAÇO DIGITAL</span><strong>Explore o ecossistema</strong><small>Selecione um projeto para saber mais</small></div><span class="nx-browser-badge">NEXOHUB</span></div>
            <div class="nx-browser-items">${bots.slice(0,3).map((bot,i)=>`<a href="/bots/${encodeURIComponent(bot.slug)}" data-nav class="nx-browser-item nx-browser-item-${i}"><span class="nx-browser-icon nx-spot-${escapeHtml(bot.accent)}">${icon(bot.icon,21)}</span><span class="nx-browser-item-copy"><strong>${escapeHtml(bot.name)}</strong><small>${escapeHtml(bot.category)}</small></span>${icon("arrow-up-right",17)}</a>`).join("")}</div>
            <a href="/bots" class="nx-browser-all" data-nav>Conheça todos os projetos ${icon("arrow-right",15)}</a>
          </div>
        </div>
        <div class="nx-float-tag nx-float-tag-top">${icon("sparkles",15)} Novidades em um só lugar</div>
        <div class="nx-float-tag nx-float-tag-bottom">${icon("layers",15)} Cada projeto, sua identidade</div>
      </div>
    </div>
    <div class="nx-hero-floor container"><span>01 — O PORTAL</span><span>Feito para você descobrir mais</span><a href="#nx-projetos" aria-label="Rolar até os projetos">${icon("arrow-right",17)}</a></div>
  </section>
  <section class="nx-value-strip" aria-label="O que você encontra no NexoHub">
    <div class="container nx-value-inner">
      <div><span class="nx-value-index">01</span>${icon("layers",20)}<span>Projetos reunidos</span></div>
      <div><span class="nx-value-index">02</span>${icon("bell",20)}<span>Informações atualizadas</span></div>
      <div><span class="nx-value-index">03</span>${icon("shield",20)}<span>Links e orientações oficiais</span></div>
    </div>
  </section>
  <section class="section nx-projects" id="nx-projetos"><div class="container">
    ${sectionTitle("02 / ECOSSISTEMA","Um projeto para cada necessidade.","Bots que ajudam com mídias, entretenimento e muito mais. Explore o que está disponível e saiba como utilizar cada serviço.","/bots","Explorar o catálogo")}
    <div class="bot-grid nx-bots">${bots.map(botCard).join("")}</div>
  </div></section>
  <section class="nx-feature"><div class="container nx-feature-grid">
    <div class="nx-feature-visual">
      <div class="nx-feature-orb" aria-hidden="true"></div>
      <div class="nx-feature-preview"><div class="nx-feature-preview-top"><span>${icon("download",18)} SAVE VID DL</span><span>${icon("arrow-up-right",17)}</span></div>
        <img loading="lazy" src="/assets/savevid-workspace.svg" alt="Ilustração do espaço de mídias e arquivos do Save Vid DL" />
        <div class="nx-preview-caption"><span>${icon("layers",16)} Redes e mídia</span><span>${icon("music",16)} Música e áudio</span></div>
      </div>
    </div>
    <div class="nx-feature-copy">
      <span class="eyebrow">03 / DESTAQUE</span>
      <h2>Seu conteúdo.<br><span>Mais possibilidades.</span></h2>
      <p>Conheça o Save Vid DL: um bot pensado para reunir recursos de mídia e arquivos diretamente no Telegram, respeitando as possibilidades de cada plataforma.</p>
      <div class="nx-platform-list">${trusted.map(name=>`<span title="${escapeHtml(name)}">${brandLogo(name,{size:17,decorative:true})}${escapeHtml(name)}</span>`).join("")}</div>
      ${link("/bots/savevid","Explorar o Save Vid DL","button button-primary","arrow-up-right")}
    </div>
  </div></section>
  <section class="section nx-news"><div class="container">
    ${sectionTitle("04 / ACOMPANHE","O que está acontecendo.","Acompanhe comunicados, novas funções e avisos relevantes dos nossos projetos.","/avisos","Ver todos os avisos")}
    <div class="notices-grid nx-news-grid">${latest.map(noticeCard).join("")}</div>
  </div></section>
  ${extras.homeExtras()}
  <section class="nx-end-cta"><div class="container"><div class="nx-end-cta-inner">
    <div><span class="eyebrow">SUA IDEIA PODE SER A PRÓXIMA</span><h2>O que podemos construir a seguir?</h2><p>Tem uma plataforma ou função para sugerir? Conte para a gente. Avaliamos cada ideia com atenção à viabilidade técnica.</p></div>
    ${link(encodeMailto("Sugestão para o NexoHub"),"Enviar uma sugestão","button button-light","arrow-up-right")}
  </div></div></section>
  </div>`;
}
