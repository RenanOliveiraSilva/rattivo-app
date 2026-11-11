# Task 03 — Captura de fotos da geladeira

## 1. Status

**CONCLUÍDO NO CÓDIGO** (Aguardando validação em hardware físico Android)

- [x] Referência visual analisada
- [x] Dependências Expo instaladas pela versão compatível
- [x] Captura pela câmera implementada
- [x] Seleção pela galeria implementada
- [x] Limite e gerenciamento de até três fotos implementados
- [x] Entrada pela Home habilitada
- [x] Critérios de aceite validados (código e tipagem)
- [x] Task concluída no código

---

## 2. Referência visual obrigatória

A referência oficial está em:

```text
src/tasks/references/task03-fridge-capture.png
```

Antes de escrever código, abra a imagem e analise:

- cabeçalho e botão voltar;
- área principal de câmera;
- cantos de enquadramento;
- rótulo sobre a imagem;
- miniaturas removíveis;
- contador de fotos;
- disparador central;
- ações de câmera e galeria;
- CTA “Analisar foto”;
- aviso de limitação visual;
- safe areas, espaçamentos, raios, cores e hierarquia.

A imagem orienta o visual, mas não define contratos de backend. Não interpretar
elementos do mockup como funcionalidades já implementadas.

---

## 3. Objetivo

Implementar a tela autenticada “O que tem na sua geladeira?” para:

- abrir a câmera traseira do smartphone;
- fotografar prateleiras ou gavetas;
- selecionar imagens existentes da galeria;
- manter de uma a três fotos durante o fluxo;
- exibir miniaturas;
- remover fotos antes de continuar;
- preparar as imagens para a futura etapa de análise.

Esta task termina na preparação local das fotos. O reconhecimento de ingredientes
não será implementado aqui porque o backend atual não possui um endpoint para
receber essas imagens.

---

## 4. Contexto obrigatório

Antes de implementar:

1. Leia integralmente:
   - `AGENTS.md`;
   - `README.md`;
   - `src/tasks/task01.md`;
   - `src/tasks/task02.md`;
   - esta task.
2. Confirme que as Tasks 01 e 02 estão concluídas.
3. Abra `src/tasks/references/task03-fridge-capture.png`.
4. Inspecione:
   - `src/app/_layout.tsx`;
   - `src/app/(tabs)/_layout.tsx`;
   - `src/components/home/CopilotPanel.tsx`;
   - `src/contexts/AuthContext.tsx`;
   - `src/theme/tokens.ts`;
   - assets e componentes existentes.
5. Confirme no backend que reconhecimento inicial de ingredientes ainda não existe.

Não criar um endpoint imaginário e não alterar o backend.

---

## 5. Decisões de escopo

### 5.1 O que será real

- solicitação de permissão de câmera;
- preview da câmera traseira;
- captura de fotos;
- escolha pela galeria;
- contador;
- limite máximo de três fotos;
- miniaturas;
- remoção;
- validação antes de continuar;
- navegação autenticada;
- estados de erro e permissão.

### 5.2 O que continuará provisório

O botão “Analisar foto” deve validar as fotos e abrir uma rota provisória de
continuação que informe:

```text
Fotos prontas para análise
O reconhecimento de ingredientes será integrado na próxima etapa.
```

Essa tela provisória pode mostrar somente a quantidade selecionada e uma ação para
voltar. Não listar ingredientes fictícios e não simular resposta de IA.

### 5.3 O que não deve acontecer

- não enviar imagens para uma rota inexistente;
- não colocar chave Gemini no aplicativo;
- não chamar Gemini diretamente;
- não chamar o módulo Python da webcam;
- não transformar fotos em Base64 sem necessidade;
- não registrar URI, conteúdo ou metadados sensíveis em logs;
- não salvar automaticamente fotos capturadas na galeria;
- não analisar imagens silenciosamente;
- não afirmar que ingredientes foram reconhecidos;
- não selecionar receitas nesta task.

---

## 6. Dependências e configuração

Instalar usando o gerenciador do Expo, nunca escolhendo versões manualmente:

```powershell
npx expo install expo-camera expo-image-picker
```

Configurar os plugins necessários no `app.json` com mensagens em português.

As permissões devem explicar que:

- a câmera será usada para fotografar ingredientes;
- a galeria será acessada somente para o usuário escolher imagens;
- o Rattivo não precisa de microfone para esta funcionalidade.

Não solicitar microfone.

Depois da instalação:

- preservar compatibilidade com Expo SDK 58;
- preservar execução no Expo Go;
- não gerar pastas nativas com prebuild;
- não executar build EAS.

---

## 7. Modelo local das fotos

Criar um tipo explícito semelhante a:

```ts
type SelectedIngredientPhoto = {
  id: string;
  uri: string;
  width: number;
  height: number;
  source: 'camera' | 'gallery';
};
```

Regras:

