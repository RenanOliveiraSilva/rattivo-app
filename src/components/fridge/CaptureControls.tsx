import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

const galleryIcon = require('@/../assets/images/icons/icon-gallery.png');
const cameraDarkIcon = require('@/../assets/images/icons/icon-camera-dark.png');

interface CaptureControlsProps {
  photoCount: number;
  maxPhotos?: number;
  canAddMore: boolean;
  isCapturing?: boolean;
  onCapture: () => void;
  onPickGallery: () => void;
}

export function CaptureControls({
  photoCount,
  maxPhotos = 3,
  canAddMore,
  isCapturing = false,
  onCapture,
  onPickGallery,
}: CaptureControlsProps) {
  return (
    <View style={styles.container}>
      {/* Linha superior: Galeria | Botão Obturador Central | Contador */}
      <View style={styles.topRow}>
        {/* Botão rápido de Galeria */}
        <TouchableOpacity
          style={styles.gallerySquareButton}
          onPress={onPickGallery}
          activeOpacity={0.8}
          accessibilityLabel="Abrir galeria"
          accessibilityRole="button"
        >
          <Image source={galleryIcon} style={styles.galleryIcon} resizeMode="contain" />
          <Text style={styles.gallerySquareText}>Galeria</Text>
        </TouchableOpacity>

        {/* Obturador Circular Verde com Borda de Foco */}
        <View style={styles.shutterWrapper}>
          <TouchableOpacity
            style={[
              styles.shutterButton,
              (!canAddMore || isCapturing) && styles.shutterButtonDisabled,
            ]}
            onPress={onCapture}
            disabled={!canAddMore || isCapturing}
            activeOpacity={0.7}
            accessibilityLabel="Tirar foto da prateleira"
            accessibilityRole="button"
          >
            {isCapturing ? (
              <ActivityIndicator color={colors.primaryText} size="small" />
            ) : (
              <Image
                source={cameraDarkIcon}
                style={styles.shutterCameraIcon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Contador de fotos (ex: 1/3 fotos) */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterNumber}>{`${photoCount}/${maxPhotos}`}</Text>
          <Text style={styles.counterLabel}>fotos</Text>
        </View>
      </View>

      {/* Linha inferior: Botões duplos "Tirar foto" e "Escolher da galeria" */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            (!canAddMore || isCapturing) && styles.actionButtonDisabled,
          ]}
          onPress={onCapture}
          disabled={!canAddMore || isCapturing}
          activeOpacity={0.8}
          accessibilityLabel="Tirar foto"
          accessibilityRole="button"
        >
          <Image
            source={cameraDarkIcon}
            style={[styles.actionIcon, { tintColor: colors.textPrimary }]}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>Tirar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            !canAddMore && styles.actionButtonDisabled,
          ]}
          onPress={onPickGallery}
          disabled={!canAddMore}
          activeOpacity={0.8}
          accessibilityLabel="Escolher da galeria"
          accessibilityRole="button"
        >
          <Image
            source={galleryIcon}
            style={[styles.actionIcon, { tintColor: colors.textPrimary }]}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>Escolher da galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  gallerySquareButton: {
    width: 62,
    height: 62,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  galleryIcon: {
    width: 22,
    height: 22,
    tintColor: colors.textPrimary,
    marginBottom: 4,
  },
  gallerySquareText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  shutterWrapper: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  shutterButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  shutterButtonDisabled: {
    opacity: 0.45,
    backgroundColor: colors.surfaceCard,
  },
  shutterCameraIcon: {
    width: 28,
    height: 28,
    tintColor: colors.primaryText,
  },
  counterContainer: {
    width: 62,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  counterNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
