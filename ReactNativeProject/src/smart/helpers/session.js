import AsyncStorage from '@react-native-community/async-storage'

export async function getUserToken() {
  return await AsyncStorage.getItem('userToken');
}