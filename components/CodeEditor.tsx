import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  onCodeChange: (code: string) => void;
  editable?: boolean;
  height?: number | string;
}

export const CodeEditor = ({ 
  initialCode, 
  language = 'javascript',
  onCodeChange,
  editable = true,
  height = 300,
}: CodeEditorProps) => {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  const [code, setCode] = useState(initialCode);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const codeInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const lineScrollViewRef = useRef<ScrollView>(null);
  
  const calculateLineNumbers = (text: string) => {
    const lines = text.split('\n');
    return Array.from({ length: lines.length }, (_, i) => (i + 1).toString());
  };

  const handleChangeText = (text: string) => {
    setCode(text);
    setLineNumbers(calculateLineNumbers(text));
    onCodeChange(text);
  };

  const handleScroll = (event: any) => {
    if (lineScrollViewRef.current) {
      lineScrollViewRef.current.scrollTo({ 
        y: event.nativeEvent.contentOffset.y,
        animated: false 
      });
    }
  };

  useEffect(() => {
    setCode(initialCode);
    setLineNumbers(calculateLineNumbers(initialCode));
  }, [initialCode]);
  useEffect(() => {
    setCode(initialCode);
    setLineNumbers(calculateLineNumbers(initialCode));
  }, [initialCode]);

  useEffect(() => {
    if (editable && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [editable]);

  const styles = createStyles(isDark);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={[styles.editorContainer]}>
        <ScrollView 
          ref={lineScrollViewRef}
          style={styles.lineNumbers}
          scrollEnabled={false}
          contentContainerStyle={styles.lineNumbersContent}
        >
          {lineNumbers.map((num, index) => (
            <Text key={index} style={styles.lineNumber}>
              {num}
            </Text>
          ))}
        </ScrollView>
        <ScrollView 
          ref={scrollViewRef}
          horizontal={true}
          style={styles.codeScrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <TextInput
            ref={codeInputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={handleChangeText}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            editable={editable}
            keyboardType="ascii-capable"
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
    overflow: 'hidden',
  },
  lineNumbers: {
    backgroundColor: isDark ? '#252525' : '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: 10,
    maxWidth: 35,
  },
  lineNumbersContent: {
    alignItems: 'flex-end',
  },
  lineNumber: {
    color: isDark ? '#858585' : '#999',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'monospace',
    paddingRight: 4,
    minWidth: 22,
  },
  codeScrollContainer: {
    flex: 1,
  },
  codeInput: {
    color: isDark ? '#d4d4d4' : '#333',
    fontSize: 14,
    lineHeight: 18,
    padding: 8,
    fontFamily: 'monospace',
    minWidth: '100%',
  },
});
