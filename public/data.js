/**
 * NexoHub — conteúdo do portal
 *
 * Estes dados servem como fallback estático. Com o CMS ativo, o conteúdo publicado
 * é lido do banco D1 e deve ser alterado pelo NexoHub Studio.
 * Nunca coloque tokens, senhas ou chaves de API aqui: este arquivo é público.
 *
 * Para liberar o botão "Abrir bot", substitua null por um link oficial
 * (por exemplo: "https://t.me/seu_bot"). Não use links provisórios.
 */
export const config = {
  brand: "NexoHub",
  tagline: "Seus bots, novidades e serviços. Tudo conectado.",
  contactEmail: "contatonexohub@proton.me",
};

export const bots = [
  {
      "slug": "savevid",
      "name": "Save Vid DL",
      "category": "Downloads",
      "icon": "download",
      "accent": "violet",
      "short": "Vídeos, fotos, álbuns, músicas e arquivos enviados diretamente no Telegram.",
      "description": "O Save Vid DL recebe links no Telegram e tenta obter a mídia compatível, com fluxos próprios para redes sociais, música e arquivos. A disponibilidade varia conforme o tipo de publicação, as restrições da plataforma e o tamanho do arquivo.",
      "features": [
          "Envio de links individuais ou de até 6 links na mesma mensagem",
          "Vídeos, fotos, carrosséis e álbuns de publicações compatíveis",
          "Download e extração de áudio MP3 quando disponível",
          "Modo inline em serviços compatíveis",
          "Opções de qualidade, legendas e envio como documento",
          "Aproveitamento de arquivos já enviados pelo Telegram (cache)",
          "Identificação de música em vídeos enviados ao chat privado",
          "Suporte a links de arquivos públicos em serviços específicos"
      ],
      "platforms": [
          "Instagram",
          "Threads",
          "TikTok",
          "YouTube e YouTube Music",
          "X / Twitter",
          "Pinterest",
          "SoundCloud",
          "Spotify"
      ],
      "platformDetails": [
          {
              "name": "Instagram",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Reels, vídeos, fotos, Stories e carrosséis",
              "note": "Stories e conteúdos com restrição podem depender de autenticação."
          },
          {
              "name": "Threads",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Posts com fotos, vídeos e carrosséis",
              "note": "Funciona com publicações acessíveis; links sem mídia não geram download."
          },
          {
              "name": "TikTok",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Vídeos, fotos, slides e áudio MP3",
              "note": "Lives não são suportadas; disponibilidade depende do post."
          },
          {
              "name": "YouTube e YouTube Music",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Vídeos, Shorts e extração de áudio",
              "note": "Vídeos protegidos, restritos ou sujeitos a desafios podem falhar."
          },
          {
              "name": "X / Twitter",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Vídeos, imagens e GIFs",
              "note": "Posts privados ou com acesso restrito podem não funcionar."
          },
          {
              "name": "Pinterest",
              "category": "Redes sociais",
              "status": "principal",
              "formats": "Pins com vídeos, imagens e múltiplas mídias",
              "note": "Alguns formatos dependem dos extratores disponíveis."
          },
          {
              "name": "Facebook",
              "category": "Redes sociais",
              "status": "integrado",
              "formats": "Vídeos, fotos e álbuns de posts públicos",
              "note": "Links compartilhados, carrosséis e posts com login podem exigir tratamento especial; nem todo álbum é recuperável."
          },
          {
              "name": "Kwai",
              "category": "Redes sociais",
              "status": "integrado",
              "formats": "Vídeos de links reconhecidos",
              "note": "Atendido pelo extrator universal; pode falhar conforme a página e os redirecionamentos."
          },
          {
              "name": "Reddit",
              "category": "Redes sociais",
              "status": "integrado",
              "formats": "Posts com fotos, vídeos e galerias",
              "note": "Rota universal com extratores e fallback; publicações privadas podem falhar."
          },
          {
              "name": "SoundCloud",
              "category": "Música",
              "status": "principal",
              "formats": "Faixas de áudio",
              "note": "Somente faixas acessíveis pelos métodos disponíveis."
          },
          {
              "name": "Spotify",
              "category": "Música",
              "status": "principal",
              "formats": "Busca de correspondência e download de áudio",
              "note": "O bot tenta encontrar a faixa correspondente; não extrai arquivos protegidos diretamente do Spotify."
          },
          {
              "name": "Deezer",
              "category": "Música",
              "status": "integrado",
              "formats": "Links de faixas e metadados",
              "note": "Há handler próprio; o resultado depende das fontes de áudio encontradas."
          },
          {
              "name": "MediaFire",
              "category": "Arquivos",
              "status": "integrado",
              "formats": "Arquivos compartilhados publicamente",
              "note": "Links válidos de arquivo; o tamanho e a disponibilidade do host podem limitar o envio."
          },
          {
              "name": "Google Drive",
              "category": "Arquivos",
              "status": "experimental",
              "formats": "Links públicos de arquivos",
              "note": "Handler presente no repositório, mas a operação não foi validada aqui. Não anunciado como serviço estável."
          },
          {
              "name": "MEGA",
              "category": "Arquivos",
              "status": "experimental",
              "formats": "Links públicos de arquivos",
              "note": "Handler existente; cotas, bloqueios e limite de transferência podem impedir o download."
          },
          {
              "name": "XVideos (18+)",
              "category": "Outros",
              "status": "restrito",
              "formats": "Links públicos de vídeos",
              "note": "Conteúdo destinado somente a adultos; disponibilidade não garante acesso a qualquer publicação."
          }
      ],
      "telegram": null,
      "sourceRepo": "https://github.com/elenilda10/Bot-Download",
      "documentationNote": "Funcionalidades identificadas no repositório Bot-Download. A lista não representa teste ao vivo de cada plataforma."
  },
  {
    slug: "germusic",
    name: "GerMusicBot",
    category: "Música",
    icon: "music",
    accent: "cyan",
    short: "Um espaço dedicado a experiências com música e mídias no Telegram.",
    description: "Página do GerMusicBot. Aqui serão concentradas orientações de uso, novidades e comunicados relacionados ao projeto.",
    features: ["Projeto voltado a música e mídias", "Informações e avisos centralizados"],
    platforms: [],
    telegram: null,
  },
  {
    slug: "bolao-arquibancada",
    name: "Bolão Arquibancada",
    category: "Futebol",
    icon: "trophy",
    accent: "amber",
    short: "Palpites, futebol e a emoção de acompanhar cada rodada.",
    description: "O Bolão Arquibancada é o espaço dedicado a palpites e acompanhamento dos jogos. Nesta página, você encontrará atualizações e informações do projeto.",
    features: ["Palpites de futebol", "Acompanhamento de jogos", "Rankings e competições"],
    platforms: [],
    telegram: null,
  },
];

