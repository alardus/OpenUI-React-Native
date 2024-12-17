import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Platform, 
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddServerModal = ({ 
  isVisible, 
  onClose, 
  onSave, 
  serverData, 
  onUpdateServerData,
  isEditing 
}) => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset animations when modal becomes visible
      animation1.setValue(0);
      animation2.setValue(0);
      fadeAnim.setValue(0);

      // Gradient animations
      const loopAnimation1 = Animated.loop(
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
      );

      const loopAnimation2 = Animated.loop(
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
      );

      const fadeAnimation = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      });

      // Start all animations
      loopAnimation1.start();
      loopAnimation2.start();
      fadeAnimation.start();

      // Cleanup function to stop animations when component unmounts or modal closes
      return () => {
        loopAnimation1.stop();
        loopAnimation2.stop();
        fadeAnimation.stop();
      };
    }
  }, [isVisible, animation1, animation2, fadeAnim]);

  const translateX1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const translateX2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Background layer */}
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

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>
                {isEditing ? 'Редактирование сервера' : 'Новый сервер'}
              </Text>
              <Text style={styles.subtitle}>
                Введите данные для подключения
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название</Text>
              <View style={styles.inputWrapper}>
                <Icon name="bookmark-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Мой сервер"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={serverData.title}
                  onChangeText={(text) => onUpdateServerData({ ...serverData, title: text })}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Адрес сервера</Text>
              <View style={styles.inputWrapper}>
                <Icon name="link-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="https://host:port"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={serverData.host}
                  onChangeText={(text) => onUpdateServerData({ ...serverData, host: text })}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => onUpdateServerData({ ...serverData, isDefault: !serverData.isDefault })}
            >
              <Icon 
                name={serverData.isDefault ? "checkbox" : "square-outline"} 
                size={22} 
                color="#fff" 
              />
              <Text style={styles.checkboxLabel}>
                Использовать по умолчанию
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.footerButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Отмена</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.footerButton, styles.saveButton]} 
              onPress={onSave}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    margin: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
  },
  header: {
    padding: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 12,
    paddingLeft: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A00E0',
  },
  cancelButtonText: {
    color: '#fff',
  },
});

export default AddServerModal;