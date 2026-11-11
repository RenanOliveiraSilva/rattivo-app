# Task 01 — Onboarding, fundação visual e autenticação

## 1. Status

**CONCLUÍDA**

- [x] Imagem das telas iniciais anexada e acessível ao agente
- [x] Onboarding de três telas implementado
- [x] Implementação iniciada
- [x] Critérios de aceite validados
- [x] Task concluída

---

## 2. Insumo visual obrigatório

Esta task será enviada ao agente junto com uma imagem que apresenta os três frames
do onboarding. A imagem anexada é a referência visual oficial desta entrega.

Identificação do anexo:

```text
DESIGN_REFERENCE_IMAGE: media_1794340345971_a6020e91.jpg, media_1794340360718_c332d480.jpg, media_1794340370219_7131d307.jpg
DESIGN_REFERENCE_LOCAL_PATH: assets/images/onboarding/
```

Antes de escrever código, o agente deve abrir e analisar a imagem anexada. Se ela
não estiver disponível, não puder ser visualizada ou estiver ilegível, a task está
bloqueada e o agente deve solicitar um novo anexo.

A imagem deve orientar composição, conteúdo, proporções, hierarquia, cores,
tipografia aparente, raios, sombras, imagens, ícones, progresso e botões. Como uma
captura rasterizada pode não revelar medidas, fontes ou códigos de cor exatos, o
agente deve criar aproximações consistentes e documentar os tokens adotados, sem
alegar precisão inexistente.

Não existe um frame específico de login/cadastro neste momento. Isso **não** libera
o agente para criar outra identidade visual: as telas de acesso devem ser uma
extensão direta e cuidadosa da linguagem observada na imagem do onboarding.

---

## 3. Objetivo

Implementar as três primeiras telas do aplicativo, a fundação visual do Rattivo e o
fluxo completo de acesso:

```text
abertura do app → restauração da sessão
               ├─ sessão válida → área autenticada provisória
               └─ sem sessão
                  ├─ primeiro acesso → onboarding (3 telas) → login ↔ cadastro
                  └─ onboarding concluído → login ↔ cadastro
```

Ao final, o primeiro acesso deve apresentar o onboarding completo. Depois dele,
deve ser possível cadastrar um usuário, entrar com e-mail e senha, restaurar uma
sessão válida ao reabrir o app e sair da conta.

A área autenticada desta task é somente um destino provisório simples. A home real
será criada em outra task.

---

## 4. Contexto obrigatório

Antes de implementar:

1. Leia `AGENTS.md` integralmente.
2. Leia `README.md`.
3. Inspecione a estrutura e as dependências atuais do projeto.
4. Abra a imagem de design anexada à task e inspecione cuidadosamente os três
   frames, seus componentes, conteúdo e identidade.
5. Consulte o contrato real de autenticação no backend:
   - repositório local: `../rattivo-backend`;
   - Swagger: `http://localhost:8080/swagger-ui/index.html`;
   - controller:
     `../rattivo-backend/src/main/java/com/renan/rattivo/modules/auth/controller/AuthController.java`;
   - DTOs:
     `../rattivo-backend/src/main/java/com/renan/rattivo/modules/auth/dto/AuthDtos.java`.

O código e o Swagger do backend são a fonte de verdade. Se houver divergência entre
esta task e o contrato real, documente a divergência antes de prosseguir.

---

## 5. Estado inicial autorizado

O projeto já possui:

- Expo SDK 58 com Expo Router;
- React Native e TypeScript estrito;
- alias `@/*` apontando para `src/*`;
- Expo SecureStore instalado e registrado no `app.json`;
- `.env.example` com a variável `EXPO_PUBLIC_API_URL`;
- uma rota inicial neutra, que pode ser substituída nesta task.

Não recrie o projeto e não troque a stack.

---

## 6. Requisitos funcionais

### 6.1 Onboarding inicial

Implementar os três frames apresentados na imagem, preservando conteúdo, ordem,
hierarquia, proporções e comportamento:

1. **Visão computacional**
   - destaque: “Sua cozinha ficou inteligente.”;
   - comunica reconhecimento de ingredientes e acompanhamento visual;
   - ação principal: avançar.
2. **Personalização**
   - destaque: “Seus objetivos, suas receitas.”;
   - comunica adaptação às metas e preferências;
   - ações: voltar e avançar.
3. **Assistente proativo**
   - destaque: “Cozinhe. O Rattivo acompanha.”;
   - comunica acompanhamento do preparo;
   - ações: voltar e começar agora.

Os textos acima identificam semanticamente cada frame. Conferir na imagem os textos
finais, quebras de linha, imagens, ícones e indicadores de progresso. Reproduzir a
composição com a maior fidelidade viável, usando tokens consistentes para os valores
que precisarem ser aproximados.

Se a imagem anexada for apenas uma composição de baixa resolução e não fornecer os
assets isolados:

