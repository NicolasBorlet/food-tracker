import Block from '@/components/block';
import { Body, H1 } from '@/components/styled-title';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, deleteProduct, getProducts } from '../utils/productUtils';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    console.log('Chargement des produits...');
    const loadedProducts = await getProducts();
    console.log('Produits chargés:', loadedProducts);
    setProducts(loadedProducts);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    await loadProducts();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <Link
      href={`/fridge/${item.id}`}
      asChild
    >
      <TouchableOpacity style={styles.productCard}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
        />
        <Block style={styles.productInfo}>
          <H1 style={styles.productName}>{item.name}</H1>
          <Body style={styles.productBrand}>{item.brand}</Body>
        </Block>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <Block style={{ gap: 16 }}>
        <H1>Mon frigo</H1>
        <FlashList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={100}
        />
      </Block>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
  },
});