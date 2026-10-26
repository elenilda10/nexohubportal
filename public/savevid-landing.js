import {renderSaveVidDetails} from "./savevid-detail.js";
import {brandLogo,getPlatformBrand} from "./brand-icons.js";

/** Landing page ilustrativa, não representa capturas reais do Telegram. */
export function renderSaveVidLanding(bot, {escapeHtml:e,icon,link, safeUrl}) {
  const official = safeUrl(bot.telegram);
  const currentPlatforms = Array.isArray(bot.platformDetails) ? bot.platformDetails : [];
  const countCategory = name => currentPlatforms.filter(item => item.category === name).length;
  const categories = [
    {title:"Redes sociais",tag:"Fotos e vídeos",hint:"Reels, Shorts, posts e carrosséis compatíveis",symbol:"globe",count:countCategory("Redes sociais")},
    {title:"Música e áudio",tag:"MP3 e faixas",hint:"Áudio e identificação de músicas, quando disponíveis",symbol:"music",count:countCategory("Música")},
    {title:"Arquivos",tag:"Documentos",hint:"Links públicos de hospedagem de arquivos",symbol:"download",count:countCategory("Arquivos")}
  ];
  const media = [
    {name:"Vídeos e Shorts",tag:"VÍDEO",image:"/assets/savevid-video.svg",alt:"Ilustração abstrata de vídeo com botão de reprodução",text:"Baixe vídeos de posts e links compatíveis, sujeito às restrições de cada serviço."},
    {name:"Áudios e músicas",tag:"ÁUDIO",image:"/assets/savevid-audio.svg",alt:"Ilustração de uma onda sonora colorida",text:"Extração de MP3, faixas e identificação musical quando o fluxo permitir."},
    {name:"Fotos e álbuns",tag:"IMAGENS",image:"/assets/savevid-album.svg",alt:"Ilustração estilizada de dois cartões com fotos",text:"Fotos, carrosséis e álbuns de publicações com acesso permitido."},
    {name:"Documentos e arquivos",tag:"ARQUIVOS",image:"/assets/savevid-files.svg",alt:"Ilustração de documentos e seta de transferência",text:"Links de arquivos públicos em serviços específicos, sujeitos a tamanho, cotas e disponibilidade."}
  ];
  const featureList = [
    {symbol:"layers",name:"Até seis links por lote",text:"Envie vários links de serviços compatíveis na mesma mensagem, respeitando os limites do bot."},
    {symbol:"music",name:"MP3 e conversões",text:"Extraia áudio de mídias quando o formato e a plataforma permitirem."},
    {symbol:"zap",name:"Compartilhamento inline",text:"Recursos inline para serviços e formatos habilitados no Telegram."},
    {symbol:"shield",name:"Qualidade e opções",text:"Ajuste preferências de mídia, legendas e formato de envio nas configurações."},
    {symbol:"clock",name:"Cache de arquivos",text:"Mídias já enviadas podem ser reutilizadas pelo bot para evitar downloads repetidos."},
    {symbol:"sparkles",name:"Em evolução",text:"Novas integrações são avaliadas conforme a disponibilidade e os limites de cada site."}
  ];
  const mini = ["Instagram","TikTok","YouTube e YouTube Music","Facebook","Pinterest","Spotify","Threads","Reddit","SoundCloud","Deezer"]
    .filter(name=>currentPlatforms.some(platform=>platform.name===name) && getPlatformBrand(name));
  const logoPill = (name, duplicate=false) => `<a class="sv-logo-name" href="#plataformas" ${duplicate?'tabindex="-1" aria-hidden="true"':''} data-sv-brand-focus="${e(name)}" ${!duplicate?'aria-label="Ver detalhes de '+e(name)+'"':''}>
    <span class="sv-logo-icon">${brandLogo(name,{size:23,decorative:true})}</span><span>${e(name)}</span></a>`;
  const categoryLogos = category => ({
    "Redes sociais":["Instagram","TikTok","YouTube e YouTube Music","Pinterest"],
    "Música":["Spotify","SoundCloud","Deezer"],
    "Arquivos":["MediaFire","MEGA","Google Drive"]
  }[category]||[]).filter(name=>currentPlatforms.some(p=>p.name===name)&&getPlatformBrand(name));
  const floating = [{name:"Instagram",style:"instagram"},{name:"TikTok",style:"tiktok"},
    {name:"YouTube e YouTube Music",style:"youtube"},{name:"Spotify",style:"spotify"}]
    .filter(item=>currentPlatforms.some(p=>p.name===item.name)&&getPlatformBrand(item.name));
  return `
  <div class="sv-landing">
    <section class="sv-premium-hero">
      <div class="sv-hero-ambient sv-ambient-one" aria-hidden="true"></div>
      <div class="sv-hero-ambient sv-ambient-two" aria-hidden="true"></div>
      <div class="container sv-hero-grid">
        <div class="sv-hero-copy">
          <div class="breadcrumbs sv-breadcrumbs"><a data-nav href="/">Início</a>${icon("chevron-right",14)}<a data-nav href="/bots">Projetos</a>${icon("chevron-right",14)}<span>Save Vid DL</span></div>
          <span class="sv-overline"><span class="sv-dot"></span> SAVE VID DL · CENTRAL DE DOWNLOADS</span>
          <h1>Seu conteúdo.<br><span class="gradient-text">Sua liberdade</span> de compartilhar.</h1>
          <p>Um só bot para receber links de vídeos, fotos, músicas e arquivos compatíveis — direto no Telegram. Conheça as plataformas, recursos e possibilidades.</p>
          <div class="sv-hero-actions">
            ${official ? `<a class="button button-primary sv-hero-primary" href="${e(official)}" target="_blank" rel="noopener noreferrer">Abrir no Telegram ${icon("arrow-up-right",19)}</a>` :
            `<a class="button button-primary sv-hero-primary" href="#plataformas">Explorar plataformas ${icon("arrow-right",19)}</a>`}
            <a class="button button-outline sv-hero-secondary" href="#como-funciona">Como funciona ${icon("arrow-right",18)}</a>
          </div>
          <div class="sv-hero-badges">
            <span>${icon("check",16)} Vídeos e imagens</span>
            <span>${icon("check",16)} Áudio e MP3</span>
            <span>${icon("check",16)} Arquivos públicos</span>
          </div>
          ${official?"":'<p class="sv-no-bot-link">O link oficial do bot será publicado após confirmação.</p>'}
        </div>
        <div class="sv-hero-art">
          <div class="sv-hero-orbit" aria-hidden="true"></div>
          <img src="/assets/savevid-workspace.svg" alt="Prévia ilustrativa do Save Vid DL exibido na interface de mensagens de um celular" width="860" height="830" fetchpriority="high" decoding="async" />
          <div class="sv-brand-orbit" aria-label="Plataformas no catálogo do Save Vid">
            ${floating.map(item=>`<a class="sv-floating-logo sv-float-${item.style}" href="#plataformas" data-sv-brand-focus="${e(item.name)}" aria-label="Consultar compatibilidade de ${e(item.name)}">
              ${brandLogo(item.name,{size:31,decorative:true})}</a>`).join("")}
          </div>
          <span class="sv-illustration-caption">Ilustração conceitual, não uma captura real do bot</span>
        </div>
      </div>
    </section>

    <section class="sv-logo-band" aria-label="Plataformas identificadas no código-fonte do Save Vid">
      <div class="container sv-logo-inner"><span>EXPLORE AS PLATAFORMAS <small>Selecione um ícone</small></span>
        <div class="sv-logo-marquee" aria-label="Lista navegável de plataformas">
          <div class="sv-marquee-track">
            <div class="sv-marquee-group">${mini.map(name=>logoPill(name)).join("")}</div>
            <div class="sv-marquee-group" aria-hidden="true">${mini.map(name=>logoPill(name,true)).join("")}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="sv-premium-section sv-features-section">
      <div class="container">
        <div class="sv-heading-wrap"><span class="eyebrow">TUDO NUM SÓ LUGAR</span>
          <h2>Mais possibilidades.<br><span class="gradient-text">Menos complicação.</span></h2>
          <p>Uma experiência para quem quer enviar um link e receber o tipo de mídia disponível, sem precisar alternar entre vários sites.</p>
        </div>
        <div class="sv-feature-bento">
          <div class="sv-bento-spotlight">
            <div><span class="sv-feature-kicker">UM BOT, MÚLTIPLOS FORMATOS</span>
            <h3>Uma central de mídia no seu Telegram.</h3>
            <p>Vídeo, áudio, imagem e documentos em uma experiência organizada. O resultado depende de cada plataforma.</p></div>
            <img src="/assets/savevid-album.svg" alt="Ilustração de álbuns de fotos" width="660" height="430" loading="lazy" decoding="async"/>
          </div>
          <div class="sv-feature-grid">
            ${featureList.map(item=>`<article class="sv-feature-mini"><span class="sv-feature-icon">${icon(item.symbol,22)}</span><h3>${e(item.name)}</h3><p>${e(item.text)}</p></article>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="sv-premium-section sv-formats-section" id="midias">
      <div class="container">
        <div class="sv-section-header">
          <div><span class="eyebrow">O QUE VOCÊ PODE ENVIAR</span><h2>Formatos que fazem<br>a diferença.</h2><p>Da reprodução de vídeos às imagens em sequência, conheça as experiências oferecidas pelos fluxos do bot.</p></div>
          <div class="sv-carousel-controls"><button type="button" aria-label="Ver formatos anteriores" data-sv-slide="prev">${icon("arrow-right",21)}</button><button type="button" aria-label="Ver próximos formatos" data-sv-slide="next">${icon("arrow-right",21)}</button></div>
        </div>
        <div class="sv-media-carousel" id="sv-media-carousel" role="region" aria-label="Tipos de mídia compatíveis" tabindex="0">
          ${media.map(item=>`<article class="sv-media-card">
            <div class="sv-media-image"><img src="${item.image}" alt="${e(item.alt)}" width="680" height="410" loading="lazy" decoding="async"/><span>${e(item.tag)}</span></div>
            <div class="sv-media-content"><h3>${e(item.name)}</h3><p>${e(item.text)}</p></div>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="sv-premium-section sv-category-section">
      <div class="container">
        <div class="sv-heading-wrap"><span class="eyebrow">COMPATIBILIDADE</span><h2>Suas plataformas<br><span class="gradient-text">em um só lugar.</span></h2><p>Explore as categorias e veja abaixo quais integrações são principais, adicionais ou experimentais.</p></div>
        <div class="sv-category-cards">${categories.map(x=>`<a href="#plataformas" class="sv-category-card" data-category-jump="${e(x.title === "Música e áudio"?"Música":x.title)}">
          <span class="sv-category-icon">${icon(x.symbol,29)}</span><strong>${e(x.title)}</strong><span>${e(x.hint)}</span>
          <span class="sv-category-art" aria-hidden="true">${categoryLogos(x.title==="Música e áudio"?"Música":x.title).map(name=>`<span class="sv-category-brand">${brandLogo(name,{size:30,decorative:true})}</span>`).join("")}</span>
          <small>${x.count} integrações no código</small>${icon("arrow-up-right",20)}
        </a>`).join("")}</div>
      </div>
    </section>

    <div class="sv-catalog-container container" id="plataformas">${renderSaveVidDetails(bot,{escapeHtml:e,icon,link})}</div>
    <section class="sv-final-navigation container"><div class="sv-final-visual" aria-hidden="true">
      ${["Instagram","YouTube e YouTube Music","Spotify"].filter(name=>currentPlatforms.some(item=>item.name===name)).map(name=>`<span>${brandLogo(name,{size:30,decorative:true})}</span>`).join("")}
      </div><div><span class="eyebrow">NEXOHUB</span><h2>Explore nossos outros projetos.</h2><p>Veja mais bots, atualizações e novidades da central.</p></div>
      ${link("/bots","Voltar ao catálogo","button button-outline","arrow-right")}</section>
    <p class="sv-brand-disclaimer container">Logotipos exibidos somente para identificar serviços citados no catálogo. O Save Vid DL e o NexoHub não representam parceria ou endosso dessas marcas.</p>
  </div>`;
}
