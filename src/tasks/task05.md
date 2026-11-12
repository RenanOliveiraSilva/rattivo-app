# Task 05 — Integrar análise real das fotos da geladeira

## 1. Status

**CONCLUÍDO NO CÓDIGO** (Aguardando ensaio físico no aparelho Android)

- [x] Contrato do backend conferido
- [x] Cliente multipart implementado
- [x] Continuação provisória substituída por análise real
- [x] Estados de loading, sucesso, vazio e erro implementados
- [x] Recomendação abre a receita real
- [x] Typecheck e lint aprovados
- [ ] Ensaio físico Android realizado

---

## 2. Objetivo

Adequar o módulo de geladeira que já existe no aplicativo para consumir o novo
endpoint autenticado do backend:

```http
POST /api/v1/fridge-analyses
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

O fluxo deve passar a ser real:

```text
capturar/selecionar de 1 a 3 fotos
        → enviar fotos ao backend
        → mostrar ingredientes estimados
        → mostrar receitas correspondentes
        → abrir o detalhe da receita escolhida
```

Esta task **não cria um novo módulo visual**. Ela preserva e adapta:

- `src/app/fridge-capture.tsx`;
- `src/app/fridge-analysis.tsx`;
- `IngredientPhotosContext`;
- componentes existentes de câmera, miniaturas e controles;
- referência visual e identidade entregues na Task03.

---

## 3. Contexto obrigatório

Antes de alterar código, leia integralmente:

- `AGENTS.md`;
- `README.md`;
- `src/tasks/task03.md`;
- `src/tasks/task04.md`;
- esta task;
- `src/api/client.ts`, `src/api/types.ts` e demais módulos em `src/api`;
- `src/app/fridge-capture.tsx` e `src/app/fridge-analysis.tsx`;
- `src/contexts/IngredientPhotosContext.tsx`;
- `src/types/ingredient-photo.ts`;
- `src/contexts/AuthContext.tsx`;
- `src/app/recipes/[id].tsx`;
- referência `src/tasks/references/task03-fridge-capture.png`.

Confira no backend as Tasks 07–09 e o contrato real de
`POST /api/v1/fridge-analyses`. Não invente campos ou outro endpoint.

Antes do ensaio, o backend deve ser reiniciado normalmente na porta 8080 com:

```text
GEMINI_API_KEY configurada somente no backend
GEMINI_MODEL configurado
GEMINI_TIMEOUT_SECONDS configurado
```

O app continua usando somente:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.19:8080
```

Nunca colocar chave Gemini ou segredo em variável `EXPO_PUBLIC_*`.

---

## 4. Arquitetura obrigatória

O fluxo da geladeira é:

```text
câmera/galeria do celular
        → aplicativo Expo envia multipart
        → backend Java chama Gemini
        → backend faz matching com receitas
        → aplicativo renderiza o resultado
```

O módulo Python `rattivo-vision` e a webcam do notebook **não participam** deste
fluxo. Não importar, chamar ou duplicar código daquele módulo.

O backend é responsável por:

- chamar Gemini;
- validar os resultados da IA;
- cruzar ingredientes com receitas;
- devolver advertências e recomendações.

O app apenas captura, envia e apresenta a resposta.

---

## 5. Contrato do backend

### 5.1 Requisição

Enviar `multipart/form-data` com a mesma chave repetida para cada arquivo:

```text
photos=<foto 1>
photos=<foto 2 opcional>
photos=<foto 3 opcional>
```

Regras do backend:

- mínimo de 1 e máximo de 3 fotos;
- JPEG, PNG ou WebP;
- até 5 MiB por foto;
- até 12 MiB somados;
- token JWT obrigatório;
- processamento síncrono;
- fotos não são persistidas pelo backend.

Não definir manualmente o header `Content-Type` do multipart. O `fetch` deve gerar
o `boundary`. Definir manualmente `multipart/form-data` sem boundary quebra o upload.

### 5.2 Resposta

Adicionar os tipos equivalentes em `src/api/types.ts`:

```ts
export type IngredientConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DetectedFridgeIngredient {
  name: string;
  confidence: IngredientConfidence;
}

export interface FridgeRecipeRecommendation {
  recipeId: string;
  name: string;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}

export interface FridgeAnalysisView {
  ingredients: DetectedFridgeIngredient[];
  recommendations: FridgeRecipeRecommendation[];
  warnings: string[];
}
```

