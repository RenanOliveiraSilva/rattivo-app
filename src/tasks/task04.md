# Task 04 — Receitas e preparo guiado com Chef Rattito

## 1. Status

**CONCLUÍDO NO CÓDIGO** (Aguardando execução do roteiro integrado com backend e Python ativos)

- [x] Referência visual analisada
- [x] Receitas reais carregadas do backend
- [x] Criação e retomada de sessão implementadas
- [x] Tela do Chef Rattito conectada à sessão
- [x] Controles de preparo implementados
- [x] Orientação da webcam apresentada
- [x] Interação simulada identificada honestamente
- [x] Critérios de aceite validados no código
- [x] MVP concluído no código

---

## 2. Referência visual obrigatória

A referência oficial está em:

```text
src/tasks/references/task04-guided-instructions.png
```

Antes de escrever código, abra a imagem e analise:

- cabeçalho “Chef Rattito”;
- contexto da receita;
- badge “Respostas simuladas”;
- mascote central;
- mensagens do assistente e usuário;
- sugestões rápidas;
- controles de teclado, fala e áudio;
- integração com a barra inferior;
- cores, espaçamentos, tipografia, raios e hierarquia.

A imagem orienta a apresentação. O comportamento funcional deve respeitar os
contratos reais do backend e as limitações do Expo Go.

---

## 3. Objetivo

Finalizar o fluxo principal do MVP:

```text
Home
  → Receitas
  → Detalhe da receita
  → Iniciar preparo
  → Chef Rattito com etapa atual
  → orientação contextual da webcam
  → confirmação humana
  → próxima etapa
  → sessão concluída
```

A tela do Chef Rattito deve combinar:

- dados reais da receita;
- estado real da sessão;
- instrução real da etapa atual;
- observação/orientação real recebida do módulo Python pelo backend;
- perguntas rápidas com respostas locais explicitamente simuladas;
- controles reais de pausa, retomada, cancelamento e confirmação.

O aplicativo nunca conversa diretamente com Python ou Gemini.

---

## 4. Ordem de prioridade

### P0 — obrigatório para o evento

1. Listagem real de receitas.
2. Detalhe real da receita.
3. Iniciar ou retomar sessão.
4. Mostrar etapa atual e progresso.
5. Atualizar orientação contextual.
6. Pausar e retomar.
7. Confirmar etapa explicitamente.
8. Concluir sessão.
9. Tratar erros, conflito de revisão e autenticação.

### P1 — acabamento da referência

1. Mensagens em formato conversacional.
2. Sugestões rápidas.
3. Interação de fala simulada e claramente identificada.
4. Leitura da orientação em voz alta.
5. Animações e refinamentos visuais.

Não comprometer o P0 para implementar voz ou animação.

---

## 5. Contexto obrigatório

Antes de implementar:

1. Leia integralmente:
   - `AGENTS.md`;
   - `README.md`;
   - Tasks 01 a 04.
2. Confirme que Tasks 01 e 02 estão concluídas.
3. A Task 03 pode continuar com teste físico pendente; ela não bloqueia este fluxo.
4. Abra `src/tasks/references/task04-guided-instructions.png`.
5. Inspecione:
   - `src/app/(tabs)/recipes.tsx`;
   - `src/app/(tabs)/assistant.tsx`;
   - `src/app/(tabs)/_layout.tsx`;
   - `src/components/home/CopilotPanel.tsx`;
   - `src/contexts/AuthContext.tsx`;
   - `src/api/client.ts`;
   - `src/api/types.ts`;
   - `src/theme/tokens.ts`;
   - assets do Rattito.
6. Consulte no backend:
   - `modules/recipes/controller/RecipeController.java`;
   - `modules/recipes/dto/RecipeDtos.java`;
   - `modules/cooking/controller/CookingController.java`;
   - `modules/cooking/dto/CookingDtos.java`;
   - `docs/integration-vision.md`.

O código do backend é a fonte de verdade.

