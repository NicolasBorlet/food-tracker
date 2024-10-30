import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  nutriments: {
    energy_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  ingredients_text?: string;
  nutriscore_grade?: string;
}

const STORAGE_KEY = 'scanned_products';

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

export async function saveProduct(product: Product): Promise<void> {
  try {
    const existingProductsJson = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Produits existants:', existingProductsJson);

    const existingProducts: Product[] = existingProductsJson
      ? JSON.parse(existingProductsJson)
      : [];

    const productExists = existingProducts.some(p => p.id === product.id);
    if (!productExists) {
      existingProducts.push(product);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingProducts));
      console.log('Produit sauvegardé avec succès:', product);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du produit:', error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const productsJson = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Récupération des produits:', productsJson);

    if (!productsJson) {
      console.log('Aucun produit trouvé dans le storage');
      return [];
    }

    const products = JSON.parse(productsJson);
    console.log('Produits parsés:', products);
    return products;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const products = await getProducts();
    const updatedProducts = products.filter(p => p.id !== productId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
}