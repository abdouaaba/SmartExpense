import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { BarChart, LineChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const VisualizationScreen = () => {
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const userId = auth().currentUser.uid;

    // Fetch category and total data
    const unsubscribe = firestore()
      .collection('entries')
      .where('user_id', '==', userId)
      .onSnapshot((querySnapshot) => {
        let totalExpenseAmount = 0;
        let totalIncomeAmount = 0;
        const categoryMap = [];
        const historicalData = [];

        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          if (entry.type === 'Expense') {
            totalExpenseAmount += entry.amount;

            // Check if the entry has a category and it's an object (not just an ID)
            if (entry.category && typeof entry.category === 'object') {
              const categoryId = entry.category.id;
              const categoryName = entry.category.name;
              categoryMap[categoryId] = (categoryMap[categoryId] || 0) + 1;
              setCategoryNames((prevCategoryNames) => ({
                ...prevCategoryNames,
                [categoryId]: categoryName,
              }));
            }
          } else {
            totalIncomeAmount += entry.amount;
          }

          historicalData.push({
            date: entry.date.toDate().toLocaleDateString(),
            amount: entry.amount,
          });
        });

        const categories = Object.keys(categoryMap);
        const categoryChartData = categories.map((categoryId) => ({
          category: { id: categoryId, name: categoryNames[categoryId] },
          value: categoryMap[categoryId],
          type: 'Expense',
        }));

        setTotalExpenses(totalExpenseAmount);
        setTotalIncome(totalIncomeAmount);
        setCategoryData(categoryChartData);
        setHistoricalData(historicalData);
      });

    return () => {
      // Cleanup listener
      unsubscribe();
    };
  }, [categoryNames]);

  if (totalExpenses === null || totalIncome === null || categoryData === null || historicalData.length === 0) {
    // Data is still being fetched, you can return a loading indicator or null
    return null;
  }

  const pieChartData = [
    {
      key: 'Expenses',
      value: totalExpenses,
      svg: { fill: '#3498db' },
      arc: { outerRadius: '100%', padAngle: 0.1 },
    },
    {
      key: 'Income',
      value: totalIncome,
      svg: { fill: 'fuchsia' },
      arc: { outerRadius: '100%', padAngle: 0.1 },
    },
  ];

  // Filter the category data for expenses only
  const expenseCategoryData = categoryData.filter((data) => data.type === 'Expense');

  const expenseBarChartData = {
    labels: expenseCategoryData.map((data) => data.category && data.category.name || 'N/A'),
    datasets: [
      {
        data: expenseCategoryData.map((data) => data.value),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.header}>Total Expenses and Incomes</Text>

        <View style={styles.chartContainer}>
          {/* PieChart for Total Expenses and Total Income */}
          <View style={styles.pieChartContainer}>
            <PieChart
              style={{ height: 250 }}
              data={pieChartData}
              innerRadius="50%"
              outerRadius="70%"
              padAngle={0.03}
            />
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendText}>Legend:</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#3498db' }]} />
              <Text style={styles.legendLabelText}>
                Expenses {((totalExpenses / (totalExpenses + totalIncome)) * 100).toFixed(2)}%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'fuchsia' }]} />
              <Text style={styles.legendLabelText}>
                Income {((totalIncome / (totalExpenses + totalIncome)) * 100).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>

        {/* BarChart for Category Distribution (Expenses Only) */}
        {/* Title */}
        <Text style={styles.BarTitle}>Categories Distribution</Text>
        <View style={styles.barChartContainer}>
          <BarChart
            data={expenseBarChartData}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>

        {/* LineChart for Historical Data */}
        {/* Title */}
        <Text style={styles.BarTitle}>Amount Distribution over time</Text>
        <View style={styles.lineChartContainer}>
          <LineChart
            data={{
              labels: historicalData.map((data) => data.date),
              datasets: [
                {
                  data: historicalData.map((data) => data.amount),
                },
              ],
            }}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pieChartContainer: {
    flex: 1,
  },
  barChartContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  lineChartContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  BarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  legend: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 80,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -30,
    color: 'black',
  },
  legendText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: 'black',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 5,
  },
  legendLabelText: {
    color: 'black',
    fontSize: 14,
  },
});

export default VisualizationScreen;