---

## 6. Contratos do backend

Todas as rotas abaixo usam:

```http
Authorization: Bearer <accessToken>
```

### 6.1 Receitas

```http
GET /api/v1/recipes
GET /api/v1/recipes/{recipeId}
```

Resumo:

```ts
type RecipeSummary = {
  id: string;
  name: string;
  description: string;
};
```

Detalhe:

```ts
type Ingredient = {
  name: string;
  quantity: string;
};

type RecipeStep = {
  id: string;
  number: number;
  instruction: string;
  visualCheck: string;
  requiresConfirmation: boolean;
};

type Recipe = RecipeSummary & {
  preparationNotes: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
};
```

### 6.2 Sessões

```http
POST /api/v1/cooking-sessions
GET  /api/v1/cooking-sessions?page=0&size=20
GET  /api/v1/cooking-sessions/{sessionId}
POST /api/v1/cooking-sessions/{sessionId}/pause
POST /api/v1/cooking-sessions/{sessionId}/resume
POST /api/v1/cooking-sessions/{sessionId}/cancel
POST /api/v1/cooking-sessions/{sessionId}/confirm-step
```

Iniciar:

```json
{
  "recipeId": "<uuid>"
}
```

Pausar, retomar ou cancelar:

```json
{
  "contextRevision": 0
}
```

Confirmar:

```json
{
  "stepId": "<uuid>",
  "contextRevision": 0,
  "confirmed": true
}
```

Sessão:

```ts
type SessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

type Assessment =
  | 'IN_PROGRESS'
  | 'NEEDS_ADJUSTMENT'
  | 'READY_FOR_CONFIRMATION'
  | 'INCONCLUSIVE';

type Observation = {
  observationId: string;
  stepId: string;
  contextRevision: number;
  capturedAt: string;
  receivedAt: string;
  assessment: Assessment;
  observation: string;
  guidance: string;
};

type CookingSession = {
  sessionId: string;
  recipeId: string;
  recipeName: string;
  status: SessionStatus;
  contextRevision: number;
  currentStep: RecipeStep | null;
  totalSteps: number;
  completedSteps: number;
  confirmations: {
    stepId: string;
    number: number;
    confirmedAt: string;
  }[];
  latestObservation: Observation | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
};
```

Todas as respostas continuam no envelope `{ data, error }`.

---

## 7. Camada de API

Adicionar tipos e funções sem duplicar o cliente HTTP:

```text
src/api/recipes.ts
src/api/cooking.ts
```

Funções mínimas:

- `listRecipes(token)`;
- `getRecipe(token, recipeId)`;
- `listCookingSessions(token)`;
- `startCookingSession(token, recipeId)`;
- `getCookingSession(token, sessionId)`;
- `pauseCookingSession(token, session)`;
- `resumeCookingSession(token, session)`;
- `cancelCookingSession(token, session)`;
- `confirmCurrentStep(token, session)`.

Regras:

- usar sempre token autenticado;
- usar `stepId` e `contextRevision` retornados pela leitura mais recente;
- não guardar revisões antigas em constantes;
- em HTTP 409, recarregar a sessão e explicar que o contexto mudou;
- em HTTP 401, encerrar a autenticação local e voltar ao login;
- não fazer retry automático de mutações;
- impedir duplo envio;
- não criar chamadas diretas ao endpoint reservado ao módulo Python.

---

## 8. Tela de Receitas

Substituir o placeholder da aba Receitas.

### 8.1 Listagem

- Carregar `GET /recipes`.
- Mostrar nome e descrição.
- Tratar loading, vazio, erro e retry.
- Não criar receitas locais se a API falhar.
- Cada item abre o detalhe.

### 8.2 Detalhe

Criar rota autenticada de detalhe com:

- nome;
- descrição;
- notas de preparação;
- ingredientes e quantidades;
- etapas numeradas;
- aviso sobre confirmação humana;
- botão “Iniciar preparo”.

