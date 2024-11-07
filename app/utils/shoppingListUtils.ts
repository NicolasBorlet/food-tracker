import { ShoppingListItem } from '../types/types';
import { getFridges, updateFridge } from './fridgeUtils';

export async function addShoppingListItem(
  fridgeId: string,
  itemName: string,
  quantity: number = 1
): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    const newItem: ShoppingListItem = {
      id: `${Date.now()}`,
      name: itemName,
      quantity,
      completed: false,
      addedAt: new Date().toISOString()
    };

    fridge.shoppingList.push(newItem);
    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un item à la liste de courses:', error);
    throw error;
  }
}

export async function updateShoppingListItem(
  fridgeId: string,
  itemId: string,
  updates: Partial<ShoppingListItem>
): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    fridge.shoppingList = fridge.shoppingList.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un item de la liste de courses:', error);
    throw error;
  }
}

export async function deleteShoppingListItem(
  fridgeId: string,
  itemId: string
): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    fridge.shoppingList = fridge.shoppingList.filter(item => item.id !== itemId);
    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un item de la liste de courses:', error);
    throw error;
  }
}

export async function toggleShoppingListItem(
  fridgeId: string,
  itemId: string
): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    fridge.shoppingList = fridge.shoppingList.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors du changement de statut d\'un item de la liste de courses:', error);
    throw error;
  }
}