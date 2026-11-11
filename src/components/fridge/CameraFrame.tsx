import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, PermissionResponse } from 'expo-camera';
import { colors, radius, spacing } from '@/theme/tokens';

export interface CameraFrameProps {
  cameraRef: React.RefObject<CameraView | null>;
  permission: PermissionResponse | null;
  requestPermission: () => Promise<PermissionResponse>;
  isCameraActive: boolean;
  canAddMore: boolean;
}

export const CameraFrame: React.FC<CameraFrameProps> = ({
  cameraRef,
  permission,
  requestPermission,
  isCameraActive,
  canAddMore,
}) => {
  // 1. Permissão carregando
  if (!permission) {
    return (
      <View style={styles.frameContainer}>
        <View style={styles.permissionBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.permissionDescription}>Verificando permissões da câmera...</Text>
        </View>
      </View>
    );
  }

  // 2. Permissão não concedida
  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain;

    return (
      <View style={styles.frameContainer}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>Acesso à Câmera</Text>
          <Text style={styles.permissionDescription}>
            O Rattivo precisa da câmera para fotografar as prateleiras e gavetas da sua geladeira.
          </Text>

          {canAskAgain ? (
            <Pressable
              onPress={requestPermission}
              style={styles.permissionButton}
              accessibilityRole="button"
              accessibilityLabel="Permitir acesso à câmera"
            >
              <Text style={styles.permissionButtonText}>Permitir Câmera</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => Linking.openSettings()}
              style={styles.permissionButton}
              accessibilityRole="button"
              accessibilityLabel="Abrir configurações do aparelho para conceder permissão"
            >
              <Text style={styles.permissionButtonText}>Abrir Configurações</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.frameContainer}>
      <View style={styles.cameraClipWrapper}>
        {isCameraActive ? (
          <CameraView
            ref={cameraRef}
            style={styles.cameraView}
            facing="back"
            mode="picture"
          />
        ) : (
          <View style={styles.cameraInactiveBox}>
            <Text style={styles.cameraInactiveText}>Câmera pausada</Text>
          </View>
        )}

        {/* Overlay com Cantos de Enquadramento Verde-Limão */}
        <View style={styles.overlayContainer} pointerEvents="none">
          {/* Canto superior esquerdo */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          {/* Canto superior direito */}
          <View style={[styles.corner, styles.cornerTopRight]} />
          {/* Canto inferior esquerdo */}
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          {/* Canto inferior direito */}
          <View style={[styles.corner, styles.cornerBottomRight]} />

          {/* Rótulo de sugestão de enquadramento (modo demonstração) */}
          <View style={styles.drawerBadge}>
            <Text style={styles.drawerBadgeIcon}>⛶</Text>
            <Text style={styles.drawerBadgeText}>Gaveta de legumes</Text>
          </View>
        </View>

        {/* Banner discreto quando atinge 3 fotos */}
        {!canAddMore && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitBannerText}>
              Limite de 3 fotos atingido. Remova uma foto abaixo para capturar outra.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 3.5;

const styles = StyleSheet.create({
  frameContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cameraClipWrapper: {
    width: '100%',
    height: 380,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: '#151913',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  cameraInactiveBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131612',
  },
  cameraInactiveText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  permissionBox: {
    width: '100%',
    height: 320,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  permissionDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.primary,
  },
  cornerTopLeft: {
    top: 18,
    left: 18,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 18,
    right: 18,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 18,
    left: 18,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 18,
    right: 18,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 8,
  },
  drawerBadge: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 22, 17, 0.75)',
    borderColor: 'rgba(167, 226, 46, 0.3)',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 6,
  },
  drawerBadgeIcon: {
    color: colors.primary,
    fontSize: 13,
  },
  drawerBadgeText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  limitBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 24, 19, 0.92)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  limitBannerText: {
    color: colors.statusWarning,
    fontSize: 12,
    textAlign: 'center',
  },
});
