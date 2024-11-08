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
        quantity: 1,
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

    const existingProductIndex = fridge.products.findIndex(p => p.id === product.id);

    if (existingProductIndex !== -1) {
      // Si le produit existe déjà, augmenter sa quantité
      fridge.products[existingProductIndex].quantity += 1;
    } else {
      // Si c'est un nouveau produit, l'ajouter avec une quantité de 1
      fridge.products.push({
        ...product,
        quantity: 1
      });
    }

    await updateFridge(fridge);
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

    const productIndex = fridge.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      if (fridge.products[productIndex].quantity > 1) {
        // Si la quantité est supérieure à 1, la décrémenter
        fridge.products[productIndex].quantity -= 1;
      } else {
        // Si la quantité est de 1, supprimer le produit
        fridge.products = fridge.products.filter(p => p.id !== productId);
      }
    }

    await updateFridge(fridge);
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=1`
    );

    if (response.data.products) {
      return response.data.products.map((product: any) => ({
        id: product.code,
        name: product.product_name || 'Produit sans nom',
        brand: product.brands,
        image_url: product.image_url || 'https://via.placeholder.com/150',
        quantity: 1,
        nutriments: product.nutriments,
        ingredients_text: product.ingredients_text,
        nutriscore_grade: product.nutriscore_grade,
      }));
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche des produits:', error);
    return [];
  }
}