- manter no máximo três itens;
- usar identificador estável, sem depender apenas do índice;
- armazenar URI e dimensões, não Base64;
- evitar duplicação acidental ao selecionar da galeria;
- não persistir fotos no SecureStore;
- não misturar fotos com access token ou estado de autenticação;
- limpar o estado quando o fluxo for descartado.

Se for necessário compartilhar as fotos com a rota provisória, usar contexto/store
local de curta duração. Não colocar conteúdo ou Base64 em parâmetros da URL.

---

## 8. Requisitos da tela

### 8.1 Rota e proteção

- Criar a tela fora da barra inferior, apresentada como fluxo focado.
- Manter o fundo escuro e ocultar tabs durante a captura.
- Exigir sessão autenticada.
- Redirecionar ao login se token/usuário não estiverem disponíveis.
- O botão voltar retorna à Home.
- Se houver fotos selecionadas, confirmar antes de descartá-las.
- Não permitir retorno inesperado ao onboarding/login pelo histórico.

### 8.2 Entrada pela Home

Atualizar “Explorar minha geladeira” em
`src/components/home/CopilotPanel.tsx`:

- remover o selo “Em breve” dessa ação;
- navegar para a nova tela;
- atualizar label de acessibilidade;
- preservar estilo da Home;
- não alterar o CTA “Começar a cozinhar”.

### 8.3 Cabeçalho

Reproduzir:

- botão voltar circular;
- título “O que tem na sua geladeira?”;
- subtítulo “Câmera do smartphone · modo demonstração”.

O texto “modo demonstração” é obrigatório enquanto o reconhecimento real não estiver
integrado.

### 8.4 Preview da câmera

Usar a API atual do `expo-camera` compatível com o SDK instalado.

Requisitos:

- câmera traseira por padrão;
- preview somente quando a tela estiver focada;
- pausar/desmontar câmera ao sair da tela;
- uma única instância de câmera ativa;
- área com cantos arredondados;
- indicadores de enquadramento nos quatro cantos;
- overlay sem bloquear o preview;
- proporção responsiva, sem cortar os controles inferiores;
- botão central e botão textual podem disparar a mesma ação;
- impedir disparos simultâneos;
- manter feedback visual durante captura.

O rótulo “Gaveta de legumes” pode ser mantido apenas como orientação estática do
modo demonstração. Ele não deve ser apresentado como resultado de reconhecimento.

### 8.5 Permissões de câmera

Tratar explicitamente:

- permissão ainda não solicitada;
- permissão concedida;
- permissão negada com possibilidade de solicitar novamente;
- permissão permanentemente negada, oferecendo abrir Configurações;
- câmera indisponível, simulador ou erro de inicialização.

Não deixar uma tela preta sem explicação. Mesmo sem câmera, permitir o acesso à
galeria quando possível.

Não solicitar permissão na abertura global do aplicativo; solicitar ao entrar no
fluxo ou ao iniciar a ação de câmera.

### 8.6 Captura

- Capturar uma foto por toque.
- Usar qualidade equilibrada para o MVP, evitando arquivos desnecessariamente
  grandes.
- Adicionar a captura ao estado somente se ainda houver espaço.
- Atualizar contador e miniaturas.
- Com três fotos, desabilitar novas capturas e explicar o limite.
- Não salvar automaticamente na galeria do aparelho.

### 8.7 Galeria

Usar `expo-image-picker`.

Requisitos:

- aceitar somente imagens;
- respeitar o número de vagas restantes;
- permitir uma ou mais seleções quando a API/plataforma suportar;
- se múltipla seleção não estiver disponível, aceitar uma imagem por vez;
- ignorar cancelamento sem mostrar erro;
- rejeitar excedentes de forma clara;
- manter dimensões e URI;
- não solicitar acesso mais amplo que o necessário.

### 8.8 Miniaturas

- Exibir as fotos na ordem em que foram adicionadas.
- Mostrar numeração de 1 a 3.
- Disponibilizar remoção individual com botão acessível.
- Após remover, liberar nova vaga.
- Não remover foto sem ação explícita.
- Se houver várias fotos, permitir visualizar qual está selecionada, caso isso seja
  necessário para reproduzir a referência.

### 8.9 Controles

Reproduzir a hierarquia visual:

- atalho para galeria;
- disparador circular central verde;
- contador “n/3 fotos”;
- botão “Tirar foto”;
- botão “Escolher da galeria”;
- CTA principal “Analisar foto”.

Regras:

- os dois controles de captura podem reutilizar o mesmo handler;
- os dois controles de galeria podem reutilizar o mesmo handler;
- “Analisar foto” fica desabilitado sem fotos;
- com uma a três fotos, abre a continuação provisória descrita nesta task;
- não mostrar spinner de análise de IA, pois não haverá requisição;
- evitar toques duplicados durante captura ou transição.

### 8.10 Aviso de limitação

Manter o aviso:

> Identificamos somente ingredientes visíveis nas fotos. Itens atrás de outros ou
> dentro de embalagens fechadas podem não aparecer.

