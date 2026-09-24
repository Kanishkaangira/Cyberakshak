import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import {
  INITIAL_CHAT_MESSAGES,
  SUGGESTIONS,
  analyzeUserQuery,
} from '../constants/data';

export default function ChatbotScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // If navigated with initialQuery, process it immediately
  useEffect(() => {
    if (route.params?.initialQuery) {
      handleSend(route.params.initialQuery);
    }
  }, [route.params?.initialQuery]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();

    // Simulate AI model inference delay
    setTimeout(() => {
      const response = analyzeUserQuery(query);
      const botMsg = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        badge: response.badge,
        badgeType: response.badgeType,
        text: response.text,
        steps: response.steps,
        helpline: response.helpline,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      scrollToBottom();
    }, 600);
  };

  const handleChipPress = (chipText) => {
    handleSend(chipText);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'red':
        return { bg: COLORS.redSoft, text: COLORS.red };
      case 'orange':
        return { bg: COLORS.orangeSoft, text: COLORS.orange };
      case 'green':
        return { bg: COLORS.greenSoft, text: COLORS.green };
      default:
        return { bg: COLORS.brandSoft, text: COLORS.brand };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.botAvatar}>
          <Text style={styles.botAvatarEmoji}>🛡️</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Cyberakshak assistant</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerSubtitle}>Trained on cyber frauds & safety</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.resetBtn}
          activeOpacity={0.7}
          onPress={() => setMessages(INITIAL_CHAT_MESSAGES)}
        >
          <Text style={styles.resetBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((item) => {
            const isUser = item.sender === 'user';

            if (isUser) {
              return (
                <View key={item.id} style={styles.userBubble}>
                  <Text style={styles.userText}>{item.text}</Text>
                </View>
              );
            }

            const badgeColor = item.badge
              ? getBadgeStyle(item.badgeType)
              : null;

            return (
              <View key={item.id} style={styles.botBubble}>
                {item.badge && (
                  <View
                    style={[
                      styles.verdictBadge,
                      { backgroundColor: badgeColor.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.verdictBadgeText,
                        { color: badgeColor.text },
                      ]}
                    >
                      {item.badge}
                    </Text>
                  </View>
                )}

                <Text style={styles.botText}>{item.text}</Text>

                {item.steps && item.steps.length > 0 && (
                  <View style={styles.stepsList}>
                    {item.steps.map((step, idx) => (
                      <View key={idx} style={styles.stepItem}>
                        <Text style={styles.stepNumber}>{idx + 1}.</Text>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {item.helpline && (
                  <TouchableOpacity
                    style={styles.helplineBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      Linking.openURL(`tel:${item.helpline}`).catch(() => {})
                    }
                  >
                    <Text style={styles.helplineBtnIcon}>📞</Text>
                    <Text style={styles.helplineBtnText}>
                      Call National Helpline 1930
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color={COLORS.brand} />
              <Text style={styles.typingText}>Cyberakshak is analyzing...</Text>
            </View>
          )}

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Suggested queries:</Text>
            <View style={styles.chipsWrap}>
              {SUGGESTIONS.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  activeOpacity={0.7}
                  onPress={() => handleChipPress(chip)}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your question or paste message..."
            placeholderTextColor={COLORS.muted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? COLORS.brand : '#A2A5E4' },
            ]}
            activeOpacity={0.8}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.surface,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 26,
    color: COLORS.ink,
    lineHeight: 30,
    marginTop: -2,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botAvatarEmoji: {
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
  },
  resetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.bg,
  },
  resetBtnText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.brand,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '82%',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '92%',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  verdictBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: SIZES.radiusPill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  verdictBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  botText: {
    color: COLORS.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  stepsList: {
    marginTop: 8,
    gap: 5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.brand,
    lineHeight: 18,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.ink,
    lineHeight: 18,
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.redSoft,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  helplineBtnIcon: {
    fontSize: 14,
  },
  helplineBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.red,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusPill,
  },
  typingText: {
    fontSize: 12.5,
    color: COLORS.muted,
  },
  suggestionsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusPill,
  },
  chipText: {
    fontSize: 12.5,
    color: COLORS.ink,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.ink,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 22,
  },
});
