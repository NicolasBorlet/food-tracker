import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useState } from 'react';
import { Image, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Product } from '../app/types/types';
import { searchProducts } from '../app/utils/productUtils';
import Block from './block';
import { ListingItem } from './styled-listing-item';
import { Body, H1 } from './styled-title';

interface SearchProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SearchProductModal({ isVisible, onClose, onSelectProduct }: SearchProductModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      setIsLoading(true);
      try {
        const results = await searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setProducts([]);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => {
      onSelectProduct(item);
      onClose();
    }}>
      <ListingItem>
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Block style={styles.productInfo}>
          <H1 style={styles.productName}>{item.name}</H1>
          {item.brand && <Body style={styles.productBrand}>{item.brand}</Body>}
        </Block>
      </ListingItem>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
          <H1>Rechercher un produit</H1>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Veuillez entrer minimum 3 caractères..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <Body>Chargement...</Body>
          </View>
        ) : products.length === 0 && searchQuery.length >= 3 ? (
          <View style={styles.centerContent}>
            <Body>Aucun produit trouvé</Body>
          </View>
        ) : (
          <Block style={{ paddingHorizontal: 16 }}>
            <FlashList
              data={products}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              estimatedItemSize={5}
            />
          </Block>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  productImage: {
    width: 60,
    height: 60,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});