### 8.3 Início e retomada

Antes de criar nova sessão:

1. consultar sessões recentes;
2. procurar sessão `ACTIVE` ou `PAUSED`;
3. se existir, oferecer “Continuar preparo”;
4. não criar sessões duplicadas silenciosamente.

Ao iniciar:

- fazer `POST /cooking-sessions`;
- usar o `sessionId` retornado;
- navegar para a aba/tela do Chef Rattito;
- não presumir sucesso antes da resposta HTTP.

---

## 9. Tela Chef Rattito

Substituir `src/app/(tabs)/assistant.tsx`.

### 9.1 Estados de entrada

#### Sem sessão

- mostrar o mascote;
- explicar que é necessário iniciar uma receita;
- oferecer ação para abrir Receitas;
- não exibir contexto ou orientação fictícia.

#### Sessão ativa

- carregar a sessão escolhida;
- se a tela for aberta diretamente, procurar a sessão `ACTIVE` ou `PAUSED` mais
  recente;
- mostrar contexto com `recipeName`;
- mostrar progresso `completedSteps / totalSteps`;
- mostrar etapa atual;
- iniciar atualização periódica.

#### Sessão concluída ou cancelada

- interromper polling;
- mostrar estado final claro;
- oferecer retorno às receitas;
- não permitir confirmação adicional.

### 9.2 Atualização periódica

Enquanto a tela estiver focada e a sessão não for terminal:

- consultar `GET /cooking-sessions/{id}` aproximadamente a cada 3 segundos;
- nunca iniciar nova consulta enquanto a anterior estiver pendente;
- suspender polling ao perder foco ou ir para background;
- cancelar timer ao desmontar;
- não apagar dados válidos por uma falha transitória;
- mostrar falha de sincronização de forma discreta;
- não fazer polling agressivo.

O polling permite receber `latestObservation` depois que o módulo Python envia a
observação ao backend.

### 9.3 Conteúdo real da orientação

Prioridade da mensagem principal:

1. Se existir `latestObservation.guidance` válido para a revisão/etapa atual,
   mostrar como “Orientação da bancada”.
2. Caso contrário, mostrar `currentStep.instruction`.
3. Mostrar `currentStep.visualCheck` como “Observe”.

Também apresentar o `assessment` com tradução:

- `IN_PROGRESS`: em andamento;
- `NEEDS_ADJUSTMENT`: precisa de ajuste;
- `READY_FOR_CONFIRMATION`: pronto para confirmação;
- `INCONCLUSIVE`: não foi possível concluir.

Não esconder que a observação pode estar ausente. Usar texto como:

> Aguardando a próxima leitura da câmera da bancada.

Uma observação nunca confirma a etapa automaticamente.

### 9.4 Mensagens simuladas

Manter visível o badge “Respostas simuladas” somente para a parte conversacional.

Perguntas rápidas podem incluir:

- “Qual é a etapa atual?”;
- “O que devo observar?”;
- “A câmera detectou algo?”;
- “Posso confirmar a etapa?”.

As respostas devem ser montadas exclusivamente com os dados atuais da sessão:

- etapa;
- `visualCheck`;
- observação;
- orientação;
- status.

Não inventar ingredientes disponíveis, maturação, calorias, substituições ou
segurança alimentar.

Se o usuário perguntar “Quais ingredientes tenho disponíveis?”, responder de forma
honesta que o reconhecimento inicial ainda está em modo demonstração. Não repetir a
lista fictícia do mockup.

### 9.5 Entrada por teclado

O botão de teclado pode abrir um campo de texto.

Regras:

- não enviar texto para backend, Gemini ou serviço externo;
- reconhecer apenas intenções locais simples da demonstração;
- para pergunta desconhecida, orientar o uso das sugestões;
- não manter histórico sensível após sair da tela;
- adaptar layout ao teclado.

### 9.6 Fala simulada

