import { View, TextInput, StyleSheet, ScrollView } from 'react-native';

interface CodeEditorProps {
  code: string;
  language: string;
  onChangeCode: (code: string) => void;
  isDark: boolean;
}

export const CodeEditor = ({ code, language, onChangeCode, isDark }: CodeEditorProps) => {
  const styles = createStyles(isDark);
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.lineNumbers}>
          {code.split('\n').map((_, i) => (
            <Text key={i} style={styles.lineNumber}>
              {i + 1}
            </Text>
          ))}
        </View>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={onChangeCode}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="ascii-capable"
        />
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#171923' : '#F7FAFC',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  lineNumbers: {
    width: 40,
    paddingTop: 8,
    paddingRight: 8,
    alignItems: 'flex-end',
    backgroundColor: isDark ? '#1A202C' : '#EDF2F7',
  },
  lineNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: isDark ? '#4A5568' : '#A0AEC0',
    fontFamily: 'monospace',
  },
  codeInput: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    color: isDark ? '#F7FAFC' : '#2D3748',
    fontFamily: 'monospace',
  },
});

// Add Text component since it's used in the component
import { Text } from 'react-native';