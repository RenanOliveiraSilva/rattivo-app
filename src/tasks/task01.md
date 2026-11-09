# Task01 — base do aplicativo do evento

Status: em implementação, autorizada em 09/11/2026.

## Objetivo

Criar a base Android do Rattivo para consumir o backend concluído e permitir o fluxo
cadastro/login → home → receita → preparo guiado.

## Escopo

- Expo SDK 58, Expo Router e TypeScript estrito.
- Configuração externa da URL da API.
- Armazenamento seguro do JWT no dispositivo.
- Cadastro, login, logout e restauração da sessão.
- Home com receitas e sessões recentes.
- Detalhe da receita e início do preparo.
- Tela de preparo com polling, orientação do Rattito, pausa, retomada, cancelamento
  e confirmação humana da etapa.
- Estados de carregamento, vazio e erro.

## Fora do escopo

Webcam no celular, Gemini no app, recomendação, fotografia de ingredientes, perfil
nutricional, voz, notificações, WebSocket, publicação e identidade visual definitiva.

## Aceite

- TypeScript e lint aprovados.
- Nenhum segredo ou token real versionado.
- O app inicia mesmo sem backend e explica como configurar a URL.
- Contratos de DTO correspondem ao backend atual.
- Teste integrado em dispositivo fica registrado como pendente até 10/11.

