import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import regression from 'regression';

const InsightsScreen = () => {
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const userId = auth().currentUser.uid;

        // Fetch historical expense data from Firebase
        const expenseSnapshot = await firestore()
          .collection('entries')
          .where('user_id', '==', userId)
          .where('type', '==', 'Expense')
          .orderBy('date')
          .get();

        const expenseData = expenseSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { date: data.date.toDate(), amount: data.amount };
        });

        // Convert date to months since epoch and aggregate daily spending into monthly totals
        const formattedData = expenseData.reduce((monthlyData, data) => {
          const monthKey = moment(data.date).format('YYYY-MM');
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, totalAmount: 0 };
          }
          monthlyData[monthKey].totalAmount += data.amount;
          return monthlyData;
        }, {});

        // Convert aggregated monthly data to an array
        const aggregatedDataArray = Object.values(formattedData).map((data) => [
          moment(data.month).diff(moment('2000-01-01'), 'months'),
          data.totalAmount,
        ]);

        // Perform linear regression on aggregated data
        const result = regression.linear(aggregatedDataArray);

        // Generate future dates (e.g., next 4 months)
        const currentDate = moment();
        const futureDates = Array.from({ length: 4 }, (_, i) =>
          moment(currentDate).add(i + 1, 'months').toDate()
        );

        // Calculate forecast based on the linear regression
        const forecastPrediction = futureDates.map((date) => ({
          date,
          amount: result.predict(moment(date).diff(moment('2000-01-01'), 'months'))[1],
        }));

        setPredictionData({
          dates: forecastPrediction.map((data) => moment(data.date).format('YYYY-MM-DD')),
          amounts: forecastPrediction.map((data) => data.amount),
        });
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpenseData();
  }, []);

  return (
    <View style={styles.container}>
      {predictionData && (
        <>
          <Text style={styles.title}>Monthly Expense Prediction</Text>
          <Text style={styles.subtitle}>Based on user's previous expenses</Text>
          <View style={styles.lineChartContainer}>
            <LineChart
              data={{
                labels: predictionData.dates,
                datasets: [
                  {
                    data: predictionData.amounts,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={500}
              yAxisLabel="DH"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
              style={{ borderRadius: 16, alignSelf: 'center' }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 12,
    color: 'black',
    marginBottom: 10,
  },

  lineChartContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default InsightsScreen;