/* Datas no formato AAAA-MM-DD. Insira aqui apenas comunicados reais. */
export const notices = [
  {
    slug: "savevid-guia-de-plataformas",
    title: "Save Vid DL: novo guia de plataformas e formatos",
    date: "2026-10-22",
    category: "Save Vid",
    summary: "A página do Save Vid DL agora reúne plataformas presentes no código, formatos previstos e limitações de cada integração.",
    paragraphs: [
      "Organizamos as redes sociais, serviços de música e plataformas de arquivos com detalhes sobre os tipos de mídia contemplados no repositório.",
      "Também identificamos separadamente as integrações experimentais e as que dependem de restrições de acesso. A publicação do guia não significa que todos os downloads foram testados em tempo real.",
      "Acesse a página do Save Vid DL para consultar as informações por plataforma e sugerir novas integrações.",
    ],
    pinned: false,
  },
  {
    slug: "portal-em-preparacao",
    title: "NexoHub está em preparação",
    date: "2026-10-19",
    category: "NexoHub",
    summary: "Estamos organizando um lugar único para reunir informações, avisos e novidades sobre nossos bots.",
    paragraphs: [
      "O NexoHub está sendo preparado para facilitar o acesso às informações de diferentes projetos em um só lugar.",
      "As páginas de cada bot vão reunir funcionalidades, atualizações e avisos importantes. Os links oficiais serão adicionados conforme forem confirmados.",
    ],
    pinned: true,
  },
  {
    slug: "sugestoes-de-plataformas",
    title: "Quer sugerir uma plataforma para o Save Vid?",
    date: "2026-10-19",
    category: "Save Vid",
    summary: "Você pode indicar plataformas que gostaria de ver entre os serviços suportados.",
    paragraphs: [
      "Estamos avaliando novas plataformas e possibilidades de download para o Save Vid.",
      "Se você tem uma sugestão, envie o nome da plataforma pelo nosso contato. Cada sugestão será analisada conforme a viabilidade técnica e as regras do serviço. A inclusão não é garantida e pode levar tempo.",
    ],
    pinned: false,
  },
];


/**
 * Conteúdo adicional do portal. Os itens abaixo são editoriais e manuais:
 * NENHUM status é uma checagem automática de disponibilidade.
 */