Resposta no envelope padrão:

```json
{
  "data": {
    "ingredients": [
      {"name": "Banana madura", "confidence": "HIGH"},
      {"name": "Ovos", "confidence": "MEDIUM"}
    ],
    "recommendations": [
      {
        "recipeId": "b7f0d5b4-6f9a-4bce-8e72-01d1c3ba2600",
        "name": "Panqueca de banana e ovo",
        "matchedIngredients": ["Banana madura", "Ovos"],
        "missingIngredients": ["Óleo"],
        "matchPercentage": 67
      }
    ],
    "warnings": [
      "O reconhecimento é uma estimativa e deve ser revisado pelo usuário.",
      "Itens ocultos ou dentro de embalagens podem não ser identificados."
    ]
  },
  "error": null
}
```

Não reinterpretar o percentual como compatibilidade nutricional ou segurança.
Ele representa somente presença de ingredientes cadastrados.

---

## 6. Cliente HTTP e multipart

### 6.1 Evoluir `apiRequest` sem quebrar JSON

O cliente atual sempre:

- define `Content-Type: application/json`;
- aplica `JSON.stringify` ao body.

Adequá-lo para aceitar também `FormData`:

- requests JSON existentes continuam exatamente como estão;
- se `body instanceof FormData`, enviar o objeto diretamente;
- nesse caso, não definir `Content-Type` automaticamente;
- preservar `Accept: application/json`;
- preservar Authorization, timeout, envelope e `ApiClientError`;
- não duplicar em `fridge.ts` todo o tratamento já existente no cliente;
- não registrar body, token, URI das fotos ou resposta sensível.

O tipo `RequestOptions.body` deve continuar aceitando JSON e passar a aceitar
`FormData` explicitamente.

### 6.2 Criar API da geladeira

Criar `src/api/fridge.ts` com função semelhante a:

```ts
analyzeFridgePhotos(
  token: string,
  photos: SelectedIngredientPhoto[]
): Promise<FridgeAnalysisView>
```

Responsabilidades:

1. Validar localmente 1–3 fotos.
2. Criar um `FormData`.
3. Anexar cada foto na chave `photos`.
4. Usar nome seguro gerado localmente, sem enviar caminho como nome.
5. Enviar `uri`, `name` e MIME type no formato esperado pelo React Native.
6. Usar timeout de análise maior que o padrão, inicialmente 30 segundos.
7. Retornar somente `FridgeAnalysisView` desembrulhado pelo cliente comum.

Centralize o cast específico do arquivo React Native neste módulo. Não espalhar
`as any` pelas telas.

---

## 7. Metadados e formatos das fotos

Evoluir `SelectedIngredientPhoto` somente com metadados necessários:

```ts
mimeType?: string;
fileName?: string;
fileSize?: number;
```

Ao capturar pela câmera:

- registrar `image/jpeg`;
- usar qualidade equilibrada para reduzir risco de ultrapassar 5 MiB;
- considerar `quality: 0.6` para o MVP Android;
- preservar orientação correta; não usar opção que cause rotação incorreta apenas
  para ganhar velocidade.

Ao selecionar da galeria:

- aproveitar `mimeType`, `fileName` e `fileSize` retornados pelo ImagePicker;
- aceitar localmente apenas JPEG, PNG e WebP;
- quando MIME estiver ausente, inferir somente de extensões conhecidas;
- se continuar desconhecido ou for HEIC/GIF, mostrar erro claro e não enviar;
- se `fileSize` conhecido ultrapassar 5 MiB, rejeitar antes da rede;
- o backend continua sendo a autoridade final dos limites.

Não transformar as fotos em Base64 no aplicativo.

---

## 8. Adequar a tela de captura existente

Preservar composição e componentes da Task03. Alterar somente o necessário:

- manter câmera, galeria, miniaturas, remoção e limite de três;
- manter o CTA “Analisar foto”;
- manter o CTA desabilitado sem fotos;
- remover textos que afirmem que a análise será integrada futuramente;
- substituir “modo demonstração” por linguagem coerente com análise real, sem
  afirmar precisão garantida;
- ao tocar no CTA, navegar uma única vez para `/fridge-analysis`;
- não iniciar upload duplicado na tela de captura;
- impedir toque repetido durante a transição;
- não limpar fotos ao navegar para a análise.

O upload deve acontecer na tela de análise, permitindo loading, retry e retorno
para ajustar as fotos no mesmo fluxo existente.

