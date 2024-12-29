import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Animated,
  StyleSheet,
  Alert,
  ScrollView,
  useColorScheme,
  Image,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import WelcomeScreen from './components/WelcomeScreen';
import MenuModal from './components/MenuModal';
import AddServerModal from './components/AddServerModal'; // Укажите правильный путь
import { APP_VERSION } from './src/constants/version';
import packageInfo from './package.json';
// import Icon from 'react-native-vector-icons/Ionicons'; // Replace 'FontAwesome' with the desired icon library

const App = () => {
  const colorScheme = useColorScheme();
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    host: '',
    isDefault: false
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('addresses');
      if (savedAddresses) {
        const parsed = JSON.parse(savedAddresses);
        setAddresses(parsed);
        const defaultAddress = parsed.find(addr => addr.isDefault);
        if (defaultAddress) {
          setCurrentAddress(defaultAddress.host);
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить адреса');
    }
  };

  const saveAddress = async () => {
    if (!newAddress.title || !newAddress.host) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      let updatedAddresses = [...addresses];
      
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }

      if (editingAddress !== null) {
        updatedAddresses[editingAddress] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }

      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
      
      if (newAddress.isDefault) {
        setCurrentAddress(newAddress.host);
      }

      setModalVisible(false);
      setNewAddress({ title: '', host: '', isDefault: false });
      setEditingAddress(null);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить адрес');
    }
  };

  const deleteAddress = async (index) => {
    try {
      const updatedAddresses = [...addresses];
      const deletedAddress = updatedAddresses[index];
      updatedAddresses.splice(index, 1);
  
      // Сначала обновляем список адресов
      setAddresses(updatedAddresses);
  
      // Затем обновляем текущий адрес, если был удален активный
      if (deletedAddress.host === currentAddress) {
        const newCurrentAddress = updatedAddresses.length > 0 
          ? updatedAddresses.find(addr => addr.isDefault)?.host || updatedAddresses[0].host 
          : null;
        setCurrentAddress(newCurrentAddress);
      }
  
      // Сохраняем в AsyncStorage после обновления состояний
      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить адрес');
    }
  };

  const startEditing = (index) => {
    setEditingAddress(index);
    setNewAddress({ ...addresses[index] });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewAddress({ title: '', host: '', isDefault: false });
    setEditingAddress(null);
  };

  const themeColors = {
    headerBackground: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
    headerBorder: colorScheme === 'dark' ? '#333' : '#ccc',
    iconColor: colorScheme === 'dark' ? '#fff' : '#000',
    menuBackground: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
    textColor: colorScheme === 'dark' ? '#fff' : '#000',
    secondaryText: colorScheme === 'dark' ? '#aaa' : '#666',
    divider: colorScheme === 'dark' ? '#333' : '#ccc',
  };

  const AboutScreen = () => {
    const animation1 = new Animated.Value(0);
    const animation2 = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);
  
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
      <SafeAreaView style={styles.aboutContainer}>
        {/* Фоновый слой */}
        <View style={styles.aboutBackgroundContainer}>
          <View style={styles.aboutBackground} />
          <Animated.View style={[
            styles.aboutGradient1,
            { transform: [{ translateX: translateX1 }, { translateY: translateX1 }] }
          ]} />
          <Animated.View style={[
            styles.aboutGradient2,
            { transform: [{ translateX: translateX2 }, { translateY: translateX2 }] }
          ]} />
        </View>
  
        {/* Заголовок */}
        <View style={styles.aboutHeaderContainer}>
          <TouchableOpacity 
            onPress={() => {
              setShowAbout(false);
              setTimeout(() => {
                setMenuVisible(true);
              }, 300);
            }}
            style={styles.aboutBackButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
  
        {/* Контент */}
        <ScrollView 
          style={styles.aboutScrollView}
          contentContainerStyle={styles.aboutScrollContent}
        >
          <Animated.View style={[styles.aboutContent, { opacity: fadeAnim }]}>
            {/* Логотип */}
            <View style={styles.aboutLogoSection}>
              <View style={styles.aboutLogoContainer}>
                <Image 
                  source={require('./assets/app-icon.png')} 
                  style={styles.aboutLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.aboutAppName}>OpenUI</Text>
              <Text style={styles.aboutVersion}>Версия {APP_VERSION}</Text>
            </View>
  
            {/* Описание */}
            <Text style={styles.aboutDescription}>
              OpenUI — современное приложение для удобной работы с серверами Ollama на мобильных устройствах
            </Text>
  
            {/* Информационные карточки */}
            <View style={styles.aboutCards}>
              <TouchableOpacity 
                style={styles.aboutCard}
                onPress={() => Linking.openURL('https://github.com/alardus/openui-react-native/')}
              >
                <Icon name="logo-github" size={24} color="#fff" style={styles.aboutCardIcon} />
                <View style={styles.aboutCardContent}>
                  <Text style={styles.aboutCardTitle}>Исходный код</Text>
                  <Text style={styles.aboutCardSubtitle}>Открыть на GitHub</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>

            {/* Добавляем информацию об авторе внизу */}
            <View style={styles.aboutFooter}>
              <Text style={styles.aboutCopyright}>
               Made with ❤️ {packageInfo.copyright}, {packageInfo.author} 
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, 
      colorScheme === 'dark' && { backgroundColor: '#000' }
    ]}>

      {/* В header добавим название приложения */}
      <View style={[styles.header, { 
        backgroundColor: themeColors.headerBackground,
        borderBottomColor: themeColors.headerBorder 
      }]}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setMenuVisible(true)}
        >
          <Icon name="menu" size={30} color={themeColors.iconColor} />
        </TouchableOpacity>
        
        <View style={[styles.headerTitleContainer, { alignItems: 'center' }]}>
          <Text style={[styles.headerTitle, { color: themeColors.textColor }]}>
            {currentAddress ? 
              addresses.find(addr => addr.host === currentAddress)?.title || 'OpenUI' 
              : 'OpenUI'
            }
          </Text>
          {currentAddress && (
            <Text style={[styles.headerSubtitle, { color: themeColors.secondaryText }]}>
              {currentAddress}
            </Text>
          )}
        </View>
      </View>

      {currentAddress ? (
        <WebView 
          source={{ uri: currentAddress }}
          style={styles.webview}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => console.log('Start loading')}
          onLoadEnd={() => console.log('End loading')}
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
        />
      ) : (
        <WelcomeScreen onAddServer={() => setModalVisible(true)} />
      )}

