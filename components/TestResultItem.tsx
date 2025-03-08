import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, X, ChevronDown, ChevronUp, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';

interface TestResultItemProps {
  id: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  executionTime?: number;
}

export const TestResultItem = ({
  id,
  passed,
  input,
  expectedOutput,
  actualOutput,
  error,
  executionTime,
}: TestResultItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  return (
    <View style={[
      styles.container,
      passed ? styles.passedContainer : styles.failedContainer
    ]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.statusContainer}>
          {passed ? (
            <Check size={16} color={colors.success} />
          ) : (
            <X size={16} color={colors.error} />
          )}
          <Text style={[styles.title, passed ? styles.passedText : styles.failedText]}>
            Teste #{id}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {executionTime !== undefined && (
            <View style={styles.executionTime}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={styles.executionTimeText}>{executionTime}ms</Text>
            </View>
          )}
          {expanded ? (
            <ChevronUp size={16} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={16} color={colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Input:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{input}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{expectedOutput}</Text>
            </View>
          </View>
          
          {!passed && actualOutput && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Actual:</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{actualOutput}</Text>
              </View>
            </View>
          )}
          
          {error && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Error:</Text>
              <View style={[styles.codeBox, styles.errorBox]}>
                <Text style={[styles.codeText, styles.errorText]}>{error}</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  passedContainer: {
    backgroundColor: `${colors.success}15`,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  failedContainer: {
    backgroundColor: `${colors.error}15`,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  passedText: {
    color: colors.success,
  },
  failedText: {
    color: colors.error,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  executionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  executionTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  details: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  codeBox: {
    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 4,
  },
  errorBox: {
    backgroundColor: isDark ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.05)',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
  },
});