---

## 9. Substituir a continuação provisória

Adequar `src/app/fridge-analysis.tsx`; não criar outra rota concorrente.

### 9.1 Proteção e entrada

- Exigir `token` e usuário autenticado.
- Se não autenticado, redirecionar ao login.
- Se não houver fotos, mostrar estado vazio com ação para voltar à captura.
- Não iniciar requisição com zero fotos.
- Disparar uma única análise ao entrar na tela.
- Proteger contra execução duplicada por re-render ou mudança de foco.
- Ignorar atualização de estado após desmontagem.

### 9.2 Loading real

Enquanto o backend analisa:

- manter miniaturas/resumo das fotos;
- mostrar `ActivityIndicator`;
- usar texto como “Analisando ingredientes visíveis...”;
- informar que pode levar alguns segundos;
- desabilitar ações que iniciariam outra requisição;
- não exibir ingredientes ou receitas fictícias;
- não limpar as fotos.

### 9.3 Sucesso

Exibir:

1. Título “Ingredientes identificados”.
2. Lista retornada pelo backend.
3. Confiança traduzida somente para exibição:
   - `HIGH` → “Confiança alta”;
   - `MEDIUM` → “Confiança média”;
   - `LOW` → “Confiança baixa”.
4. Título “Receitas que combinam com os itens visíveis”.
5. Cards das recomendações em ordem recebida.
6. Ingredientes encontrados.
7. Ingredientes ausentes.
8. Percentual descrito como “correspondência por ingredientes”.
9. Advertências retornadas pelo backend.

Não alterar, completar ou esconder as listas retornadas.

Se `ingredients` estiver vazio:

- mostrar que nenhum ingrediente do catálogo foi identificado com segurança;
- sugerir melhor iluminação, enquadramento e retirada de embalagens fechadas;
- permitir tentar novamente com as mesmas fotos ou ajustá-las;
- não inventar resultado.

Se não houver recomendações, mas houver ingredientes:

- mostrar os ingredientes;
- informar que nenhuma receita atual corresponde aos itens visíveis;
- permitir voltar à lista geral de receitas ou ajustar fotos.

### 9.4 Abrir receita

Cada recomendação deve oferecer “Ver receita”:

```ts
router.push(`/recipes/${recommendation.recipeId}`)
```

Antes de sair definitivamente para a receita, limpar as referências locais das
fotos. Não iniciar sessão de preparo automaticamente.

### 9.5 Ações de saída

- “Ajustar fotos”: voltar para `fridge-capture` sem limpar as fotos.
- “Nova análise”/“Tentar novamente”: repetir conscientemente a chamada, sem loop.
- “Voltar ao início”: limpar fotos e substituir a rota pela Home.
- Ao logout, o fluxo não deve conservar fotos nem resultado autenticado.

---

## 10. Tratamento de erros

Usar `ApiClientError` e tratar pelo menos:

- `401`: executar logout e voltar ao login;
- `400 INVALID_REQUEST`: informar que uma ou mais fotos são inválidas;
- `413 PAYLOAD_TOO_LARGE`: pedir fotos menores ou menos fotos;
- `502 AI_INVALID_RESPONSE`: informar que a análise não pôde ser interpretada;
- `503 AI_UNAVAILABLE`: informar indisponibilidade temporária;
- `504 AI_TIMEOUT` e `TIMEOUT`: informar demora excessiva e permitir retry;
- `NETWORK_ERROR`: orientar a conferir backend e Wi-Fi;
- erro desconhecido: mensagem genérica, sem detalhe interno.

Em qualquer erro recuperável:

- preservar as fotos;
- mostrar “Tentar novamente”;
- permitir “Ajustar fotos”;
- impedir retry concorrente;
- não mostrar resposta parcial antiga como se fosse atual.

---

## 11. Privacidade e segurança

- Nunca registrar token, `FormData`, URI, nome original ou resposta completa.
- Não persistir fotos no SecureStore, AsyncStorage ou filesystem adicional.
- Não salvar automaticamente fotos capturadas na galeria.
- Não enviar fotos ao Python, webcam ou diretamente ao Gemini.
- Não adicionar `GEMINI_API_KEY` ao app.
- Não colocar fotos/Base64 em parâmetros de rota.
- Limpar o resultado ao começar uma nova tentativa.
- Limpar referências ao concluir ou abandonar definitivamente o fluxo.
- Manter as advertências de que a análise é estimada.

