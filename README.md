# Rattivo App

Aplicativo Android do Rattivo para o fluxo demonstrativo do CODITEC 2026.

O aplicativo evolui por instruções versionadas em `src/tasks`, implementadas uma
por vez.

## Stack

- Expo SDK 58
- React Native 0.88
- Expo Router
- TypeScript estrito
- Expo SecureStore

## Preparar o ambiente

```powershell
npm install
Copy-Item .env.example .env
```

No arquivo `.env`, use o IP do computador que executa o backend:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.19:8080
```

Em celular físico não use `localhost` e não acrescente `/api/v1`. Celular e
computador devem estar na mesma rede.

## Executar a base

```powershell
npm start
```

Leia o QR Code com o Expo Go compatível com SDK 58.

## Verificações

```powershell
npm run typecheck
npm run lint
```

## Desenvolvimento por tasks

1. Abra a task correspondente em `src/tasks`.
2. Confirme que as referências visuais e demais insumos da task estão disponíveis.
3. Entregue a task inteira antes de iniciar a seguinte.

- `task01.md`: onboarding e autenticação — concluída.
- `task02.md`: Home autenticada e navegação principal — concluída.
- `task03.md`: captura de fotos da geladeira — concluída no código; teste físico pendente.
- `task04.md`: receitas e preparo guiado com Chef Rattito — concluída no código; ensaio integrado realizado.
- `task05.md`: integrar o módulo existente de fotos da geladeira ao endpoint real — planejada.

