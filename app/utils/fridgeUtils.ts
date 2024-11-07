import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fridge } from '../types/types';

const FRIDGES_STORAGE_KEY = 'fridges';

export async function getFridges(): Promise<Fridge[]> {
  try {
    const fridgesJson = await AsyncStorage.getItem(FRIDGES_STORAGE_KEY);
    const fridges = fridgesJson ? JSON.parse(fridgesJson) : [];
    // S'assurer que chaque frigo a tous les champs requis
    return fridges.map((fridge: Partial<Fridge>) => ({
      id: fridge.id || `${Date.now()}`,
      name: fridge.name || 'Nouveau Frigo',
      products: fridge.products || [],
      shoppingList: fridge.shoppingList || []
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des frigos:', error);
    return [];
  }
}

export async function addFridge(name: string): Promise<Fridge> {
  try {
    const fridges = await getFridges();
    const newFridge: Fridge = {
      id: `${Date.now()}`,
      name,
      products: [], // Initialisation explicite du tableau products
      shoppingList: [] // Initialisation explicite du tableau shoppingList
    };

    fridges.push(newFridge);
    await AsyncStorage.setItem(FRIDGES_STORAGE_KEY, JSON.stringify(fridges));
    return newFridge;
  } catch (error) {
    console.error('Erreur lors de la création du frigo:', error);
    throw error;
  }
}

export async function updateFridge(updatedFridge: Fridge): Promise<void> {
  try {
    const fridges = await getFridges();
    const updatedFridges = fridges.map(fridge =>
      fridge.id === updatedFridge.id
        ? {
            ...updatedFridge,
            products: updatedFridge.products || [],
            shoppingList: updatedFridge.shoppingList || []
          }
        : fridge
    );
    await AsyncStorage.setItem(FRIDGES_STORAGE_KEY, JSON.stringify(updatedFridges));
  } catch (error) {
    console.error('Erreur lors de la mise à jour du frigo:', error);
    throw error;
  }
}

export async function deleteFridge(fridgeId: string): Promise<void> {
  try {
    const fridges = await getFridges();
    const updatedFridges = fridges.filter(fridge => fridge.id !== fridgeId);
    await AsyncStorage.setItem(FRIDGES_STORAGE_KEY, JSON.stringify(updatedFridges));
  } catch (error) {
    console.error('Erreur lors de la suppression du frigo:', error);
    throw error;
  }
}