<AddServerModal
  isVisible={isModalVisible}
  onClose={closeModal}
  onSave={saveAddress}
  serverData={newAddress}
  onUpdateServerData={setNewAddress}
  isEditing={editingAddress !== null}
/>

      {/* Меню со списком адресов */}
      <MenuModal
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        addresses={addresses}
        onAddServer={() => {
          setMenuVisible(false);
          setTimeout(() => setModalVisible(true), 300);
        }}
        onEditServer={(index) => {
          startEditing(index);
          setMenuVisible(false);
        }}
        onDeleteServer={deleteAddress}
        onSelectServer={(host) => {
          setCurrentAddress(host);
          setMenuVisible(false);
        }}
        onShowAbout={() => {
          setMenuVisible(false);
          setShowAbout(true);
        }}
        currentAddress={currentAddress}
      />

      {/* Модальное окно About */}
      <Modal
        visible={showAbout}
        animationType="slide"
        transparent={false}
      >
        <AboutScreen />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    height: 60,
  },
  addButton: undefined,
  addButtonText: undefined,
  webview: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholderButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  placeholderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    backgroundColor: '#fff',
    width: '100%',
    minHeight: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  menuHeader: {
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuTitleContainer: {
    flex: 1,
  },
  menuHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHeaderButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 16,
  },
  addressList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  addressListContent: {
    paddingVertical: 15,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },
  addressInfo: {
    flex: 1,
    paddingRight: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressHost: {
    fontSize: 14,
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  defaultLabel: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuFooter: {
    padding: 15,
    paddingBottom: 30,
  },
  closeButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalHeader: {
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
  },
  modalForm: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  aboutHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  aboutHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  aboutVersion: {
    fontSize: 16,
    marginTop: 5,
  },
  aboutInfoCard: {
    borderRadius: 12,
    padding: 15,
    marginTop: 30,
  },
  aboutInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  aboutInfoLabel: {
    fontSize: 14,
  },
  aboutInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  aboutInfoDivider: {
    height: 1,
    marginVertical: 10,
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  menuButton: {
    padding: 5,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  aboutFooter: {
    marginTop: 'auto',
    paddingVertical: 20,
    alignItems: 'center',
  },
  aboutCopyright: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  aboutLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  aboutInfoLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  aboutContainer: {
    flex: 1,
    backgroundColor: '#4A00E0',
  },
  aboutBackgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  aboutBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4A00E0',
  },
  aboutGradient1: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.5,
    height: Dimensions.get('window').height * 1.5,
    backgroundColor: 'rgba(142, 45, 226, 0.4)',
    borderRadius: Dimensions.get('window').width,
  },
  aboutGradient2: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 1.2,
    backgroundColor: 'rgba(74, 0, 224, 0.3)',
    borderRadius: Dimensions.get('window').width,
    top: 100,
  },
  aboutHeaderContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 2,
  },
  aboutBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutScrollView: {
    flex: 1,
  },
  aboutScrollContent: {
    flexGrow: 1,
  },
  aboutContent: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  aboutLogoSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  aboutLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  aboutAppName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aboutDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  aboutCards: {
    gap: 16,
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aboutCardIcon: {
    marginRight: 16,
  },
  aboutCardContent: {
    flex: 1,
  },
  aboutCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  aboutCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default App;