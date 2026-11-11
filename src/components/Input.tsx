import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecured = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isSecured}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={colors.primary}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Ver senha'}
          >
            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        )}
      </View>

      {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
    height: 54,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.surfaceInputHover,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
});

