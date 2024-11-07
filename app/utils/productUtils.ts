import axios from 'axios';
import { Product } from '../types/types';
import { getFridges, updateFridge } from './fridgeUtils';

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

export async function saveProduct(product: Product, fridgeId: string): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    const productExists = fridge.products.some(p => p.id === product.id);
    if (!productExists) {
      fridge.products.push(product);
      await updateFridge(fridge);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du produit:', error);
    throw error;
  }
}

export async function getProducts(fridgeId: string): Promise<Product[]> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);
    return fridge?.products || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
}

export async function deleteProduct(productId: string, fridgeId: string): Promise<void> {
  try {
    const fridges = await getFridges();
    const fridge = fridges.find(f => f.id === fridgeId);

    if (!fridge) {
      throw new Error('Frigo non trouvé');
    }

    fridge.products = fridge.products.filter(p => p.id !== productId);
    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
}