// styles.js
export const colors = {
    primary: '#3498db', // Blue
    secondary: '#2ecc71', // Green
    text: '#333',
    background: '#ecf0f1', // Light gray
    error: '#e74c3c', // Red
  };
  
  export const globalStyles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.primary,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: colors.text,
    },
    input: {
      height: 40,
      borderColor: colors.primary,
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      width: '100%',
      color: colors.text,
    },
    error: {
      color: colors.error,
      marginBottom: 10,
    },
    button: {
      backgroundColor: colors.primary,
      color: '#fff',
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
    linkText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
  };
  