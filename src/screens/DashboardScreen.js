// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { globalStyles } from '../styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { PieChart, BarChart } from 'react-native-chart-kit';

const DashboardScreen = ({ navigation }) => {
  const [totalSpending, setTotalSpending] = useState(0);
  const [budget, setBudget] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchData = async () => {
    // Fetch and calculate total spending
    try {
      const userId = auth().currentUser.uid;
      const querySnapshot = await firestore()
        .collection('expenses')
        .where('user_id', '==', userId)
        .orderBy('date', 'desc')
        .limit(5)
        .get();

      let total = 0;
      const recentExpensesData = [];

      querySnapshot.forEach((doc) => {
        total += doc.data().amount;
        recentExpensesData.push({
          id: doc.id,
          amount: doc.data().amount,
          date: doc.data().date.toDate(),
          category: doc.data().category,
        });
      });

      setTotalSpending(total);
      setRecentExpenses(recentExpensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }

    // Fetch and calculate total budget
    const budgetSnapshot = await firestore()
      .collection('budgets')
      .where('user_id', '==', auth().currentUser.uid)
      .get();

    if (!budgetSnapshot.empty) {
      let totalBudget = 0;
      budgetSnapshot.forEach((doc) => {
        totalBudget += doc.data().amount;
      });
      setBudget(totalBudget);
    } else {
      console.log('No budgets found for the user.');
      setBudget(0);
    }

    // Fetch monthly spending data
    const monthlySnapshot = await firestore()
      .collection('expenses')
      .where('user_id', '==', auth().currentUser.uid)
      .orderBy('date', 'asc')
      .get();

    if (!monthlySnapshot.empty) {
      const dataByMonth = {};

      monthlySnapshot.forEach((doc) => {
        const expenseDate = doc.data().date.toDate();
        const monthYearKey = `${expenseDate.getMonth() + 1}-${expenseDate.getFullYear()}`;

        if (!dataByMonth[monthYearKey]) {
          dataByMonth[monthYearKey] = 0;
        }

        dataByMonth[monthYearKey] += doc.data().amount;
      });

      const formattedData = Object.keys(dataByMonth).map((key) => ({
        monthYear: key,
        amount: dataByMonth[key],
      }));

      setMonthlyData(formattedData);
    } else {
      console.log('No monthly spending data found for the user.');
      setMonthlyData([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when the screen comes into focus
      fetchData();
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [navigation, fetchData]);


  // Calculate budget status
  useEffect(() => {
    if(budget - totalSpending < 0) {
    setBudgetStatus(0);
    } else {
      setBudgetStatus(budget - totalSpending);
    }
  }, [totalSpending, budget]);

  const chartData = [
    {
      name: 'Total Spending',
      amount: totalSpending,
      color: '#FF5733',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Budget Status',
      amount: budgetStatus,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={globalStyles.title}>Dashboard</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total Spending: {totalSpending} MAD</Text>
            <Text style={styles.summaryText}>Budget: {budget} MAD</Text>
            <Text style={styles.summaryText}>Budget Status: {budgetStatus} MAD</Text>
          </View>

          {/* Display Recent Expenses */}
          <View style={styles.recentExpensesContainer}>
            <Text style={styles.recentExpensesTitle}>Recent Expenses</Text>
            {recentExpenses.map((expense) => (
              <View key={expense.id} style={styles.recentExpenseItem}>
                <Text>{expense.date.toDateString()}</Text>
                <Text>{expense.amount} - {expense.category} MAD</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.viewAllExpensesButton}
              onPress={() => navigation.navigate('Expense List')}
            >
              <Text style={styles.viewAllExpensesButtonText}>View All Expenses</Text>
            </TouchableOpacity>
          </View>

          {/* Display Budget Status Pie Chart */}
          <View style={styles.pieChartContainer}>
            <Text style={styles.pieChartTitle}>Budget Status</Text>
            <PieChart
              data={chartData}
              width={300}
              height={200}
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          {/* Display Monthly Spending Trends Bar Chart */}
          <View style={styles.barChartContainer}>
            <Text style={styles.barChartTitle}>Monthly Spending Trends</Text>
            <BarChart
              data={{
                labels: monthlyData.map((entry) => entry.monthYear),
                datasets: [
                  {
                    data: monthlyData.map((entry) => entry.amount),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 32}
              height={200}
              yAxisLabel="MAD"
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              style={{ marginTop: 15 }}
            />
          </View>

      </ScrollView>
       {/* Refresh Button in the Navigation Bar */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchData}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {/* Button to navigate to Expense Entry Screen */}
      <TouchableOpacity
        style={styles.expenseEntryButton}
        onPress={() => navigation.navigate('Expense Entry')}
      >
        <Text style={styles.expenseEntryButtonText}>Add Expense</Text>
      </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  summaryContainer: {
    marginTop: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
  },
  recentExpensesContainer: {
    marginTop: 20,
  },
  recentExpensesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentExpenseItem: {
    marginBottom: 5,
  },
  viewAllExpensesButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewAllExpensesButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },

  pieChartContainer: {
    marginTop: 20,
    width: '100%',
  },
  pieChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  barChartContainer: {
    marginTop: 20,
  },
  barChartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  expenseEntryButton: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  expenseEntryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },

  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DashboardScreen;
