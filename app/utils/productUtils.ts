import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  image_url: string;
  nutriments: {
    energy_100g?: number;
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    "saturated-fat_100g"?: number;
    fiber_100g?: number;
    salt_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
    "carbon-footprint-from-known-ingredients_100g"?: number;
  };
  ingredients_text?: string;
  nutriscore_grade?: {
    [key: string]: number;
  };
  nova_group?: number;
}

const FRIDGES_STORAGE_KEY = 'fridges';

export async function addFridge(name: string) {
  try {
    const fridges = await getFridges();
    const fridge = { id: `${fridges.length + 1}`, name };
    await saveFridge(fridge);
    return fridge;
  } catch (error) {
    console.error('Erreur lors de la création du frigo:', error);
    throw error;
  }
}

export async function getFridges() {
  try {
    const fridgesJson = await AsyncStorage.getItem(FRIDGES_STORAGE_KEY);
    return fridgesJson ? JSON.parse(fridgesJson) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des frigos:', error);
    return [];
  }
}

export async function saveFridge(fridge: any) {
  try {
    const fridges: any[] = await getFridges();
    const fridgeExists = fridges.some(f => f.id === fridge.id);

    if (!fridgeExists) {
      fridges.push(fridge);
      await AsyncStorage.setItem(FRIDGES_STORAGE_KEY, JSON.stringify(fridges));
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du frigo:', error);
    throw error;
  }
}

export async function updateFridgeProducts(fridgeId: string, products: Product[]) {
  try {
    const fridges: any[] = await getFridges();
    const updatedFridges = fridges.map(fridge =>
      fridge.id === fridgeId ? { ...fridge, products } : fridge
    );
    await AsyncStorage.setItem(FRIDGES_STORAGE_KEY, JSON.stringify(updatedFridges));
  } catch (error) {
    console.error('Erreur lors de la mise à jour des produits du frigo:', error);
    throw error;
  }
}

// Fetch product data
export async function fetchProductData(barcode: string): Promise<Product | null> {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (response.data.status === 1) {
      const product = response.data.product;
      return {
        id: barcode,
        name: product.product_name,
        brand: product.brands,
        image_url: product.image_url,
        nutriments: product.nutriments,
        ingredients_text: product.ingredients_text,
        nutriscore_grade: product.nutriscore_grade,
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }
}

const STORAGE_KEY_PREFIX = 'fridge_products_';

export async function saveProduct(product: Product, fridgeId: string): Promise<void> {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${fridgeId}`;
    const existingProductsJson = await AsyncStorage.getItem(storageKey);
    const existingProducts: Product[] = existingProductsJson
      ? JSON.parse(existingProductsJson)
      : [];

    const productExists = existingProducts.some(p => p.id === product.id);
    if (!productExists) {
      existingProducts.push(product);
      await AsyncStorage.setItem(storageKey, JSON.stringify(existingProducts));
      console.log('Produit sauvegardé avec succès:', product);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du produit:', error);
    throw error;
  }
}

// Get products
export async function getProducts(fridgeId: string): Promise<Product[]> {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${fridgeId}`;
    const productsJson = await AsyncStorage.getItem(storageKey);
    return productsJson ? JSON.parse(productsJson) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
}

// Delete product
export async function deleteProduct(productId: string, fridgeId: string): Promise<void> {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${fridgeId}`;
    const products = await getProducts(fridgeId);
    const updatedProducts = products.filter(p => p.id !== productId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
}