Reconhecimento de fala real está fora do escopo e não deve adicionar dependência
nativa incompatível com Expo Go.

O controle central deve:

- permanecer identificado pelo badge “Respostas simuladas”;
- exibir “Segure para falar — demonstração” ou texto equivalente;
- ao segurar, apresentar somente animação/estado visual;
- ao soltar, selecionar uma pergunta demonstrativa predefinida;
- nunca ativar microfone;
- nunca solicitar permissão de áudio;
- nunca afirmar que áudio foi reconhecido.

### 9.7 Leitura em voz alta

O botão de alto-falante pode usar `expo-speech` para ler a orientação atualmente
visível.

Instalar somente se for implementar:

```powershell
npx expo install expo-speech
```

Regras:

- interromper fala anterior antes de iniciar outra;
- parar fala ao sair da tela;
- desabilitar quando não houver mensagem;
- não registrar áudio;
- falha de TTS não pode impedir o preparo.

Leitura em voz alta é P1. Não atrasar o fluxo P0 por ela.

---

## 10. Controles reais do preparo

Adicionar controles coerentes com a referência, sem comprometer a área
conversacional.

### 10.1 Pausar e retomar

- `ACTIVE`: oferecer “Pausar”.
- `PAUSED`: oferecer “Retomar”.
- usar a revisão atual;
- atualizar a tela com a resposta;
- desabilitar confirmação enquanto pausada.

### 10.2 Confirmar etapa

- mostrar botão explícito “Confirmar etapa”;
- exigir confirmação humana em diálogo;
- enviar `currentStep.id` e `contextRevision` atuais;
- não confirmar a partir de observação da webcam;
- após sucesso, mostrar a próxima etapa retornada;
- na última confirmação, apresentar sessão concluída;
- em conflito, recarregar e não repetir automaticamente.

### 10.3 Cancelar

- ficar em ação secundária;
- exigir confirmação destrutiva;
- usar revisão atual;
- interromper polling após sucesso;
- não reutilizar a sessão cancelada.

### 10.4 Progresso

Mostrar:

- número da etapa atual;
- total de etapas;
- etapas concluídas;
- status traduzido;
- barra ou indicador de progresso.

Não calcular progresso com dados inventados.

---

## 11. Navegação e restauração

- Chef IA continua como aba central.
- Ao iniciar receita, abrir Chef IA com a sessão criada.
- Ao reiniciar o app, localizar sessão ativa/pausada pelo backend.
- Não depender somente de estado em memória para retomar.
- Home “Começar a cozinhar” continua levando para Receitas.
- Perfil/logout e demais tabs permanecem funcionando.
- Rotas privadas exigem token e usuário.
- Evitar empilhar múltiplas instâncias da mesma sessão.

---

## 12. Fundação visual

Reutilizar tokens e componentes existentes.

Preservar da referência:

- fundo grafite;
- cabeçalho com contexto e status;
- badge de simulação;
- mascote central;
- mensagens do assistente com linha verde;
- mensagens do usuário em superfície cinza;
- chips de perguntas;
- CTA verde de fala simulada;
- ação central Chef IA ativa;
- barra inferior;
- tipografia branca/cinza;
- safe areas.

Adicionar controles de preparo sem descaracterizar a tela. Eles podem aparecer:

- em card contextual abaixo da orientação;
- em barra de ações acima das sugestões;
- ou em seção rolável coerente.

Não desenhar relógio, rede ou bateria manualmente.
Não usar emoji como ícone.
Não usar imagens remotas.

---

## 13. Organização esperada

Referência:

```text
src/
├── api/
│   ├── recipes.ts
│   └── cooking.ts
├── app/
│   ├── (tabs)/
│   │   ├── recipes.tsx
│   │   └── assistant.tsx
│   └── recipes/
│       └── [id].tsx
├── components/
│   ├── recipes/
│   └── assistant/
└── hooks/
    └── useCookingSession.ts
```

A estrutura pode variar, mas:

