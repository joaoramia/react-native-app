import AsyncStorage from '@react-native-community/async-storage'

export async function getUserToken() {
  return await AsyncStorage.getItem('userToken');
}

export async function getUserCoords() {
  return JSON.parse(await AsyncStorage.getItem('coords') || null);
}
