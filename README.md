# NexoHub

Portal oficial de informações e novidades dos bots.

Projeto estático pronto para publicar no Cloudflare Pages. Os arquivos do site ficam em `public/`. O site utiliza navegação de página única (SPA), e não inclui um `404.html` na raiz para permitir rotas internas no Cloudflare Pages.

## Deploy no Cloudflare Pages

- Conecte o repositório `elenilda10/nexohub` em **Workers & Pages > Create > Pages > Connect to Git**.
- Branch de produção: `main`.
- Framework preset: **None**.
- Build command: **\`exit 0\`** (não há compilação; também pode ficar vazio se o painel permitir).
- Build output directory: `public`.

## Editar conteúdo

As informações dos bots, avisos e links ficam em `public/data.js`. Edite o arquivo e faça commit; o Pages publica automaticamente se a integração estiver ativada.

**Atenção:** cadastre os links oficiais dos bots e confirme suas funcionalidades antes de divulgá-los. Nenhum link ou plataforma suportada foi inventado.

## Domínio

O pedido de `nexohub.eu.org` está aguardando aprovação do EU.org. Enquanto isso, publique no endereço `*.pages.dev` que o Cloudflare atribuir ao projeto. Não altere os nameservers no EU.org enquanto o pedido estiver pendente.

## Ambiente Cloudflare Pages

Projeto Pages criado e conectado ao GitHub: https://nexohub-9s3.pages.dev

O primeiro deploy acontece após um commit com a integração Git ativa.

## Portal ampliado (v2)

Páginas adicionadas: /ajuda, /status, /atualizacoes, /planejamento, /contato, /pesquisar, /privacidade e /termos. A pesquisa encontra bots, avisos, atualizações e perguntas frequentes, com atalho Ctrl+K.

Conteúdo editável em public/data.js: bots, notices, faqs, releases, serviceStatus e roadmap. A branch main está conectada ao Cloudflare Pages.

Os links de bots só são exibidos após cadastro oficial. A página de status NÃO monitora uptime automaticamente e os formulários de contato abrem o aplicativo de e-mail (sem armazenamento no servidor). Não há login nem painel administrativo nesta versão.

Após aprovação de nexohub.eu.org, atualizar o sitemap.xml e a delegação DNS.


## NexoHub Studio (v3)

O editor está disponível em `/admin/`. Há um guia de ativação local em `/admin/configurar.html`.

- Banco dedicado: `nexohub_cms`, vinculado como `CMS_DB` em **Production**.
- Endpoints de administração em `functions/api/admin/` com autenticação por senha forte (PBKDF2), sessão assinada em cookie `HttpOnly, Secure, SameSite=Strict`, validação de origem e limite de tentativas.
- Gestão de bots, plataformas confirmadas, comunicados, perguntas frequentes, histórico de versões e planejamento.
- Registro de ações no D1. O site carrega o conteúdo do D1 via `/api/content` e usa dados estáticos como fallback antes da ativação ou quando há erro.
- O conteúdo inicial já está importado no D1 e **não deve ser importado novamente**.
- Mudanças no D1 aparecem ao recarregar a página; não exigem novo deploy do GitHub.

### Primeira ativação do login

Na Cloudflare, configure **duas variáveis Secret** no ambiente Production do Pages:

1. `ADMIN_PASSWORD_HASH`: hash `pbkdf2$150000$saltHex$hashHex` obtido pela página local `/admin/configurar.html`.
2. `ADMIN_SESSION_SECRET`: valor aleatório longo criado nessa mesma página.

Faça um novo deploy. Não coloque essas variáveis no GitHub, código JS público ou capturas de tela. O login falha fechado até a configuração. Após perder a senha, gere novas variáveis no dashboard; isso invalida sessões antigas se o segredo de sessão for alterado.

O painel não usa Cloudflare Access neste momento: o acesso é protegido pelo próprio Pages Function. Se for usar o site como portal corporativo, avalie adicionar Cloudflare Access como segunda camada.

### Notas de operação

- Editor de conteúdo: autenticação exigida. `/api/admin/entries` não é API pública.
- Status em tempo real e métricas de visitas ainda não estão implementados; não exiba medições inventadas.
- O serviço de sugestões continua funcionando por e-mail, sem formulário que armazene mensagens.
- Em futuras alterações de schema, fazer backup do D1 antes de aplicar migrações.
- Hero mobile recebeu layouts mais compactos, sem as etiquetas flutuantes que se sobrepunham ao cartão.
