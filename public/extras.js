import { bots, notices, faqs, releases, serviceStatus, roadmap, config } from "./data.js";

/**
 * Páginas informativas complementares do portal.
 * Não há coleta de dados por formulário nem monitoramento automático nesta versão.
 */
export function createExtraPages({ icon, escapeHtml: e, link, dateLabel, encodeMailto }) {
  const intro = (kicker, title, subtitle) =>
    '<section class="inner-hero container enhanced-hero"><span class="eyebrow">' + e(kicker) +
    '</span><h1>' + title + '</h1><p>' + e(subtitle) + '</p></section>';
  const faqItem = f => '<details class="faq-item"><summary><span>' + e(f.question) +
    '</span><span aria-hidden="true" class="faq-plus">+</span></summary><p>' + e(f.answer) + '</p></details>';
  const quick = (to, name, subtitle, glyph) => '<a data-nav href="' + to + '" class="quick-link"><span class="quick-icon">' +
    icon(glyph, 24) + '</span><span><strong>' + e(name) + '</strong><small>' + e(subtitle) + '</small></span>' +
    icon("arrow-up-right", 19) + '</a>';

  function homeExtras() {
    return '<section class="section enhanced-home"><div class="container">' +
      '<div class="section-title"><div><span class="eyebrow">CENTRAL COMPLETA</span><h2>Mais do que um catálogo.</h2>' +
      '<p>Encontre respostas, acompanhe novidades e veja os próximos passos.</p></div></div>' +
      '<div class="quick-grid">' +
      quick("/ajuda", "Central de ajuda", "Dúvidas e orientações sobre os bots.", "info") +
      quick("/atualizacoes", "Atualizações", "Histórico de novidades do portal.", "sparkles") +
      quick("/status", "Status dos serviços", "Situação do monitoramento dos bots.", "shield") +
      quick("/planejamento", "Em planejamento", "Recursos e ideias em avaliação.", "layers") +
      '</div></div></section>' +
      '<section class="section enhanced-faq-home"><div class="container"><div class="section-title"><div>' +
      '<span class="eyebrow">CENTRAL DE AJUDA</span><h2>Respostas às principais dúvidas.</h2><p>Encontre informações sem complicações.</p></div>' +
      link("/ajuda","Ver todas","quiet-link","arrow-up-right") + '</div>' +
      '<div class="faq-list">' + faqs.slice(0,4).map(faqItem).join("") + '</div></div></section>';
  }
  function help() {
    const cats = [...new Set(faqs.map(f=>f.category))];
    return intro("CENTRAL DE AJUDA", 'Dúvidas? <span class="gradient-text">A gente ajuda.</span>',
      "Respostas sobre projetos, plataformas suportadas, sugestões e privacidade.") +
      '<section class="container enhanced-content">' +
      '<div class="help-banner"><div>' + icon("info", 22) +
      '<span>Não encontrou a resposta? Entre em contato com a equipe.</span></div>' +
      link("/contato","Fale conosco","button button-outline","arrow-up-right") + '</div>' +
      cats.map(cat => '<section class="faq-category"><h2>' + e(cat) + '</h2><div class="faq-list">' +
        faqs.filter(f=>f.category===cat).map(faqItem).join("") + '</div></section>').join("") +
      '</section>';
  }
  function updates() {
    return intro("HISTÓRICO DE ATUALIZAÇÕES", 'Acompanhe nossa <span class="gradient-text">evolução.</span>',
      "Novos recursos e mudanças do portal, organizados por versão.") +
      '<section class="container enhanced-content"><div class="release-list">' +
      [...releases].sort((a,b)=>b.date.localeCompare(a.date)||b.version.localeCompare(a.version)).map(x=>
        '<article class="release-entry"><div class="release-meta"><span class="version-badge">v' + e(x.version) +
        '</span><span class="notice-tag">' + e(x.type) + '</span><time datetime="' + e(x.date) + '">' +
        dateLabel(x.date) + '</time></div><h2>' + e(x.title) + '</h2><p>' + e(x.summary) + '</p>' +
        '<ul class="release-changes">' + x.changes.map(c=>'<li>' + icon("check", 17) + e(c) + '</li>').join("") +
        '</ul></article>').join("") + '</div></section>';
  }
  function status() {
    return intro("STATUS DOS PROJETOS", 'Mais <span class="gradient-text">transparência.</span>',
      "Uma visão clara do monitoramento de disponibilidade dos projetos.") +
      '<section class="container enhanced-content"><div class="status-disclaimer">' + icon("info", 24) +
      '<div><strong>Monitoramento em tempo real ainda não disponível</strong>' +
      '<p>Os indicadores abaixo não verificam se um bot está funcionando. Não afirmamos que um serviço está online ou offline sem medição real.</p></div></div>' +
      '<div class="status-grid">' + serviceStatus.map(s=>{
        const bot=bots.find(b=>b.slug===s.botSlug);
        return bot ? '<article class="status-card"><div class="status-card-head">' + icon(bot.icon, 27) +
        '<span class="status-pending">Não monitorado</span></div><h2>' + e(bot.name) + '</h2><p>' + e(s.note) +
        '</p>' + link("/bots/"+encodeURIComponent(bot.slug),"Informações do projeto","text-link") + '</article>' : "";
      }).join("") + '</div><div class="status-help"><div><h2>Algum bot está com problemas?</h2>' +
      '<p>Confira os avisos ou envie um relato com o nome do bot e o que aconteceu.</p></div>' +
      link("/avisos","Ver avisos","button button-outline") +
      link("/contato","Relatar problema","button button-primary","arrow-up-right") + '</div></section>';
  }
  function planning() {
    return intro("EM ORGANIZAÇÃO", 'O que vem <span class="gradient-text">por aí?</span>',
      "Itens em avaliação e preparação, sem compromisso de prazo ou lançamento.") +
      '<section class="container enhanced-content"><div class="roadmap-grid">' +
      roadmap.map(x=>'<article class="roadmap-card"><div class="roadmap-meta"><span class="notice-tag">' +
        e(x.category) + '</span><span>' + e(x.stage) + '</span></div><h2>' +
        e(x.title) + '</h2><p>' + e(x.description) + '</p></article>').join("") +
      '</div><div class="roadmap-bottom"><h2>Tem uma ideia para o futuro?</h2><p>Envie sugestões para avaliarmos.</p>' +
      link("/contato","Enviar uma sugestão","button button-primary") + '</div></section>';
  }
  function contact() {
    const subjects=[
      ["Sugestão de plataforma","Indique plataformas e serviços que gostaria de ver no Save Vid."],
      ["Problema ou instabilidade","Conte qual bot apresentou problema e o que aconteceu."],
      ["Dúvida sobre um projeto","Peça orientações e tire dúvidas sobre os bots."],
      ["Parcerias e outros assuntos","Entre em contato sobre o NexoHub e outros projetos."]
    ];
    return intro("CONTATO OFICIAL", 'Sua mensagem <span class="gradient-text">importa.</span>',
      "Escolha o assunto e abra seu aplicativo de e-mail com a mensagem pronta para escrever.") +
      '<section class="container enhanced-content"><div class="contact-main"><span>' + icon("mail",29) +
      '</span><div><h2>' + e(config.contactEmail) + '</h2>' +
      '<p>Usamos o e-mail para receber sugestões, dúvidas e relatos de problemas.</p></div>' +
      '<a class="button button-outline" href="' + encodeMailto("Contato NexoHub") +
      '">Enviar e-mail ' + icon("arrow-up-right",18) + '</a></div>' +
      '<div class="topics-grid">' + subjects.map(x=>'<a class="topic-card" href="' +
        encodeMailto("NexoHub — " + x[0]) + '"><span>' + icon("arrow-up-right", 18) +
        '</span><h2>' + e(x[0]) + '</h2><p>' + e(x[1]) + '</p></a>').join("") + '</div>' +
      '<p class="contact-footnote">O NexoHub não envia dados automaticamente nesta página: a mensagem só sai se você confirmar o envio no aplicativo de e-mail. Sugestões são avaliadas conforme viabilidade e regras aplicáveis.</p></section>';
  }
  function searchMatches(term){
    const q=term.toLocaleLowerCase("pt-BR").trim();
    if (!q) return [];
    const index=[
      ...bots.map(x=>({title:x.name,tag:"Bot",href:"/bots/"+x.slug,desc:x.short,text:[x.name,x.short,x.category,x.description,...x.features,...x.platforms,...(x.platformDetails||[]).flatMap(p=>[p.name,p.category,p.formats,p.note])].join(" ")})),
      ...notices.map(x=>({title:x.title,tag:"Aviso",href:"/avisos/"+x.slug,desc:x.summary,text:[x.title,x.summary,x.category,...x.paragraphs].join(" ")})),
      ...faqs.map(x=>({title:x.question,tag:"Ajuda",href:"/ajuda",desc:x.answer,text:[x.question,x.answer,x.category].join(" ")})),
      ...releases.map(x=>({title:x.title,tag:"Atualização",href:"/atualizacoes",desc:x.summary,text:[x.title,x.summary,x.version,...x.changes].join(" ")}))
    ];
    return index.filter(x=>x.text.toLocaleLowerCase("pt-BR").includes(q));
  }
  function search() {
    const q=new URLSearchParams(location.search).get("q")||"";
    return intro("BUSCA NO PORTAL", 'Encontre tudo no <span class="gradient-text">NexoHub.</span>',
      "Busque bots, funcionalidades, avisos, novidades e perguntas frequentes.") +
      '<section class="container enhanced-content"><label class="search-global-label">' + icon("search",23) +
      '<input id="global-search" type="search" autocomplete="off" value="' + e(q) +
      '" placeholder="Digite o que você procura..." aria-label="Pesquisar no portal"></label>' +
      '<p class="search-tip">Atalho: Ctrl + K ou ⌘ + K abre a pesquisa.</p>' +
      '<div id="global-results" role="status" aria-live="polite"></div></section>';
  }
  function updateSearch() {
    const input=document.getElementById("global-search"), node=document.getElementById("global-results");
    if(!input||!node)return;
    const q=input.value.trim(), items=searchMatches(q);
    if(!q){node.innerHTML='<div class="search-empty">' + icon("sparkles",28) +
      '<h2>O que você procura?</h2><p>Experimente “Save Vid”, “plataformas” ou “sugestões”.</p></div>';return;}
    node.innerHTML='<p class="search-summary">' + items.length + (items.length===1?' resultado encontrado':' resultados encontrados') +
      '</p>'+(items.length?'<div class="search-results">'+items.map(x=>
      '<a data-nav class="search-result" href="'+e(x.href)+'"><div><span class="notice-tag">'+e(x.tag)+
      '</span><h2>'+e(x.title)+'</h2><p>'+e(x.desc)+'</p></div>'+icon("arrow-up-right",19)+'</a>').join("")+'</div>':
      '<div class="search-empty"><h2>Nenhum resultado</h2><p>Tente outra palavra ou consulte a central de ajuda.</p></div>');
  }
  function policy(kind) {
    const privacy=kind==="privacidade";
    const sections=privacy?[
      ["Dados utilizados","O NexoHub é um site informativo sem cadastro de usuários. Provedores de hospedagem e infraestrutura podem processar informações técnicas de acesso, como endereço IP, para entregar e proteger o site."],
      ["Contato por e-mail","Quando você clica em enviar uma mensagem, o seu aplicativo de e-mail é aberto. O site não envia a mensagem sozinho. Informações compartilhadas por e-mail podem ser usadas para responder às solicitações."],
      ["Serviços externos","O portal pode incluir links para bots do Telegram e outras plataformas. Cada serviço externo possui suas próprias práticas de privacidade."],
      ["Cookies e estatísticas","Esta versão não possui sistema próprio de contas, comentários nem recursos próprios de monitoramento de comportamento dos usuários. Infraestrutura e navegador podem utilizar informações técnicas necessárias ao funcionamento."],
      ["Fale conosco","Para dúvidas sobre o uso de suas informações no portal, utilize o contato oficial do NexoHub."]
    ]:[
      ["Finalidade","O NexoHub reúne informações, avisos e notícias de diferentes projetos. O conteúdo pode ser atualizado para acompanhar alterações dos serviços."],
      ["Disponibilidade","As páginas são informativas e não garantem funcionamento contínuo dos bots. Não divulgamos um serviço como disponível sem checagem real."],
      ["Uso responsável","Links e projetos podem ser regidos por termos próprios. Utilize cada serviço conforme suas regras e a legislação aplicável."],
      ["Sugestões","Sugestões de plataformas ou funcionalidades passam por análise técnica e não representam compromisso de entrega ou prazo."],
      ["Contato","Em caso de dúvidas sobre estes termos, você pode enviar uma mensagem ao endereço de contato oficial."]
    ];
    return intro(privacy?"PRIVACIDADE":"TERMOS DE USO",
      privacy?'Privacidade e <span class="gradient-text">transparência.</span>':'Condições de <span class="gradient-text">utilização.</span>',
      privacy?"Como o portal funciona e o que acontece ao entrar em contato.":"Informações gerais sobre a utilização do NexoHub.")+
      '<section class="container enhanced-content policy-page"><p class="policy-date">Atualizado em 19 de outubro de 2026.</p>'+
      sections.map(x=>'<section><h2>'+e(x[0])+'</h2><p>'+e(x[1])+'</p></section>').join("")+
      link("/contato","Tire suas dúvidas","button button-outline")+'</section>';
  }
  return { homeExtras, help, updates, status, planning, contact, search, updateSearch, policy };
}
