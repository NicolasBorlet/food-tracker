import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Fridge } from '../types/types';
import { getFridges } from '../utils/fridgeUtils';

interface FridgeContextType {
  selectedFridgeId: string | null;
  setSelectedFridgeId: (id: string | null) => Promise<void>;
  selectedFridge: Fridge | null;
  fridges: Fridge[];
  refreshFridges: () => Promise<void>;
}

const FridgeContext = createContext<FridgeContextType | undefined>(undefined);

const SELECTED_FRIDGE_KEY = 'selected_fridge_id';

export function FridgeProvider({ children }: { children: React.ReactNode }) {
  const [selectedFridgeId, setSelectedFridgeId] = useState<string | null>(null);
  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [selectedFridge, setSelectedFridge] = useState<Fridge | null>(null);

  const loadInitialData = async () => {
    try {
      const [savedFridges, savedFridgeId] = await Promise.all([
        getFridges(),
        AsyncStorage.getItem(SELECTED_FRIDGE_KEY)
      ]);

      setFridges(savedFridges);

      if (savedFridgeId) {
        setSelectedFridgeId(savedFridgeId);
      } else if (savedFridges.length > 0) {
        // Si aucun frigo n'est sélectionné mais qu'il en existe, sélectionner le premier
        setSelectedFridgeId(savedFridges[0].id);
        await AsyncStorage.setItem(SELECTED_FRIDGE_KEY, savedFridges[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données initiales:', error);
    }
  };

  const refreshFridges = async () => {
    const updatedFridges = await getFridges();
    setFridges(updatedFridges);
  };

  const updateSelectedFridgeId = async (id: string | null) => {
    setSelectedFridgeId(id);
    if (id) {
      await AsyncStorage.setItem(SELECTED_FRIDGE_KEY, id);
    } else {
      await AsyncStorage.removeItem(SELECTED_FRIDGE_KEY);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const fridge = fridges.find(f => f.id === selectedFridgeId) || null;
    setSelectedFridge(fridge);
  }, [selectedFridgeId, fridges]);

  return (
    <FridgeContext.Provider
      value={{
        selectedFridgeId,
        setSelectedFridgeId: updateSelectedFridgeId,
        selectedFridge,
        fridges,
        refreshFridges
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
}

export function useFridge() {
  const context = useContext(FridgeContext);
  if (context === undefined) {
    throw new Error('useFridge doit être utilisé à l\'intérieur d\'un FridgeProvider');
  }
  return context;
}