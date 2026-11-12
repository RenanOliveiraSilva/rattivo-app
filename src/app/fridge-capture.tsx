import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing } from '@/theme/tokens';
import { useIngredientPhotos } from '@/contexts/IngredientPhotosContext';
import { FridgeHeader } from '@/components/fridge/FridgeHeader';
import { CameraFrame } from '@/components/fridge/CameraFrame';
import { PhotoThumbnail } from '@/components/fridge/PhotoThumbnail';
import { CaptureControls } from '@/components/fridge/CaptureControls';

export default function FridgeCaptureScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView>(null);

  const [isFocused, setIsFocused] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => setIsFocused(true));
    const unsubscribeBlur = navigation.addListener('blur', () => setIsFocused(false));
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const {
    photos,
    addPhoto,
    removePhoto,
    clearPhotos,
    canAddMore,
    photoCount,
  } = useIngredientPhotos();

  // 1. Capturar foto via câmera nativa
  const handleCapture = async () => {
    if (!canAddMore) {
      Alert.alert(
        'Limite de 3 fotos',
        'Você já atingiu o limite máximo de 3 fotos. Remova uma foto para adicionar outra.'
      );
      return;
    }

    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(
          'Permissão necessária',
          'Conceda acesso à câmera nas configurações do aparelho para tirar fotos.'
        );
        return;
      }
    }

    if (!cameraRef.current || isCapturing) {
      return;
    }

    try {
      setIsCapturing(true);
      const picture = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        skipProcessing: false,
      });

      if (picture?.uri) {
        addPhoto({
          uri: picture.uri,
          width: picture.width,
          height: picture.height,
          timestamp: Date.now(),
          source: 'camera',
          mimeType: 'image/jpeg',
          fileName: `camera_${Date.now()}.jpg`,
        });
      }
    } catch {
      Alert.alert(
        'Erro na captura',
        'Não foi possível registrar a foto. Tente novamente ou use a galeria.'
      );
    } finally {
      setIsCapturing(false);
    }
  };

  // 2. Escolher foto(s) da galeria
  const handlePickGallery = async () => {
    if (!canAddMore) {
      Alert.alert(
        'Limite de 3 fotos',
        'Você já selecionou 3 fotos. Remova uma foto abaixo para adicionar outra.'
      );
      return;
    }

    try {
      const remainingSlots = 3 - photoCount;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        let rejectedFormat = false;
        let rejectedSize = false;

        result.assets.slice(0, remainingSlots).forEach((asset) => {
          const mime = (asset.mimeType || '').toLowerCase();
          const uri = (asset.uri || '').toLowerCase();

          // Rejeita formatos não suportados
          if (mime.includes('gif') || uri.endsWith('.gif') || mime.includes('heic') || uri.endsWith('.heic')) {
            rejectedFormat = true;
            return;
          }

          // Rejeita se ultrapassar 5 MiB
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            rejectedSize = true;
            return;
          }

          addPhoto({
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            timestamp: Date.now(),
            source: 'gallery',
            mimeType: asset.mimeType || (uri.endsWith('.png') ? 'image/png' : uri.endsWith('.webp') ? 'image/webp' : 'image/jpeg'),
            fileName: asset.fileName || `gallery_${Date.now()}.jpg`,
            fileSize: asset.fileSize,
          });
        });

        if (rejectedFormat) {
          Alert.alert(
            'Formato não suportado',
            'Uma ou mais fotos selecionadas não são suportadas. Use apenas JPEG, PNG ou WebP.'
          );
        } else if (rejectedSize) {
          Alert.alert(
            'Arquivo muito grande',
            'Uma ou mais fotos selecionadas ultrapassam o limite de 5 MiB.'
          );
        }
      }
    } catch {
      Alert.alert(
        'Erro na galeria',
        'Não foi possível acessar a galeria de imagens do aparelho.'
      );
    }
  };

  // 3. Avançar para análise real
  const handleAnalyze = () => {
    if (isNavigating) return;

    if (photoCount === 0) {
      Alert.alert(
        'Nenhuma foto capturada',
        'Tire ao menos 1 foto da sua geladeira antes de prosseguir com a análise.'
      );
      return;
    }

    setIsNavigating(true);
    router.push('/fridge-analysis');
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const hasPhotos = photoCount > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      <FridgeHeader hasPhotos={hasPhotos} onClearPhotos={clearPhotos} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visor da Câmera com Cantos de Enquadramento */}
        <CameraFrame
          cameraRef={cameraRef}
          permission={permission}
          requestPermission={requestPermission}
          isCameraActive={isFocused}
          canAddMore={canAddMore}
        />

        {/* Miniaturas das fotos capturadas (1..3) */}
        <PhotoThumbnail
          photos={photos}
          onRemovePhoto={removePhoto}
          canAddMore={canAddMore}
        />

        {/* Controles de Captura: Galeria | Obturador | Contador e Botões Duplos */}
        <CaptureControls
          photoCount={photoCount}
          maxPhotos={3}
          canAddMore={canAddMore}
          isCapturing={isCapturing}
          onCapture={handleCapture}
          onPickGallery={handlePickGallery}
        />

        {/* Botão Principal CTA: Analisar foto */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              (!hasPhotos || isNavigating) && styles.ctaButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!hasPhotos || isNavigating}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Analisar fotos da geladeira"
          >
            <Text style={[styles.ctaSparkle, (!hasPhotos || isNavigating) && styles.ctaTextDisabled]}>✦</Text>
            <Text style={[styles.ctaText, (!hasPhotos || isNavigating) && styles.ctaTextDisabled]}>
              Analisar foto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nota informativa de rodapé */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeIcon}>ⓘ</Text>
          <Text style={styles.noticeText}>
            Identificamos somente ingredientes visíveis nas fotos. Itens atrás de outros ou
            dentro de embalagens fechadas podem não aparecer.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  ctaWrapper: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonDisabled: {
    backgroundColor: '#1C2219',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaSparkle: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 16,
  },
  ctaTextDisabled: {
    color: '#556350',
  },
  noticeContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: 8,
    alignItems: 'flex-start',
  },
  noticeIcon: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
