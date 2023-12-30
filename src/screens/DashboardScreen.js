import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const DashboardScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userSnapshot = await firestore().collection('users').doc(user.uid).get();
          const userData = userSnapshot.data();
          if (userData && userData.username) {
            setUserName(userData.username);
          } else {
            setUserName('User');
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error.message);
        setUserName('User');
      }
    };
  
    fetchUserName();

    // Fetch current date
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    setCurrentDay(formattedDate);

    const unsubscribeExpense = firestore()
      .collection('entries')
      .where('user_id', '==', auth().currentUser.uid)
      .where('type', '==', 'Expense')
      .onSnapshot((querySnapshot) => {
        let totalExpenseAmount = 0;
        querySnapshot.forEach((doc) => {
          totalExpenseAmount += doc.data().amount;
        });
        setTotalExpense(totalExpenseAmount);
      });

    const unsubscribeIncome = firestore()
      .collection('entries')
      .where('user_id', '==', auth().currentUser.uid)
      .where('type', '==', 'Income')
      .onSnapshot((querySnapshot) => {
        let totalIncomeAmount = 0;
        querySnapshot.forEach((doc) => {
          totalIncomeAmount += doc.data().amount;
        });
        setTotalIncome(totalIncomeAmount);
      });

    return () => {
      // Cleanup listeners
      unsubscribeExpense();
      unsubscribeIncome();
    };
  }, []);




  return (
    <View style={styles.container}>

      {/* Add a button for the menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuVisible(!isMenuVisible)}
      >
        <Image
          source={require('./images/more.png')} // Replace with the correct path
          style={styles.menuButtonImage}
        />
      </TouchableOpacity>

      {/* Render the menu if isMenuVisible is true */}
      {isMenuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('Welcome');
            }}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setIsMenuVisible(false);
              navigation.navigate('Settings');
            }}
          >
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}


      {/* Personalized welcome message */}
      <Text style={styles.welcomeText}>Welcome {userName}!</Text>

      {/* Display current day */}
      <Text style={styles.currentDayText}>{currentDay}</Text>

      <View style={styles.amountContainer}>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Expenses</Text>
          <Text style={styles.amountValue}>{totalExpense} MAD</Text>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total Incomes</Text>
          <Text style={styles.amountValue}>{totalIncome} MAD</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Box 1 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('Expense Entry')}
        >
          <ImageBackground
            source={require('./images/image1.jpg')}
            style={styles.imageBackground}
          >
            <Text style={styles.boxText}>Add Amount</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* Box 2 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('Historical Data')}
        >
          <ImageBackground
            source={require('./images/image2.jpg')}
            style={styles.imageBackground}
          >
            <Text style={styles.boxText}>Historical Data</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Box 3 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <ImageBackground
            source={require('./images/image3.jpg')}
            style={styles.imageBackground}
          >
            <Text style={styles.boxText}>Dashboard</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* Box 4 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('Insights')}
        >
          <ImageBackground
            source={require('./images/image4.jpg')}
            style={styles.imageBackground}
          >
            <Text style={styles.boxText}>Insights & Prediction</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  menuButton: {
    position: 'absolute',
    top: -10,
    right: 0,
    zIndex: 1,
  },
  menuButtonImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  menu: {
    position: 'absolute',
    top: 20,
    right: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    elevation: 5,
    padding: 5,
  },
  menuItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentDayText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    flex: 1,
    aspectRatio: 1, // Make it a square box
    margin: 10,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Align text to the bottom
  },
  boxText: {
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
    padding: 6,
    color: 'black', // Text color
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  amountBox: {
    flex: 1,
    marginHorizontal: 5,
    aspectRatio: 2,
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  amountLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DashboardScreen;