export const faqs = [
  { id: "o-que-e-nexohub", category: "Sobre o portal", question: "O que é o NexoHub?", answer: "É a central de informações dos nossos projetos. Aqui reunimos detalhes dos bots, comunicados, atualizações e canais de contato." },
  { id: "como-acessar-bot", category: "Bots e projetos", question: "Como faço para abrir um dos bots?", answer: "Entre na página do projeto e procure o link oficial. Quando um link ainda não estiver cadastrado, essa informação aparecerá claramente." },
  { id: "plataformas-suportadas", category: "Bots e projetos", question: "Onde encontro as plataformas suportadas pelo Save Vid?", answer: "Na página do Save Vid DL, há uma lista pesquisável de plataformas e formatos identificados no repositório. Cada integração indica se é principal, adicional, experimental ou restrita. A presença no código não garante funcionamento contínuo." },
  { id: "enviar-sugestao", category: "Contato", question: "Posso sugerir uma nova plataforma ou função?", answer: "Sim. Use a página de contato para enviar sua sugestão por e-mail. Avaliamos a viabilidade técnica e as regras de cada plataforma; não há garantia ou prazo de inclusão." },
  { id: "bot-instavel", category: "Bots e projetos", question: "O que fazer se um bot não responder?", answer: "Verifique os avisos do projeto e tente novamente mais tarde. A página de status indica quando ainda não existe monitoramento em tempo real. Você também pode relatar o problema por e-mail." },
  { id: "cadastro", category: "Sobre o portal", question: "Preciso criar uma conta para acessar o NexoHub?", answer: "Não. As páginas informativas do NexoHub podem ser consultadas sem cadastro. Bots e serviços externos podem ter requisitos próprios." },
  { id: "precos", category: "Sobre o portal", question: "O NexoHub é gratuito?", answer: "Consultar este portal é gratuito. Recursos e planos de cada bot, quando houver, devem ser conferidos nas informações oficiais do respectivo projeto." },
  { id: "privacidade", category: "Privacidade", question: "O NexoHub lê minhas conversas com os bots?", answer: "Este site informativo não se conecta às suas conversas no Telegram. Cada bot possui seu próprio funcionamento e pode tratar dados conforme suas funcionalidades." },
];

export const releases = [
  {
    "slug": "nexohub-visual-themes-savevid",
    "date": "2026-10-22",
    "version": "4.0",
    "title": "Tema claro e escuro e nova página premium do Save Vid",
    "type": "Portal",
    "summary": "Seletor de aparência para todo o site e uma nova experiência visual para o Save Vid DL.",
    "changes": [
      "Temas claro, escuro e automático, com preferência salva no navegador",
      "Nova apresentação do Save Vid com mockup ilustrativo de celular",
      "Vitrine de formatos com imagens SVG originais e carrossel navegável",
      "Seções de recursos, categorias, guia e plataforma com pesquisa e filtros",
      "Ajustes de acessibilidade e responsividade para dispositivos móveis"
    ]
  },
  {
    slug: "nexohub-versao-1",
    date: "2026-10-19",
    version: "1.0",
    title: "Lançamento inicial do NexoHub",
    type: "Portal",
    summary: "Primeira versão do portal com catálogo de projetos, páginas individuais e central de avisos.",
    changes: ["Início do portal de informações", "Páginas dos projetos Save Vid, GerMusicBot e Bolão Arquibancada", "Central de comunicados", "Layout responsivo para celulares"],
  },
  {
    slug: "nexohub-central-ampliada",
    date: "2026-10-19",
    version: "2.0",
    title: "Central ampliada de informações",
    type: "Portal",
    summary: "Novo conjunto de seções para facilitar a navegação e organizar informações.",
    changes: ["Pesquisa em projetos, avisos e perguntas frequentes", "Central de ajuda e perguntas frequentes", "Página de status com indicação transparente do monitoramento", "Histórico de atualizações e páginas institucionais"],
  },
];

export const serviceStatus = [
  { botSlug: "savevid", state: "unmonitored", note: "Monitoramento de disponibilidade ainda não configurado." },
  { botSlug: "germusic", state: "unmonitored", note: "Monitoramento de disponibilidade ainda não configurado." },
  { botSlug: "bolao-arquibancada", state: "unmonitored", note: "Monitoramento de disponibilidade ainda não configurado." },
];

export const roadmap = [
  { title: "Atualização do catálogo de plataformas", category: "Save Vid", stage: "Guia publicado", description: "O catálogo descreve 16 integrações identificadas no repositório, incluindo serviços ainda em testes. Os resultados continuam sujeitos a validação por plataforma." },
  { title: "Links oficiais dos projetos", category: "NexoHub", stage: "Pendente", description: "Os botões de acesso serão publicados quando os endereços oficiais forem informados." },
  { title: "Monitoramento automático", category: "Serviços", stage: "Em avaliação", description: "Acompanhar a disponibilidade dos bots sem depender de atualização manual." },
];
