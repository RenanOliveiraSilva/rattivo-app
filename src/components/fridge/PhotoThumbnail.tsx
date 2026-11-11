import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import { SelectedIngredientPhoto } from '@/types/ingredient-photo';

export interface PhotoThumbnailProps {
  photos: SelectedIngredientPhoto[];
  onRemovePhoto: (id: string) => void;
  canAddMore: boolean;
}

export const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
  photos,
  onRemovePhoto,
  canAddMore,
}) => {
  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Tire até 3 fotos da geladeira (prateleiras, gavetas ou porta)
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map((photo, index) => (
          <View key={photo.id} style={styles.thumbWrapper}>
            <Image source={{ uri: photo.uri }} style={styles.thumbImage} />

            {/* Badge numérico */}
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>

            {/* Botão de remoção */}
            <Pressable
              onPress={() => onRemovePhoto(photo.id)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Remover foto ${index + 1}`}
            >
              <Image
                source={require('@/../assets/images/icons/icon-close.png')}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        ))}

        {canAddMore && (
          <View style={styles.addMorePrompt}>
            <Text style={styles.addMoreText}>+ adicione outra prateleira</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const THUMB_SIZE = 68;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 226, 46, 0.4)',
    backgroundColor: '#1C201A',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md - 2,
  },
  indexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(18, 22, 17, 0.85)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  indexText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E2519',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonPressed: {
    backgroundColor: '#384332',
    transform: [{ scale: 0.9 }],
  },
  closeIcon: {
    width: 10,
    height: 10,
  },
  addMorePrompt: {
    justifyContent: 'center',
    paddingLeft: 4,
  },
  addMoreText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});

