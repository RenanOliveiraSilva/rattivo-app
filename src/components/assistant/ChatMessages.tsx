import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <View style={styles.container}>
      {messages.map((item) => {
        const isAssistant = item.sender === 'assistant';

        return (
          <View
            key={item.id}
            style={[
              styles.messageWrapper,
              isAssistant ? styles.assistantWrapper : styles.userWrapper,
            ]}
          >
            {isAssistant ? (
              <View style={styles.assistantBubble}>
                <View style={styles.greenBar} />
                <Text style={styles.assistantText}>{item.text}</Text>
              </View>
            ) : (
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{item.text}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 12,
  },
  messageWrapper: {
    width: '100%',
  },
  assistantWrapper: {
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  assistantBubble: {
    flexDirection: 'row',
    maxWidth: '92%',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 2,
  },
  greenBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    alignSelf: 'stretch',
    minHeight: 20,
  },
  assistantText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: '#272B25',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#363D33',
  },
  userText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});

