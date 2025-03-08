import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/ui/Button';

interface FilterOption {
  id: string;
  label: string;
  category: 'difficulty' | 'topics' | 'status';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { difficulty: string[], topics: string[], status: string[] }) => void;
  initialFilters: { difficulty: string[], topics: string[], status: string[] };
}

const FilterModal = ({ visible, onClose, onApply, initialFilters }: FilterModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: [...initialFilters.difficulty],
    topics: [...initialFilters.topics],
    status: [...initialFilters.status]
  });

  const filterOptions: FilterOption[] = [
    // Difficulty options
    { id: 'Easy', label: 'Fácil', category: 'difficulty' },
    { id: 'Medium', label: 'Médio', category: 'difficulty' },
    { id: 'Hard', label: 'Difícil', category: 'difficulty' },
    
    // Topic options
    { id: 'Arrays', label: 'Arrays', category: 'topics' },
    { id: 'Strings', label: 'Strings', category: 'topics' },
    { id: 'Linked List', label: 'Lista Ligada', category: 'topics' },
    { id: 'Trees', label: 'Árvores', category: 'topics' },
    { id: 'Hash Table', label: 'Tabela Hash', category: 'topics' },
    { id: 'Stack', label: 'Pilha', category: 'topics' },
    { id: 'Queue', label: 'Fila', category: 'topics' },
    { id: 'Heap', label: 'Heap', category: 'topics' },
    { id: 'Graph', label: 'Grafos', category: 'topics' },
    { id: 'Dynamic Programming', label: 'Programação Dinâmica', category: 'topics' },
    { id: 'Divide and Conquer', label: 'Dividir e Conquistar', category: 'topics' },
    
    { id: 'New', label: 'Novo', category: 'status' },
    { id: 'Attempted', label: 'Tentado', category: 'status' },
    { id: 'Completed', label: 'Concluído', category: 'status' },
  ];

  const toggleFilter = (filter: FilterOption) => {
    const category = filter.category;
    const currentFilters = [...selectedFilters[category]];
    
    if (currentFilters.includes(filter.id)) {
      setSelectedFilters({
        ...selectedFilters,
        [category]: currentFilters.filter(f => f !== filter.id)
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [category]: [...currentFilters, filter.id]
      });
    }
  };

  const handleApply = () => {
    onApply(selectedFilters);
  };

  const resetFilters = () => {
    setSelectedFilters({
      difficulty: [],
      topics: [],
      status: []
    });
  };

  const isFilterSelected = (filter: FilterOption) => {
    return selectedFilters[filter.category].includes(filter.id);
  };

  const styles = createStyles(colors, isDark);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Desafios</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Dificuldade</Text>
              <View style={styles.filterOptions}>
                {filterOptions
                  .filter(option => option.category === 'difficulty')
                  .map(filter => (
                    <TouchableOpacity
                      key={filter.id}
                      style={[
                        styles.filterOption,
                        isFilterSelected(filter) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleFilter(filter)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          isFilterSelected(filter) && styles.filterOptionTextSelected
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.filterOptions}>
                {filterOptions
                  .filter(option => option.category === 'status')
                  .map(filter => (
                    <TouchableOpacity
                      key={filter.id}
                      style={[
                        styles.filterOption,
                        isFilterSelected(filter) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleFilter(filter)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          isFilterSelected(filter) && styles.filterOptionTextSelected
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tópicos</Text>
              <View style={styles.filterOptions}>
                {filterOptions
                  .filter(option => option.category === 'topics')
                  .map(filter => (
                    <TouchableOpacity
                      key={filter.id}
                      style={[
                        styles.filterOption,
                        isFilterSelected(filter) && styles.filterOptionSelected
                      ]}
                      onPress={() => toggleFilter(filter)}
                    >
                      <Text 
                        style={[
                          styles.filterOptionText,
                          isFilterSelected(filter) && styles.filterOptionTextSelected
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button 
              title="Limpar Filtros" 
              onPress={resetFilters} 
              variant="outline"
              style={styles.resetButton}
            />
            <Button 
              title="Aplicar" 
              onPress={handleApply}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: typeof COLORS.dark | typeof COLORS.light, isDark: boolean) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    marginVertical: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterOptionTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    paddingBottom: 20,
    borderTopColor: colors.border,
  },
  resetButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
  },
});

export default FilterModal;