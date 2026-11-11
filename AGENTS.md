# Rattivo App — instruções para agentes

## Forma de trabalho

- Trabalhe em português do Brasil.
- Antes de alterar código, leia este arquivo, o `README.md` e a task indicada em
  `src/tasks`.
- Implemente somente uma task por vez e respeite rigorosamente o escopo e os itens
  marcados como fora do escopo.
- Não antecipe telas, fluxos ou abstrações pertencentes a tasks futuras.
- Ao concluir, atualize o status e o checklist da própria task e relate arquivos
  alterados, decisões e verificações executadas.
- Não faça commit, push, build EAS ou publicação sem solicitação explícita.

## Referências visuais

- Quando a task for acompanhada por imagens de design, inspecione todas as imagens
  antes de implementar a interface.
- Considere a imagem a fonte de verdade para composição, hierarquia, identidade,
  conteúdo, proporções, estados e relações entre elementos.
- Como uma imagem rasterizada não fornece necessariamente medidas, fontes ou cores
  exatas, faça aproximações coerentes e reutilizáveis. Não afirme ter extraído
  valores exatos quando isso não for possível.
- Registre cores, tipografia, espaçamentos, raios e sombras adotados como tokens,
  mantendo consistência entre as telas.
- Reutilize tokens e componentes comuns quando houver repetição visual.
- Se a imagem obrigatória não estiver anexada, não puder ser visualizada ou estiver
  ilegível, registre o bloqueio e solicite uma referência utilizável.
- Quando a própria task declarar explicitamente que uma tela ainda não possui
  design, derive essa tela da identidade, dos tokens e dos componentes observados
  nas imagens de referência. Não crie uma linguagem visual paralela.
- Quando a task definir imagens anexadas como fonte visual, não dependa de ferramenta
  externa de design para começar.

## Regras técnicas

- Stack: Expo SDK 58, React Native, Expo Router e TypeScript estrito.
- Android e Expo Go são a prioridade do MVP, sem quebrar a execução web básica.
- O backend é a autoridade para usuário, receita, sessão, progresso e observações.
- A variável `EXPO_PUBLIC_API_URL` contém somente a origem do backend, sem
  `/api/v1`.
- Trate a resposta padrão do backend como `{ data, error }`.
- Armazene o access token com Expo SecureStore em Android/iOS. Nunca registre
  senha, token ou corpo sensível em logs.
- Nunca coloque `JWT_SECRET`, senha, chave Gemini ou outro segredo no app ou em
  variável `EXPO_PUBLIC_*`.
- Não invente dados quando a API falhar.
- Preserve acessibilidade básica, estados de carregamento, erro, vazio e ação
  desabilitada.
- Use aliases `@/*` já configurados no TypeScript.
- Execute `npm run typecheck` e `npm run lint` após alterações relevantes.

## Regras do preparo guiado

- Nas futuras mutações de sessão, use sempre `contextRevision` e `stepId`
  retornados pelo backend.
- Uma observação visual nunca confirma nem avança uma etapa.
- O avanço da receita exige confirmação explícita do usuário.

