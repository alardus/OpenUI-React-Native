import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Platform,
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const WelcomeScreen = ({ onAddServer }) => {
  // Создаем переменные анимации
  const animation1 = React.useRef(new Animated.Value(0)).current;
  const animation2 = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация градиентных элементов
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation1, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animation1, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animation2, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(animation2, {
          toValue: 0,
          duration: 20000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Анимация появления контента
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateX1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const translateX2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.outerContainer}>
      {/* Фоновый слой */}
      <View style={styles.backgroundContainer}>
        <View style={styles.background} />
        <Animated.View style={[
          styles.gradient1,
          { transform: [{ translateX: translateX1 }, { translateY: translateX1 }] }
        ]} />
        <Animated.View style={[
          styles.gradient2,
          { transform: [{ translateX: translateX2 }, { translateY: translateX2 }] }
        ]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Icon name="server-outline" size={80} color="#fff" />
          </View>
          
          <Text style={styles.title}>Добро пожаловать в OpenUI</Text>
          <Text style={styles.subtitle}>
            Подключитесь к вашему серверу Ollama и начните работу с AI прямо сейчас
          </Text>

          <TouchableOpacity style={styles.button} onPress={onAddServer}>
            <Icon name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Добавить сервер</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#4A00E0',
  },
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4A00E0',
  },
  gradient1: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.5,
    height: Dimensions.get('window').height * 1.5,
    backgroundColor: 'rgba(142, 45, 226, 0.4)',
    borderRadius: Dimensions.get('window').width,
  },
  gradient2: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 1.2,
    backgroundColor: 'rgba(74, 0, 224, 0.3)',
    borderRadius: Dimensions.get('window').width,
    top: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;