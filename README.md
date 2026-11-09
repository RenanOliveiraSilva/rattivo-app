# Rattivo App

Aplicativo Android do Rattivo para o fluxo demonstrativo do CODITEC 2026.

## Stack

- Expo SDK 58
- React Native 0.88
- Expo Router
- TypeScript
- Expo SecureStore para o access token em Android/iOS

## Configuração

Copie o exemplo:

~~~powershell
Copy-Item .env.example .env
~~~

Edite EXPO_PUBLIC_API_URL com o endereço do computador que executa o backend:

~~~dotenv
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
~~~

Não use localhost no celular físico e não acrescente /api/v1. O token é obtido no
login e armazenado pelo app; nenhum segredo JWT ou Gemini pertence ao aplicativo.

## Executar

~~~powershell
npm install
npm start
~~~

Leia o QR Code com o Expo Go compatível com SDK 58. Celular e computador devem estar
na mesma rede. Antes, confira http://IP_DO_BACKEND:8080/actuator/health.

## Verificação

~~~powershell
npm run typecheck
npm run lint
~~~

O teste físico completo com backend, módulo Python, webcam e Gemini está planejado
para 10/11/2026.

