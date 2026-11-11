# Task 02 — Home autenticada e navegação principal

## 1. Status

**PENDENTE**

- [ ] Imagem de referência analisada
- [ ] Home provisória substituída
- [ ] Navegação principal criada
- [ ] Estados sem dados reais tratados honestamente
- [ ] Critérios de aceite validados
- [ ] Task concluída

---

## 2. Referência visual obrigatória

A referência oficial desta task está versionada em:

```text
src/tasks/references/task02-home.png
```

Antes de escrever código, abra a imagem e analise:

- composição vertical;
- hierarquia da saudação;
- dois cards de status;
- card nutricional;
- painel principal do copiloto culinário;
- CTAs;
- barra inferior com ação central elevada;
- cores, tipografia aparente, espaçamentos, raios, bordas, brilhos e ícones.

A imagem é a fonte de verdade visual, mas contém exemplos de dados e estados que
ainda não possuem suporte no backend. Fidelidade visual não autoriza inventar dados
ou afirmar que integrações estão conectadas.

Como a imagem rasterizada não fornece necessariamente valores exatos, use
aproximações consistentes e os tokens já existentes. Documente qualquer decisão
visual relevante que precise ser estimada.

---

## 3. Objetivo

Substituir a área autenticada provisória da Task 01 por uma Home completa, coerente
com a referência visual e com o estado real do MVP.

A entrega deve:

- receber o usuário autenticado;
- saudá-lo pelo primeiro nome;
- apresentar os principais pontos de entrada do produto;
- estabelecer a navegação inferior do aplicativo;
- preservar logout e proteção da área autenticada;
- preparar rotas para as próximas tasks sem implementar suas funcionalidades;
- não exibir como reais dados ou conexões que o backend ainda não fornece.

---

## 4. Contexto obrigatório

Antes de implementar:

1. Leia integralmente `AGENTS.md`, `README.md` e esta task.
2. Confirme que `src/tasks/task01.md` está concluída.
3. Abra `src/tasks/references/task02-home.png`.
4. Inspecione o código atual, especialmente:
   - `src/app/_layout.tsx`;
   - `src/app/index.tsx`;
   - `src/app/home.tsx`;
   - `src/contexts/AuthContext.tsx`;
   - `src/theme/tokens.ts`;
   - `src/components`;
   - `src/api`;
   - `assets/images`.
5. Inspecione antes de usar:
   - `assets/images/home1.svg`;
   - `assets/images/home2.svg`;
   - `assets/images/home3.svg`;
   - `assets/images/logo.svg`;
   - assets existentes do onboarding.
6. Consulte o backend somente para confirmar o que existe. Nesta task, o usuário
   autenticado continua vindo do fluxo já implementado de `GET /auth/me`.

Não recrie o projeto, não substitua a autenticação e não altere o backend.

---

## 5. Estado atual que deve ser preservado

A Task 01 já implementou:

- onboarding;
- cadastro e login reais;
- armazenamento seguro do JWT;
- restauração da sessão;
- `AuthContext` com `user`, `token` e `logout`;
- tratamento do envelope `{ data, error }`;
- tokens visuais;
- componentes básicos;
- rota `/home` provisória.

A Home nova deve reutilizar essa base. Não duplique autenticação, cliente HTTP ou
tipos existentes.

O botão de desenvolvimento “Limpar onboarding para testes” não deve permanecer na
Home final. Se essa utilidade ainda for necessária, documente como executá-la em
desenvolvimento sem expô-la como ação principal ao usuário.

---

## 6. Decisões obrigatórias sobre dados reais

### 6.1 Dados disponíveis

O app possui dados reais do usuário autenticado:

- `id`;
- `displayName`;
- `email`;
- `role`.

Use `displayName` para a saudação. Não faça uma nova chamada a `GET /auth/me` a
cada renderização; o `AuthContext` já restaura a sessão.

### 6.2 Dados indisponíveis nesta etapa

O backend atual não fornece:

- foto de perfil;
- meta calórica;
- proteínas, carboidratos ou gorduras consumidos;
- meta nutricional;
- presença ou disponibilidade online do Rattito;
- estado de conexão da webcam;
- status do módulo Python para o aplicativo;
- conversa com o Rattito;
- captura de ingredientes pelo celular.

Regras:

- não copiar os números `930/2700`, `62/170g`, `110/320g` ou `24/80g` como
  se fossem dados do usuário;
- não usar uma foto aleatória como avatar;
- não mostrar “Câmera conectada” sem uma fonte real;
- não usar ponto verde para representar conexão inexistente;
- não adicionar mocks silenciosos ou chamadas diretas do app ao módulo Python;
- não criar endpoints ou alterar o backend nesta task.

Os componentes visuais podem preservar a composição da referência usando estados
vazios, neutros ou “Em breve”.

---