---

## 12. Organização esperada

Reutilizar a estrutura atual e adicionar apenas o necessário:

```text
src/
├── api/
│   ├── client.ts                  # suporte JSON + FormData
│   ├── fridge.ts                  # novo cliente específico
│   └── types.ts                   # novos DTOs
├── app/
│   ├── fridge-capture.tsx         # pequenas adequações
│   └── fridge-analysis.tsx        # substituir conteúdo provisório
├── contexts/
│   └── IngredientPhotosContext.tsx
└── types/
    └── ingredient-photo.ts        # metadados opcionais
```

Se a tela de resultado ficar excessivamente grande, extrair componentes específicos
para `src/components/fridge`, preservando a responsabilidade da rota. Não criar
abstrações genéricas prematuras.

---

## 13. Fora do escopo

Não implementar nesta task:

- alterações no backend;
- alterações no módulo Python Vision;
- chamadas diretas ao Gemini;
- persistência ou histórico de análises;
- edição/confirmação individual dos ingredientes;
- geração livre de receitas;
- perfil, alergias, restrições ou nutrição;
- upload em background;
- fila, polling ou WebSocket;
- câmera do notebook;
- mudança da Home, tabs, login ou preparo guiado fora do necessário;
- nova dependência sem necessidade demonstrada;
- commit, push, EAS, prebuild ou publicação.

---

## 14. Critérios de aceite

- [x] O módulo existente foi adaptado, não duplicado.
- [x] Captura e galeria continuam funcionando.
- [x] Uma a três fotos são enviadas na chave multipart `photos`.
- [x] `Content-Type` multipart não é definido manualmente.
- [x] Requests JSON existentes continuam funcionando.
- [x] Token Bearer é enviado ao backend.
- [x] Nenhuma chave Gemini existe no app.
- [x] Loading representa uma requisição real.
- [x] Retry não dispara chamadas concorrentes.
- [x] Ingredientes e confiança vêm da resposta real.
- [x] Recomendações, encontrados, ausentes e percentual são exibidos.
- [x] “Ver receita” abre `/recipes/{recipeId}`.
- [x] Estado vazio não inventa ingredientes.
- [x] Erros 400, 401, 413, 502, 503, 504, timeout e rede são tratados.
- [x] Fotos são preservadas para retry/ajuste e limpas na saída definitiva.
- [x] Nenhuma URI, token ou foto é registrada.
- [x] Home, autenticação, catálogo e preparo guiado continuam funcionando.
- [x] `npm run typecheck` termina sem erros.
- [x] `npm run lint` termina sem erros.
- [x] Metro compila sem erro.
- [ ] Teste físico Android identifica banana/ovos e recomenda a panqueca quando o
      backend devolver essa correspondência (pendente de ensaio no aparelho).

---

## 15. Roteiro de validação física

1. Reiniciar o backend na porta 8080 com Java 21 e variáveis Gemini carregadas.
2. Confirmar `GET http://192.168.1.19:8080/actuator/health` pelo celular/rede.
3. Iniciar Expo com cache limpo.
4. Entrar no app com conta válida.
5. Abrir “Explorar minha geladeira”.
6. Fotografar banana e ovos com boa iluminação.
7. Tocar “Analisar foto”.
8. Confirmar loading real sem duplicação.
9. Confirmar ingredientes retornados, níveis de confiança e advertências.
10. Confirmar panqueca em primeiro lugar quando banana/ovos forem identificados.
11. Abrir “Ver receita” e validar o detalhe real.
12. Repetir com imagem sem ingredientes conhecidos e validar estado vazio.
13. Desligar temporariamente o backend e validar erro de rede/retry.
14. Confirmar que fotos são descartadas ao voltar definitivamente para a Home.

Não afirmar acurácia geral com base nesse ensaio. Registrar exatamente o que foi
identificado e qualquer limitação observada.

---

## 16. Relatório final obrigatório

Ao concluir, atualizar status e checklist desta task e informar:

- arquivos criados e alterados;
- como FormData foi integrado sem quebrar JSON;
- mapeamento de MIME type no Android;
- estados de loading, sucesso, vazio e erro;
- comportamento de retry e limpeza das fotos;
- resultados de typecheck, lint e Metro;
- resultado real do teste Android;
- limitações observadas;
- confirmação de que nenhuma chave, foto ou token foi versionado.

