import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  BarChart2,
  Play,
  Send,
  Loader2,
  Code,
} from 'lucide-react-native';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { COLORS } from '@/constants/colors';

import { useTheme } from '@/context/ThemeContext';

import { DifficultyBadge } from '@/components/challenges/DifficultyBadge';
import { CodeEditor } from '@/components/CodeEditor';
import { TestResultItem } from '@/components/TestResultItem';

export default function ChallengeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<string | null>(null);
  const [visibleHints, setVisibleHints] = useState<boolean[]>([]);

  const challenge = useQuery(api.challenges.getById, { id: id as Id<"challenges"> });
  const executeCode = useMutation(api.codeExecution.executeCode);
  const submitSolution = useMutation(api.codeExecution.submitSolution);

  useEffect(() => {
    if (challenge !== undefined) {
      setIsLoading(false);
      if (challenge?.hints?.length) {
        setVisibleHints(new Array(challenge.hints.length).fill(false));
      }
    }
  }, [challenge]);

  useEffect(() => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode);
    } else {
      // Default starter code if none provided
      setCode(`function solution() {\n  // Write your code here\n  \n}\n`);
    }
  }, [challenge]);

  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;
  const styles = createStyles(colors, isDark);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = async () => {
    if (!challenge) return;
    
    setIsExecuting(true);
    setShowResults(true);
    setExecutionStatus('executing');
    
    try {
      const result = await executeCode({
        challengeId: challenge._id,
        code,
        language: 'javascript',
      });
      
      setTestResults(result.results);
      setExecutionStatus(result.status);
    } catch (error) {
      Alert.alert('Error', 'Failed to execute code');
      setExecutionStatus('error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!challenge) return;
    
    setIsSubmitting(true);
    setShowResults(true);
    
    try {
      const result = await submitSolution({
        challengeId: challenge._id,
        code,
        language: 'javascript',
      });
      
      setTestResults(result.results);
      setExecutionStatus(result.status);
      
      if (result.allPassed) {
        Alert.alert('Success', 'All tests passed! Your solution has been submitted.');
      } else {
        Alert.alert('Incorrect Solution', 'Some tests failed. Please review your code.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHint = (index: number) => {
    const newVisibleHints = [...visibleHints];
    newVisibleHints[index] = !newVisibleHints[index];
    setVisibleHints(newVisibleHints);
  };

  if (isLoading || !challenge) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando desafio...</Text>
      </View>
    );
  }

  const renderSolutionTab = () => {
    return (
      <View style={styles.solutionContainer}>
        <View style={styles.editorContainer}>
          <CodeEditor
            initialCode={code}
            onCodeChange={handleCodeChange}
            height="50%"
          />
        </View>
        
        <View style={styles.resultsContainer}>
          <View style={styles.resultsTitleBar}>
            <View style={styles.resultsTitle}>
              <Code size={16} color={colors.text} />
              <Text style={styles.resultsTitleText}>Testes</Text>
            </View>
            
            {executionStatus && (
              <View style={[
                styles.statusBadge,
                executionStatus === 'accepted' ? styles.statusSuccess : 
                executionStatus === 'error' ? styles.statusError :
                styles.statusRunning
              ]}>
                <Text style={styles.statusText}>
                  {executionStatus === 'accepted' ? 'Aceito' : 
                   executionStatus === 'completed' ? 'Completo' :
                   executionStatus === 'executing' ? 'Executando' :
                   executionStatus === 'error' ? 'Erro' : 
                   executionStatus}
                </Text>
              </View>
            )}
          </View>
          
          <ScrollView style={styles.resultsScrollView}>
            {showResults && testResults.length > 0 ? (
              testResults.map((result, index) => (
                <TestResultItem
                  key={index}
                  id={result.testCaseId + 1}
                  passed={result.passed}
                  input="[3, 2, 1, 5, 6, 4], k = 2" // This should come from your challenge.testCases
                  expectedOutput="5" // This should come from your challenge.testCases
                  actualOutput={result.output}
                  error={result.error}
                  executionTime={result.executionTime}
                />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {isExecuting ? 'Testando...' : 'Execute seu código para ver os resultados dos testes'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.runButton, (isExecuting || isSubmitting) && styles.disabledButton]}
            onPress={handleRunCode}
            disabled={isExecuting || isSubmitting}
          >
            {isExecuting ? (
              <Loader2 size={16} color="#FFFFFF" />
            ) : (
              <Play size={16} color="#FFFFFF" />
            )}
            <Text style={styles.runButtonText}>Testar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.submitButton, (isExecuting || isSubmitting) && styles.disabledButton]}
            onPress={handleSubmitSolution}
            disabled={isExecuting || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={16} color="#FFFFFF" />
            ) : (
              <Send size={16} color="#FFFFFF" />
            )}
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: challenge.title,
          headerTitleStyle: {
            fontSize: 18,
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'description' && styles.activeTab]}
            onPress={() => setActiveTab('description')}
          >
            <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
              Descrição
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'solution' && styles.activeTab]}
            onPress={() => setActiveTab('solution')}
          >
            <Text style={[styles.tabText, activeTab === 'solution' && styles.activeTabText]}>
              Solução
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'description' && (
          <ScrollView style={styles.contentContainer}>
            <View style={styles.challengeHeader}>
              <View style={styles.challengeHeaderTop}>
                <DifficultyBadge difficulty={challenge.difficulty} />
                <Text style={styles.challengeStatus}>{challenge.status}</Text>
              </View>
              
              <View style={styles.metaContainer}>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      ~{challenge.estimatedTime} min
                    </Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <BarChart2 size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {challenge.successRate}% de sucesso
                    </Text>
                  </View>
                </View>
                
                <View style={styles.metaSeparator} />
                
                <View style={styles.topicContainer}>
                  <Tag size={14} color={colors.textSecondary} style={styles.topicIcon} />
                  <Text style={styles.topicsText} numberOfLines={2} ellipsizeMode="tail">
                    {challenge.topics.join(' · ')}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.descriptionText}>
              {challenge.description}
            </Text>
            
            {challenge.testCases && challenge.testCases.length > 0 && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Exemplo 1:</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleText}>
                    <Text style={styles.exampleLabel}>Entrada: </Text>
                    {challenge.testCases[0].input}
                  </Text>
                  <Text style={styles.exampleText}>
                    <Text style={styles.exampleLabel}>Saída: </Text>
                    {challenge.testCases[0].output}
                  </Text>
                  {challenge.testCases[0].explanation && (
                    <Text style={styles.exampleText}>
                      <Text style={styles.exampleLabel}>Explicação: </Text>
                      {challenge.testCases[0].explanation}
                    </Text>
                  )}
                </View>
              </View>
            )}
            
            {challenge.testCases && challenge.testCases.length > 1 && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Exemplo 2:</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleText}>
                    <Text style={styles.exampleLabel}>Entrada: </Text>
                    {challenge.testCases[1].input}
                  </Text>
                  <Text style={styles.exampleText}>
                    <Text style={styles.exampleLabel}>Saída: </Text>
                    {challenge.testCases[1].output}
                  </Text>
                  {challenge.testCases[1].explanation && (
                    <Text style={styles.exampleText}>
                      <Text style={styles.exampleLabel}>Explicação: </Text>
                      {challenge.testCases[1].explanation}
                    </Text>
                  )}
                </View>
              </View>
            )}
            
            {challenge.constraints && challenge.constraints.length > 0 && (
              <View style={styles.constraintsContainer}>
                <Text style={styles.constraintsTitle}>Restrições:</Text>
                <View style={styles.constraintsList}>
                  {challenge.constraints.map((constraint, index) => (
                    <Text key={index} style={styles.constraintItem}>
                      • {constraint}
                    </Text>
                  ))}
                </View>
              </View>
            )}
            
            {challenge.hints && challenge.hints.length > 0 && (
              <View style={styles.hintsContainer}>
                <Text style={styles.hintsTitle}>Dicas:</Text>
                {challenge.hints.map((hint, index) => (
                  <View key={index} style={styles.hintWrapper}>
                    <TouchableOpacity 
                      style={styles.hintButton}
                      onPress={() => toggleHint(index)}
                    >
                      <Text style={styles.hintButtonText}>
                        {visibleHints[index] ? 'Ocultar' : 'Mostrar'} Dica {index + 1}
                      </Text>
                    </TouchableOpacity>
                    {visibleHints[index] && (
                      <View style={styles.hintContent}>
                        <Text style={styles.hintText}>{hint}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {activeTab === 'solution' && renderSolutionTab()}
      </View>
    </>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  challengeHeader: {
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  challengeHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeStatus: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  metaSeparator: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.7,
    marginVertical: 8,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  topicIcon: {
    marginTop: 2,
  },
  topicsText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 20,
  },
  exampleContainer: {
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  exampleBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
  },
  exampleText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  exampleLabel: {
    fontWeight: 'bold',
  },
  constraintsContainer: {
    marginBottom: 20,
  },
  constraintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  constraintsList: {
    marginLeft: 8,
  },
  constraintItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  hintsContainer: {
    marginBottom: 20,
  },
  hintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  hintWrapper: {
    marginBottom: 8,
  },
  hintButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
  },
  hintButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  hintContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  solutionContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  editorContainer: {
    flex: 1,
    height: '50%',
  },
  resultsContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  resultsTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: `${colors.success}20`,
  },
  statusError: {
    backgroundColor: `${colors.error}20`,
  },
  statusRunning: {
    backgroundColor: `${colors.primary}20`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsScrollView: {
    flex: 1,
    padding: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    paddingBottom: 30,
    borderTopColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  runButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});