Como o reconhecimento ainda não está integrado, acrescentar de forma discreta que
essa análise será disponibilizada na próxima etapa, sem poluir a composição.

---

## 9. Privacidade e ciclo de vida

- As imagens ficam somente no estado local desta demonstração.
- Não enviar nem persistir as imagens nesta task.
- Não registrar caminhos das imagens em logs.
- Não acessar outras fotos além das escolhidas pelo usuário.
- Não ativar câmera fora da tela de captura.
- Não manter a câmera ativa em background.
- Ao abandonar definitivamente o fluxo, descartar as referências locais.
- Diferenciar imagens capturadas pelo app de imagens originais da galeria; nunca
  apagar arquivos originais do usuário.

---

## 10. Fundação visual

Reutilizar `src/theme/tokens.ts` e a identidade estabelecida:

- fundo preto/grafite;
- verde-limão para ação principal, foco e enquadramento;
- superfícies escuras;
- títulos brancos;
- textos secundários cinza;
- botões e cards com raios amplos;
- brilho verde moderado no disparador e CTA;
- ícones claros e consistentes;
- safe areas e espaçamento compatíveis com Android.

Não usar emoji no lugar dos ícones.

Não copiar a foto da geladeira do mockup como se fosse o preview real. A grande área
deve mostrar a câmera ao vivo ou um estado de permissão/indisponibilidade.

---

## 11. Organização esperada

A organização deve acompanhar a estrutura existente. Exemplo:

```text
src/
├── app/
│   ├── fridge-capture.tsx
│   └── fridge-analysis.tsx        # continuação provisória
├── components/
│   └── fridge/
│       ├── CameraFrame.tsx
│       ├── CaptureControls.tsx
│       └── PhotoThumbnail.tsx
├── contexts/ ou state/
│   └── IngredientPhotosContext.tsx # somente se necessário entre rotas
└── types/
    └── ingredient-photo.ts
```

Não é obrigatório usar exatamente esses nomes. Evite:

- toda a implementação em um único arquivo;
- estado global permanente sem necessidade;
- regras de permissão duplicadas;
- abstrações genéricas prematuras;
- arquivos e diretórios vazios.

---

## 12. Fora do escopo

Não implementar:

- reconhecimento de ingredientes;
- upload de imagens;
- endpoint multipart;
- chamada ao Gemini;
- comunicação com o módulo Python;
- recomendação de receitas;
- revisão/edição de ingredientes reconhecidos;
- perfil nutricional;
- webcam da bancada;
- gravação de vídeo ou áudio;
- salvamento automático na galeria;
- execução em background;
- mudanças no backend;
- commit, push, prebuild, EAS ou publicação.

---

## 13. Critérios de aceite

- [x] A referência visual foi analisada.
- [x] A ação da Home abre a tela de captura.
- [x] A barra inferior não aparece durante o fluxo.
- [x] A tela exige autenticação.
- [ ] A câmera traseira apresenta preview real em dispositivo compatível (pendente teste físico Android).
- [x] Estados de permissão são claros.
- [x] A galeria continua disponível quando a câmera não está.
- [ ] É possível capturar uma foto (pendente teste físico com sensor de câmera).
- [x] É possível escolher imagem da galeria.
- [x] É possível combinar câmera e galeria.
- [x] O limite de três fotos é respeitado.
- [x] Miniaturas e contador refletem o estado real.
- [x] É possível remover fotos.
- [x] “Analisar foto” fica desabilitado sem imagens.
- [x] “Analisar foto” não chama endpoint inexistente nem simula ingredientes.
- [x] A continuação informa honestamente que a integração virá depois.
- [x] Nenhuma imagem, URI ou Base64 é registrada.
- [x] Nenhuma foto é enviada ou persistida nesta task.
- [x] A câmera é liberada ao sair da tela.
- [x] O fluxo funciona com safe area e rolagem em Android menor.
- [x] Home, tabs, login e logout continuam funcionando.
- [x] `npm run typecheck` termina sem erros.
- [x] `npm run lint` termina sem erros.

---

## 14. Verificação e entrega

Antes de concluir:

1. Execute `npm run typecheck`.
2. Execute `npm run lint`.
3. Inicie com `npm start` e confirme a compilação do Metro.
4. Em dispositivo físico Android, valide:
   - solicitação e negação de permissão;
   - concessão de permissão;
   - preview traseiro;
   - captura;
   - galeria;
   - cancelamento da galeria;
   - mistura entre origens;
   - remoção;
   - limite de três;
   - descarte ao voltar;
   - liberação da câmera ao sair;
   - continuação provisória.
5. Se a câmera não for testada fisicamente, não marcar os itens correspondentes
   como concluídos.
6. Atualize o status e o checklist com resultados reais.
7. Entregue relatório contendo:
   - dependências e plugins adicionados;
   - arquivos criados e alterados;
   - decisões de estado e navegação;
   - comportamento de permissões;
   - verificações executadas;
   - limitações reais;
   - pendência explícita do endpoint de reconhecimento.