- não colocar polling, todos os handlers e toda a interface em um arquivo gigante;
- não duplicar tipos do backend;
- não duplicar cliente HTTP;
- não criar abstrações sem uso;
- não alterar AuthContext para armazenar sessão culinária permanentemente.

---

## 14. Tratamento de erros

Tratar:

- API indisponível;
- timeout;
- 401;
- 404 de receita/sessão;
- 409 por revisão ou etapa desatualizada;
- lista vazia;
- sessão sem etapa válida;
- falha transitória do polling;
- erro ao iniciar sessão;
- erro ao confirmar;
- falha do TTS;
- mudança de sessão enquanto a tela está aberta.

Mensagens devem ser claras e não expor stack trace, token ou dados internos.

---

## 15. Fora do escopo

Não implementar:

- reconhecimento de fala real;
- gravação de áudio;
- permissão de microfone;
- chat generativo;
- Gemini no aplicativo;
- envio de mensagens livres ao backend;
- alteração do módulo Python;
- upload das fotos da geladeira;
- reconhecimento inicial de ingredientes;
- recomendação personalizada por nutrição;
- WebSocket;
- mudança no backend;
- commit, push, prebuild, EAS ou publicação.

---

## 16. Critérios de aceite

- [x] A referência visual foi analisada.
- [x] Receitas são carregadas do backend.
- [x] Detalhe mostra ingredientes e etapas reais.
- [x] É possível iniciar uma sessão real.
- [x] Sessão ativa/pausada pode ser retomada após reiniciar o app.
- [x] Chef Rattito mostra receita, etapa e progresso reais.
- [x] A tela recebe orientação nova enviada pelo módulo Python ao backend (polling ativo).
- [x] A ausência de observação é comunicada honestamente.
- [x] Polling não sobrepõe requisições e para fora de foco.
- [x] Pausar e retomar funcionam.
- [x] Confirmação humana avança exatamente uma etapa.
- [x] Webcam/observação nunca avança etapa automaticamente.
- [x] Conflito 409 recarrega o contexto sem repetir mutação.
- [x] Última confirmação conclui a sessão.
- [x] Cancelamento exige confirmação.
- [x] Respostas locais estão identificadas como simuladas.
- [x] Perguntas simuladas usam somente dados reais da sessão.
- [x] Nenhum ingrediente disponível é inventado.
- [x] Fala simulada não acessa microfone.
- [x] TTS, se implementado, para ao sair (`expo-speech`).
- [x] Home, tabs, autenticação e logout continuam funcionando.
- [x] `npm run typecheck` termina sem erros.
- [x] `npm run lint` termina sem erros.

---

## 17. Validação final do MVP

### 17.1 Validação técnica

1. Execute `npm run typecheck`.
2. Execute `npm run lint`.
3. Inicie com `npm start`.
4. Confirme compilação no Expo Go Android.

### 17.2 Roteiro integrado do evento

Com backend, PostgreSQL e módulo Python ativos:

1. Entrar no aplicativo.
2. Abrir Receitas.
3. Abrir a receita demonstrativa.
4. Iniciar preparo.
5. Confirmar que o Chef Rattito exibe a primeira etapa.
6. Confirmar que a sessão aparece no backend.
7. Enviar uma observação real ou simulada pelo módulo Python.
8. Ver a orientação atualizar no aplicativo.
9. Pausar e retomar.
10. Confirmar a etapa manualmente.
11. Repetir até concluir a receita.
12. Reiniciar o app durante uma sessão e validar retomada.
13. Testar conflito de revisão sem duplicar confirmação.
14. Testar logout.

### 17.3 Relatório

Ao concluir:

- atualizar status e checklists com resultados verdadeiros;
- separar testes automatizados, Metro, Expo Go e integração física;
- listar arquivos criados e alterados;
- registrar limitações de voz simulada;
- registrar se webcam e Gemini reais foram testados;
- não declarar o MVP físico validado sem completar o roteiro integrado.
