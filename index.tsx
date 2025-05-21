import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLoanStore } from '@/stores/loan-store';
import { LoanCard } from '@/components/LoanCard';
import { colors } from '@/constants/colors';
import { Trash2 } from 'lucide-react-native';

export default function DashboardScreen() {
  const { loans, deleteLoan } = useLoanStore();
  
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const activeLoans = loans.filter(loan => loan.remainingAmount > 0);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Loans</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Total Remaining</Text>
              <Text style={styles.statValue}>
                THB {totalRemaining.toLocaleString()}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Active Loans</Text>
              <Text style={styles.statValue}>{activeLoans.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {loans.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No loans yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first loan to start tracking
              </Text>
            </View>
          ) : (
            loans.map(loan => (
              <View key={loan.id} style={styles.loanContainer}>
                <LoanCard loan={loan} />
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => deleteLoan(loan.id)}
                >
                  <Trash2 size={20} color={colors.error} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  loanContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});