## 7. Requisitos funcionais e visuais

### 7.1 Proteção da área autenticada

- A Home só pode permanecer aberta com `token` e `user` válidos.
- Se a autenticação for removida ou invalidada, redirecionar para o login.
- Não permitir retorno para login/onboarding pelo botão voltar após autenticação.
- Preservar o logout implementado na Task 01.

### 7.2 Cabeçalho e saudação

Reproduzir a hierarquia da referência:

- saudação “Bom dia”, “Boa tarde” ou “Boa noite” conforme o horário local;
- primeiro nome derivado de `user.displayName`;
- título “Pronto para preparar algo incrível?”;
- avatar circular à direita.

Como não existe foto de perfil:

- usar as iniciais do usuário em um avatar coerente com a identidade;
- manter borda verde semelhante à referência;
- não usar a fotografia apresentada no mockup;
- tornar o avatar acessível e permitir que ele abra a rota provisória de Perfil.

Não desenhar manualmente relógio, Wi-Fi ou bateria. Esses elementos pertencem à
barra de status do sistema.

### 7.3 Cards de status

Criar os dois cards com composição visual próxima da referência.

#### Rattito

- reutilizar um asset oficial existente do Rattito, se adequado;
- o card pode indicar que o recurso faz parte do aplicativo;
- não afirmar que IA, Gemini ou conversa online estão disponíveis sem integração;
- ao tocar, navegar para a área provisória “Chef IA”, sem iniciar conversa falsa;
- usar texto honesto, por exemplo “Rattito” e “Assistente em preparação”, caso não
  exista uma fonte real de disponibilidade.

#### Webcam

- preservar ícone, card e hierarquia visual;
- apresentar estado neutro como “Aguardando conexão” ou “Status não verificado”;
- não mostrar “conectada” nem indicador verde enquanto não houver contrato real;
- não consultar o módulo Python diretamente pelo aplicativo;
- a integração de estado da webcam ficará para task específica.

### 7.4 Card nutricional

Preservar o espaço e a importância visual do card nutricional sem fabricar valores.

Enquanto não houver perfil nutricional:

- usar título como “Nutrição” ou “Configure suas metas”;
- apresentar um estado vazio claro;
- não desenhar progresso quantitativo falso;
- permitir navegação para a área provisória de Nutrição;
- manter aparência coerente com o card da referência.

Não implementar perfil nutricional nesta task.

### 7.5 Painel “O que vamos cozinhar hoje?”

Reproduzir o painel principal:

- badge “Copiloto culinário”;
- título “O que vamos cozinhar hoje?”;
- texto de apoio;
- imagem ou composição gastronômica proveniente dos assets locais;
- gradiente/overlay apenas quando necessário para legibilidade;
- CTA principal “Começar a cozinhar”;
- CTA secundário “Explorar minha geladeira”.

Comportamento:

- “Começar a cozinhar” deve navegar para a rota provisória de Receitas;
- não iniciar uma `cooking-session` nesta Home;
- não escolher receita automaticamente;
- “Explorar minha geladeira” deve aparecer como indisponível/“Em breve”, pois a
  captura e o reconhecimento de ingredientes não fazem parte desta task;
- o CTA indisponível deve ter estado visual e acessível, sem fingir funcionamento.

Inspecione `home1.svg`, `home2.svg`, `home3.svg` e `logo.svg` e reutilize
somente os arquivos que correspondam à composição. Não carregue imagens externas em
tempo de execução.

### 7.6 Navegação inferior

Criar a navegação inferior conforme a referência, com cinco destinos:

1. Início;
2. Receitas;
3. Chef IA, como ação central elevada;
4. Nutrição;
5. Perfil.

Requisitos:

- Início ativo em verde;
- ícones e textos alinhados e acessíveis;
- Chef IA central, circular e visualmente destacado;
- respeitar a safe area inferior;
- a barra deve permanecer legível sem cobrir o conteúdo;
- usar Expo Router;
- evitar múltiplas instâncias da mesma tela na pilha;
- o botão voltar do Android deve ter comportamento previsível.

Somente a Home será completa nesta task. Os demais destinos podem ser telas
provisórias mínimas e coerentes, com o texto “Em breve”.

Exceções necessárias:

- a tela provisória de Perfil deve exibir nome/e-mail reais e disponibilizar logout,
  preservando a funcionalidade da Task 01;
- o CTA “Começar a cozinhar” pode abrir a tela provisória de Receitas;
- nenhuma tela provisória deve implementar regra de negócio futura.

O agente pode usar grupos de rota e layout de tabs do Expo Router se isso simplificar
a navegação, mas deve atualizar todos os redirects existentes sem quebrar
onboarding, login, cadastro ou restauração de sessão.

### 7.7 Rolagem e responsividade

