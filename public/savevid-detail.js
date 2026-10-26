import {brandLogo,getPlatformBrand} from "./brand-icons.js";
/**
 * Save Vid DL — catálogo de plataformas extraído do repositório Bot-Download.
 * Status informa presença/documentação no código, NÃO disponibilidade online.
 */
const GROUPS = ["Todas", "Redes sociais", "Música", "Arquivos", "Outros"];
const STATUS = {
  principal: {label:"Suporte principal",cls:"main"},
  integrado: {label:"Integração no código",cls:"integrated"},
  experimental: {label:"Em testes",cls:"experimental"},
  restrito: {label:"18+ · Conteúdo adulto",cls:"restricted"}
};
const GROUP_ICONS = {"Redes sociais":"globe","Música":"music","Arquivos":"download","Outros":"info"};
export function renderSaveVidDetails(bot, {escapeHtml:e,icon,link}) {
  const items = Array.isArray(bot.platformDetails) ? bot.platformDetails : [];
  const total = items.length;
  if (!total) return "";
  const counts = {principal:0,integrado:0,experimental:0,restrito:0};
  for (const item of items) if (counts[item.status] !== undefined) counts[item.status]++;
  const cards = items.map((item,index)=>{
    const badge=STATUS[item.status]||{label:"Em avaliação",cls:"experimental"};
    const cat = item.category || "Outros";
    const brand = getPlatformBrand(item.name);
    const fallback = e(String(item.name||"?").trim().charAt(0).toUpperCase());
    return `<article class="sv-platform-card" data-sv-platform data-platform-name="${e(item.name)}" data-category="${e(cat)}" data-status="${e(item.status)}" style="--sv-brand-accent:${brand?brand.color:"#7C86B8"}">
      <div class="sv-platform-top"><div class="sv-platform-symbol ${brand?"sv-has-brand":"sv-monogram"}">${brand?brandLogo(item.name,{size:32,decorative:true}):fallback}</div><span class="sv-platform-badge sv-badge-${badge.cls}">${e(badge.label)}</span></div>
      <h4>${e(item.name)}</h4>
      <p class="sv-formats">${e(item.formats)}</p>
      <details class="sv-platform-disclosure"><summary>Condições e limitações</summary><p class="sv-platform-note">${e(item.note)}</p></details>
    </article>`;
  }).join("");
  return `
  <section class="content-panel sv-overview" aria-labelledby="sv-overview-title">
    <span class="eyebrow">GUIA DE COMPATIBILIDADE</span>
    <h2 id="sv-overview-title">Plataformas do Save Vid DL</h2>
    <p>O bot reconhece links de redes sociais, serviços de música e sites de arquivos. A tabela abaixo distingue o suporte principal das integrações adicionais e dos recursos em avaliação.</p>
    <div class="sv-numbers">
      <div><strong>${counts.principal}</strong><span>Plataformas principais</span></div>
      <div><strong>${counts.integrado}</strong><span>Integrações adicionais</span></div>
      <div><strong>${counts.experimental}</strong><span>Serviços em testes</span></div>
    </div>
    <div class="sv-caution">${icon("info",19)}<span>Informações conferidas no código-fonte, não em downloads realizados agora. Conteúdos privados, bloqueios, limites de tamanho, cookies e mudanças nas plataformas podem impedir o funcionamento.</span></div>
  </section>
  <section class="sv-section" aria-labelledby="sv-catalog-title">
    <div class="sv-section-head"><div><span class="eyebrow">PLATAFORMAS E FORMATOS</span><h2 id="sv-catalog-title">Onde os links são reconhecidos</h2></div><span class="sv-count" id="sv-count" aria-live="polite">${total} integrações listadas</span></div>
    <label class="sv-search" for="sv-search-input">${icon("search",20)}<input type="search" id="sv-search-input" autocomplete="off" placeholder="Buscar Instagram, MP3, arquivos..." aria-label="Pesquisar plataformas do Save Vid" /></label>
    <div class="sv-filters" role="group" aria-label="Filtrar plataformas">${GROUPS.map((group,i)=>`<button type="button" class="sv-filter${i===0?" selected":""}" data-sv-filter="${e(group)}" aria-pressed="${i===0}">${e(group)}</button>`).join("")}</div>
    <div class="sv-platform-grid" id="sv-platform-grid">${cards}</div>
    <div class="sv-no-results" id="sv-no-results" hidden>Nenhuma plataforma corresponde a essa pesquisa.</div>
    <p class="sv-source">Fonte: <a href="${e(bot.sourceRepo||"https://github.com/elenilda10/Bot-Download")}" target="_blank" rel="noopener noreferrer">repositório Bot-Download ${icon("arrow-up-right",14)}</a>. Lista descritiva, sem monitoramento automático de suporte.</p>
  </section>
  <section class="content-panel sv-how-to" id="como-funciona" aria-labelledby="sv-steps-title">
    <span class="eyebrow">COMECE A USAR</span><h2 id="sv-steps-title">Como funciona o download?</h2>
    <div class="sv-step-grid">
      <div><span class="sv-step-number">01</span><strong>Copie o link</strong><p>Na plataforma de origem, use a opção Compartilhar ou Copiar link de um conteúdo acessível.</p></div>
      <div><span class="sv-step-number">02</span><strong>Envie ao bot</strong><p>Cole o link no chat do Save Vid DL. Links múltiplos podem ser enviados em lote, até o limite configurado.</p></div>
      <div><span class="sv-step-number">03</span><strong>Receba a mídia</strong><p>Quando a extração funcionar, o bot envia vídeo, foto, áudio ou documento, conforme o serviço e as opções disponíveis.</p></div>
    </div>
  </section>
  <section class="content-panel sv-faq" aria-labelledby="sv-faq-title">
    <span class="eyebrow">DÚVIDAS FREQUENTES</span><h2 id="sv-faq-title">O que vale saber</h2>
    <details><summary>É possível enviar vários links?</summary><p>Sim. O fluxo de lote documentado aceita até seis links compatíveis na mesma mensagem, processados conforme os limites do bot.</p></details>
    <details><summary>Todos os vídeos e álbuns funcionam?</summary><p>Não. O resultado depende da plataforma, do formato, de permissões de acesso e de eventuais bloqueios. Facebook, por exemplo, possui tratamento específico para posts e álbuns.</p></details>
    <details><summary>O bot baixa diretamente a música do Spotify?</summary><p>O serviço identifica a faixa e procura uma correspondência de áudio compatível. Isso não significa remover a proteção de conteúdo do Spotify nem garantir todas as músicas.</p></details>
    <details><summary>MEGA e Google Drive já estão estáveis?</summary><p>Existem handlers no repositório, mas não há validação de funcionamento em produção nesta revisão. Eles permanecem sinalizados como serviços em testes.</p></details>
    <details><summary>Como pedir uma nova plataforma?</summary><p>Envie sua sugestão pelo canal de contato do NexoHub, com o endereço da plataforma e o tipo de mídia desejado. A inclusão depende de análise técnica.</p></details>
  </section>
  <section class="sv-contact-strip"><div>${icon("sparkles",22)}<div><strong>Sentiu falta de alguma plataforma?</strong><p>Envie uma sugestão. Nossa equipe poderá avaliar a viabilidade técnica.</p></div></div>
    ${link("/contato","Sugerir plataforma","button button-primary","arrow-up-right")}</section>
  `;
}
