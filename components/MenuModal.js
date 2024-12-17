import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  StyleSheet, 
  Dimensions, 
  Animated, 
  Platform, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuModal = ({ 
  isVisible, 
  onClose, 
  addresses, 
  onAddServer, 
  onEditServer, 
  onDeleteServer, 
  onSelectServer, 
  onShowAbout,
  currentAddress 
}) => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      animation1.setValue(0);
      animation2.setValue(0);
      fadeAnim.setValue(0);

      // Start animations
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

      loopAnimation1.start();
      loopAnimation2.start();
      fadeAnimation.start();

      return () => {
        loopAnimation1.stop();
        loopAnimation2.stop();
        fadeAnimation.stop();
      };
    }
  }, [isVisible]);

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
      <SafeAreaView style={styles.menuContainer}>
        {/* Фоновый слой */}
        <View style={styles.menuBackgroundContainer}>
          <View style={styles.menuBackground} />
          <Animated.View style={[
            styles.menuGradient1,
            { transform: [{ translateX: translateX1 }, { translateY: translateX1 }] }
          ]} />
          <Animated.View style={[
            styles.menuGradient2,
            { transform: [{ translateX: translateX2 }, { translateY: translateX2 }] }
          ]} />
        </View>

        {/* Контент */}
        <Animated.View style={[styles.menuContent, { opacity: fadeAnim }]}>
          {/* Заголовок */}
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.menuTitle}>OpenUI</Text>
              <Text style={styles.menuSubtitle}>Список серверов</Text>
            </View>
            <View style={styles.menuActions}>
              <TouchableOpacity
                style={styles.menuActionButton}
                onPress={onAddServer}
              >
                <Icon name="add-circle-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuActionButton}
                onPress={onShowAbout}
              >
                <Icon name="information-circle-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Список серверов */}
          <ScrollView 
            style={styles.serverList}
            contentContainerStyle={styles.serverListContent}
          >
            {addresses.map((address, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.serverCard,
                  currentAddress === address.host && styles.serverCardActive
                ]}
                onPress={() => onSelectServer(address.host)}
                activeOpacity={0.8}
              >
                <View style={styles.serverInfo}>
                  <View style={styles.serverMainInfo}>
                    <Icon 
                      name="server-outline" 
                      size={20} 
                      color="#fff" 
                      style={styles.serverIcon}
                    />
                    <Text style={styles.serverTitle}>{address.title}</Text>
                  </View>
                  <Text style={styles.serverHost}>{address.host}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>По умолчанию</Text>
                    </View>
                  )}
                </View>
                <View style={styles.serverActions}>
                  <TouchableOpacity
                    style={styles.serverActionButton}
                    onPress={() => onEditServer(index)}
                  >
                    <Icon name="pencil" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.serverActionButton}
                    onPress={() => onDeleteServer(index)}
                  >
                    <Icon name="trash-bin" size={18} color="#ff4757" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {addresses.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="server-outline" size={48} color="rgba(255,255,255,0.5)" />
                <Text style={styles.emptyStateText}>
                  Нет добавленных серверов
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={onAddServer}
                >
                  <Text style={styles.emptyStateButtonText}>
                    Добавить сервер
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Нижняя кнопка */}
          <View style={styles.menuFooter}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#4A00E0',
  },
  menuBackgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  menuBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4A00E0',
  },
  menuGradient1: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.5,
    height: Dimensions.get('window').height * 1.5,
    backgroundColor: 'rgba(142, 45, 226, 0.4)',
    borderRadius: Dimensions.get('window').width,
  },
  menuGradient2: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 1.2,
    backgroundColor: 'rgba(74, 0, 224, 0.3)',
    borderRadius: Dimensions.get('window').width,
    top: 100,
  },
  menuContent: {
    flex: 1,
    zIndex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
    paddingBottom: 20,
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverList: {
    flex: 1,
  },
  serverListContent: {
    padding: 20,
    gap: 12,
  },
  serverCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serverCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  serverInfo: {
    flex: 1,
    marginRight: 16,
  },
  serverMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serverIcon: {
    marginRight: 8,
  },
  serverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  serverHost: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  defaultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  serverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  serverActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuFooter: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenuModal;