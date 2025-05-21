import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
});

function ReportPDF({ data, dateRange }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Financial Report</Text>
          <Text style={styles.subtitle}>
            {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
          </Text>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text>Total Income</Text>
              <Text>${data.summary.totalIncome.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text>Total Expenses</Text>
              <Text>${data.summary.totalExpenses.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text>Net Balance</Text>
              <Text>
                ${(data.summary.totalIncome - data.summary.totalExpenses).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          <View style={styles.table}>
            {Object.entries(data.summary.categoryTotals).map(([category, amount]) => (
              <View style={styles.tableRow} key={category}>
                <Text style={styles.tableCell}>{category}</Text>
                <Text style={styles.tableCell}>${amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Amount</Text>
              <Text style={styles.tableCell}>Date</Text>
            </View>
            {data.expenses.map((expense) => (
              <View style={styles.tableRow} key={expense.id}>
                <Text style={styles.tableCell}>{expense.name}</Text>
                <Text style={styles.tableCell}>{expense.category}</Text>
                <Text style={styles.tableCell}>
                  ${parseFloat(expense.amount).toLocaleString()}
                </Text>
                <Text style={styles.tableCell}>
                  {new Date(expense.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ReportPDF;