- A Home deve funcionar em telas Android menores que a referência.
- O conteúdo principal deve rolar; a barra inferior permanece utilizável.
- Respeitar safe areas superior e inferior.
- Evitar alturas fixas que cortem textos com fonte maior.
- Tratar nomes longos sem quebrar o layout.
- Não usar a dimensão do mockup como única dimensão suportada.

### 7.8 Estados

Implementar:

- usuário autenticado carregado;
- redirecionamento quando não autenticado;
- avatar por iniciais;
- recursos indisponíveis;
- feedback acessível ao tocar em função “Em breve”;
- logout em andamento;
- erro de logout/local storage, se ocorrer;
- prevenção de toques duplicados relevantes.

---

## 8. Fundação visual

Reutilizar e, quando necessário, ampliar `src/theme/tokens.ts`.

Preservar:

- fundo grafite/preto;
- cards escuros com bordas sutis;
- verde-limão como ação e estado ativo;
- títulos brancos de alto contraste;
- textos secundários cinza;
- raios amplos;
- brilho verde moderado no CTA e ação central;
- linguagem culinária e tecnológica;
- consistência com onboarding, login e cadastro.

Não duplicar valores de cor em vários componentes se eles pertencem ao tema.
Não substituir ícones por emoji.

Ícones devem vir de uma solução compatível com Expo/React Native já disponível ou
de uma dependência pequena e justificada. Não incluir uma biblioteca grande apenas
por um único ícone.

---

## 9. Organização esperada

A estrutura exata pode acompanhar a arquitetura existente. Como referência:

```text
src/
├── app/
│   ├── (authenticated)/ ou (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Home
│   │   ├── recipes.tsx        # provisória
│   │   ├── assistant.tsx      # provisória
│   │   ├── nutrition.tsx      # provisória
│   │   └── profile.tsx        # provisória + logout
├── components/
│   └── home/                  # somente se a divisão reduzir complexidade real
└── theme/
```

Não é obrigatório usar esses nomes, mas:

- evitar uma Home monolítica difícil de manter;
- não colocar regras de autenticação duplicadas dentro de cada card;
- não criar módulos vazios;
- manter componentes específicos da Home separados dos componentes globais quando
  não houver reutilização.

---

## 10. Fora do escopo

Não implementar:

- listagem real ou detalhe de receitas;
- criação, pausa ou retomada de sessão de preparo;
- tela de preparo guiado;
- conversa com IA;
- integração Gemini;
- captura de foto da geladeira;
- reconhecimento de ingredientes;
- perfil nutricional;
- upload ou edição de avatar;
- verificação de conexão da webcam;
- comunicação direta com o módulo Python;
- notificações;
- mudanças no backend;
- commit, push, build EAS ou publicação.

---

## 11. Critérios de aceite

- [ ] A referência `task02-home.png` foi analisada antes da implementação.
- [ ] A área autenticada provisória foi substituída pela Home.
- [ ] A saudação usa horário local e primeiro nome reais.
- [ ] O avatar usa iniciais e não uma foto inventada.
- [ ] O visual mantém a identidade do Rattivo e a composição da referência.
- [ ] Nenhum dado nutricional fictício é apresentado como real.
- [ ] A webcam não aparece conectada sem verificação.
- [ ] O Rattito não aparece online sem integração real.
- [ ] O CTA principal navega sem criar sessão acidentalmente.
- [ ] “Explorar minha geladeira” comunica indisponibilidade.
- [ ] A navegação inferior contém os cinco destinos.
- [ ] Rotas provisórias não antecipam funcionalidades futuras.
- [ ] Perfil provisório preserva logout.
- [ ] Rotas autenticadas redirecionam usuários sem sessão.
- [ ] Onboarding, login, cadastro e restauração continuam funcionando.
- [ ] A Home rola e respeita safe areas em Android.
- [ ] Não há imagem remota nem segredo no código.
- [ ] `npm run typecheck` termina sem erros.
- [ ] `npm run lint` termina sem erros.

---

## 12. Verificação e entrega

Antes de concluir:

1. Execute `npm run typecheck`.
2. Execute `npm run lint`.
3. Inicie com `npm start` e confirme que o Metro compila.
4. Verifique manualmente:
   - login até a Home;
   - restauração de sessão direto na Home;
   - saudação e nomes longos;
   - rolagem;
   - os cinco destinos da barra;
   - retorno à Home;
   - CTA principal;
   - estados “Em breve”;
   - logout e retorno ao login;
   - proteção das rotas sem token.
5. Se não houver dispositivo físico, declare o teste físico como pendente.
6. Atualize o status e o checklist desta task apenas com resultados verdadeiros.
7. Entregue relatório contendo:
   - arquivos criados, movidos e alterados;
   - como a imagem foi traduzida para componentes;
   - decisões de navegação;
   - estados sem suporte real e como foram representados;
   - verificações e resultados;
   - pendências.
