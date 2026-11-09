# Rattivo App — instruções

- Trabalhar em português do Brasil e manter textos visíveis claros.
- Stack: Expo SDK 58, React Native, Expo Router e TypeScript estrito.
- Android é a plataforma prioritária do MVP; preservar compatibilidade com Expo Go.
- O backend é a autoridade para usuário, receita, sessão, progresso e observações.
- Nunca colocar JWT_SECRET, senha, chave Gemini ou token real no código/variáveis públicas.
- EXPO_PUBLIC_API_URL contém somente a URL do backend e nunca deve incluir /api/v1.
- Guardar o access token no SecureStore em Android/iOS. Não registrar token ou senha.
- Tratar respostas no envelope { data, error }; não inventar dados quando a API falhar.
- Usar contextRevision e stepId retornados pelo backend nas mutações de sessão.
- A orientação visual não confirma nem avança etapas; confirmação é sempre explícita.
- Manter a base pequena para o evento: acesso, home, receita e preparo guiado.
- Executar npm run typecheck e npm run lint após alterações relevantes.
- Não fazer commit, push, build EAS ou publicação sem solicitação.

