/**
 * Tokens de design extraídos diretamente da identidade visual do Rattivo
 * obtidos a partir dos frames de onboarding e referências oficiais.
 */

export const colors = {
  // Fundo principal grafite/preto orgânico
  background: '#161815',
  backgroundSubtle: '#111310',

  // Superfícies e cards escuros
  surface: '#1C201A',
  surfaceCard: '#1E231C',
  surfaceInput: '#181B16',
  surfaceInputHover: '#20251E',

  // Bordas sutis
  border: '#2E3628',
  borderInput: '#2A3224',
  borderFocused: '#A7E22E',

  // Verde-limão vibrante de ação (CTA) e progresso
  primary: '#A7E22E',
  primaryPressed: '#92C922',
  primaryText: '#0F1208',

  // Badges de contexto verde-oliva
  badgeBg: '#273118',
  badgeBorder: 'rgba(167, 226, 46, 0.22)',
  badgeIcon: '#A7E22E',

  // Tipografia e textos
  textPrimary: '#FFFFFF',
  textSecondary: '#9EA3A8',
  textMuted: '#686F66',
  textPlaceholder: '#565D54',

  // Botão secundário escuro (ex: Voltar)
  buttonSecondaryBg: '#1C201A',
  buttonSecondaryBorder: '#2E3628',
  buttonSecondaryText: '#FFFFFF',

  // Feedback de erro e estados
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  errorBorder: 'rgba(239, 68, 68, 0.35)',
  success: '#22C55E',

  // Indicador de progresso
  dotInactive: '#2E3628',
  dotActive: '#A7E22E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  input: 14,
  badge: 16,
  button: 18,
  card: 20,
  full: 9999,
} as const;

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  kicker: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
} as const;