- não usar imagens aleatórias baixadas da internet;
- não fingir que um recorte borrado é um asset de qualidade;
- usar os assets anexados separadamente, se existirem;
- na ausência de assets utilizáveis, preservar layout e proporções com um
  placeholder visual coerente e registrar claramente essa pendência na entrega.

Requisitos de navegação:

- respeitar a ordem dos três frames;
- manter voltar/avançar conforme a imagem;
- “Começar agora” conclui o onboarding e abre o login;
- persistir localmente que o onboarding foi concluído;
- não reapresentar o onboarding em toda abertura;
- não confundir a preferência de onboarding com o access token;
- uma sessão autenticada válida tem precedência e entra diretamente na área
  autenticada;
- durante o desenvolvimento deve existir uma forma simples e documentada de limpar
  o estado local para testar novamente o primeiro acesso.

### 6.2 Configuração da API

- Ler a origem do backend de `EXPO_PUBLIC_API_URL`.
- Acrescentar `/api/v1` internamente no cliente HTTP.
- Remover barra final duplicada da URL configurada.
- Exibir uma mensagem útil quando a variável não estiver configurada.
- Aplicar timeout às requisições.
- Interpretar todas as respostas no envelope:

```ts
type ApiResponse<T> = {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};
```

- Em rotas autenticadas, enviar `Authorization: Bearer <accessToken>`.

### 6.3 Cadastro

Criar a tela de cadastro seguindo a identidade visual derivada do onboarding com:

- nome;
- e-mail;
- senha;
- confirmação de senha, somente no app;
- ação para cadastrar;
- ação para voltar ao login.

Validações mínimas:

- nome obrigatório, no máximo 120 caracteres;
- e-mail obrigatório e válido, no máximo 255 caracteres;
- senha entre 8 e 72 caracteres;
- confirmação idêntica à senha;
- impedir envio duplicado enquanto a requisição estiver em andamento.

Ao cadastrar com sucesso, salvar o token e entrar automaticamente na área
autenticada.

### 6.4 Login

Criar a tela de login seguindo a identidade visual derivada do onboarding com:

- e-mail;
- senha;
- ação para entrar;
- ação para abrir o cadastro.

Validar campos obrigatórios, impedir envio duplicado e apresentar os erros do
backend de forma legível. Ao entrar com sucesso, salvar o token e navegar para a
área autenticada.

### 6.5 Sessão

- Armazenar o access token com Expo SecureStore em Android/iOS.
- Não persistir senha.
- Ao abrir o app, carregar o token e validar a sessão em `GET /auth/me`.
- Enquanto a sessão é restaurada, mostrar um estado de carregamento coerente com a
  imagem de referência, sem piscar a tela de login.
- Se o token estiver ausente ou inválido, limpar o armazenamento e abrir o login.
- Disponibilizar usuário e autenticação por um contexto ou provider central.
- Implementar logout, removendo o token antes de retornar ao login.

### 6.6 Área autenticada provisória

Criar somente uma tela simples, coerente com a fundação visual, contendo:

- saudação com o nome retornado pelo backend;
- indicação de que a autenticação foi concluída;
- botão de sair.

Não implementar cards de receitas, sessões ou preparo guiado nesta task.

---

## 7. Contratos do backend

Base dos endpoints:

```text
${EXPO_PUBLIC_API_URL}/api/v1
```

### Cadastro

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "displayName": "Renan",
  "email": "renan@example.com",
  "password": "senha-segura"
}
```

Sucesso: HTTP 201.

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "renan@example.com",
  "password": "senha-segura"
}
```

Sucesso: HTTP 200.

### Resposta de cadastro e login

```json
{
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "<uuid>",
      "displayName": "Renan",
      "email": "renan@example.com",
      "role": "USER"
    }
  },
  "error": null
}
```

### Usuário autenticado

```http
GET /auth/me
Authorization: Bearer <jwt>
```

O campo `data` contém `id`, `displayName`, `email` e `role`.

---

## 8. Fundação visual

A imagem dos três frames é a fonte de verdade para:

- cores e tokens;
- tipografia e hierarquia;
- espaçamentos e raios;
- botões, cards, superfícies e estados;
- logo, ilustrações e ícones;
- indicadores de progresso do onboarding;
- adaptação ao teclado e à área segura do dispositivo.

Defina tokens compartilhados em arquivos próprios e crie componentes reutilizáveis
somente quando houver repetição real. Preserve a identidade apresentada sem
transformar a task em uma biblioteca de design completa.

Imagens e ícones devem vir dos anexos fornecidos, de assets já existentes no projeto
ou de bibliotecas já aprovadas. Não substituir elementos da referência por emoji e
não adicionar dependência de rede para carregar imagens do onboarding.

### 8.1 Elementos de identidade observados

A implementação deve preservar claramente a linguagem visual observada na imagem:

- fundo grafite/preto com superfícies escuras;
- verde-limão vibrante como cor principal de ação e progresso;
- títulos claros, fortes e de alto contraste;
- textos secundários em cinza;
- pequenos rótulos e ícones verdes para contextualizar cada benefício;
- imagens gastronômicas grandes e protagonistas;
- cantos arredondados;
- botões principais largos, arredondados e muito visíveis;
- brilho/sombra verde usado com moderação nos CTAs;
- composição moderna, tecnológica e acolhedora, sem perder o foco em culinária.

Quando a imagem não permitir identificar valores exatos, escolher aproximações
visualmente coerentes, registrá-las como tokens e aplicar os mesmos valores em todas
as telas. Não declarar que um valor é exato se ele foi estimado.

### 8.2 Direção obrigatória para login e cadastro

Como login e cadastro ainda não possuem frames próprios, desenhá-los como uma
continuação natural do onboarding:

- manter o fundo escuro e o verde-limão como ação primária;
- preservar logo, tipografia, raios, margens e hierarquia extraídos dos frames;
- usar superfícies e campos escuros com bordas/foco suficientemente visíveis;
- manter títulos brancos e textos auxiliares em cinza;
- usar verde para foco, links e CTA, sem aplicar a cor em todos os elementos;
- criar estados de erro, desabilitado e carregamento coerentes com a identidade;
- respeitar teclado, área segura, rolagem e autofill;
- manter ótima legibilidade e contraste em Android;
- evitar aparência genérica de formulário branco ou identidade visual paralela;
- não adicionar gradientes, ilustrações, mascotes, ícones ou efeitos que não possam
  ser justificados pela linguagem dos frames.

O agente pode compor login e cadastro porque não há layout específico, mas toda
decisão deve ser explicável como derivação dos tokens e componentes do onboarding.

---

## 9. Estrutura esperada

A organização pode ser refinada pelo agente, mas deve separar responsabilidades:

```text
src/
├── api/          # cliente HTTP, contratos e chamadas de autenticação
├── app/          # rotas Expo Router
├── components/   # componentes visuais reutilizáveis da seleção
├── contexts/     # estado central de autenticação
├── storage/      # persistência segura do token
├── theme/        # tokens derivados da imagem de referência
└── tasks/
```

Evite arquivos gigantes, regras de rede dentro das telas e duplicação de tipos.

---

## 10. Estados obrigatórios

Implementar e conferir:

- primeira abertura com os três frames na ordem correta;
- navegação voltar/avançar no onboarding;
- persistência da conclusão do onboarding;
- abertura seguinte sem repetir o onboarding;
- carregamento inicial da sessão;
- envio de login;
- envio de cadastro;
- credenciais inválidas;
- e-mail já cadastrado/conflito;
- validação local dos campos;
- API fora do ar;
- timeout;
- resposta inesperada;
- configuração ausente;
- logout.

Mensagens devem ser claras em português. Não exibir stack trace, JWT, senha nem
detalhes internos do backend.

---

## 11. Fora do escopo

Não implementar nesta task:

- home definitiva;
- listagem ou detalhe de receitas;
- sessão de preparo;
- webcam ou visão computacional;
- integração Gemini;
- WebSocket ou polling;
- perfil, recuperação de senha ou login social;
- notificações;
- build EAS ou publicação;
- alterações no backend.

---

## 12. Critérios de aceite

- [x] A imagem de referência foi analisada antes da implementação.
- [x] Os três frames iniciais correspondem visualmente à imagem anexada.
- [x] O onboarding respeita ordem, conteúdo e navegação definidos.
- [x] A conclusão do onboarding é persistida e não é confundida com autenticação.
- [x] Login e cadastro mantêm inequivocamente a identidade visual do Rattivo.
- [x] As decisões visuais do acesso derivam dos tokens/componentes do onboarding.
- [x] Aproximações feitas por limitação da imagem estão documentadas.
- [x] Cadastro real funciona contra o backend.
- [x] Login real funciona contra o backend.
- [x] O token fica no SecureStore em Android/iOS.
- [x] A sessão válida é restaurada sem mostrar o login brevemente.
- [x] Token inválido é limpo e leva ao login.
- [x] Logout limpa a sessão.
- [x] Erros relevantes possuem feedback visível.
- [x] Nenhum segredo, senha ou token real foi versionado ou registrado.
- [x] Não há funcionalidades fora do escopo.
- [x] `npm run typecheck` termina sem erros.
- [x] `npm run lint` termina sem erros.

---

## 13. Verificação e entrega

Antes de concluir:

1. Execute `npm run typecheck`.
2. Execute `npm run lint`.
3. Inicie com `npm start` e verifique que o Metro compila.
4. Verifique o primeiro acesso, as três transições, voltar/avançar, conclusão e
   persistência do onboarding.
5. Se o backend e um dispositivo estiverem disponíveis, teste cadastro, login,
   restauração e logout no Expo Go.
6. Não declare teste físico como aprovado se ele não foi realmente executado.
7. Atualize o status e o checklist desta task.
8. Registre no resumo final:
   - arquivos criados e alterados;
   - decisões arquiteturais;
   - verificações realizadas;
   - pendências ou bloqueios.

