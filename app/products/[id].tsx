import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, getProducts } from '../utils/productUtils';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const products = await getProducts();
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct || null);
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Produit non trouvé</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.brand}>{product.brand}</Text>

          <Text style={styles.sectionTitle}>Informations nutritionnelles</Text>
          <View style={styles.nutriments}>
            <Text>Énergie: {product.nutriments.energy_100g || 'N/A'} kcal/100g</Text>
            <Text>Protéines: {product.nutriments.proteins_100g || 'N/A'} g/100g</Text>
            <Text>Glucides: {product.nutriments.carbohydrates_100g || 'N/A'} g/100g</Text>
            <Text>Lipides: {product.nutriments.fat_100g || 'N/A'} g/100g</Text>
          </View>

          {product.ingredients_text && (
            <>
              <Text style={styles.sectionTitle}>Ingrédients</Text>
              <Text>{product.ingredients_text}</Text>
            </>
          )}

          {product.nutriscore_grade && (
            <View style={styles.nutriscoreContainer}>
              <Text style={styles.sectionTitle}>Nutri-Score</Text>
              <Text style={styles.nutriscore}>
                {product.nutriscore_grade.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  nutriments: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  nutriscoreContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  nutriscore: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});