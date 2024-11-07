import Block from '@/components/block';
import { ListingItem } from '@/components/styled-listing-item';
import { Body, H1 } from '@/components/styled-title';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFridge } from '../contexts/FridgeContext';
import { Product } from '../types/types';
import { addFridge, deleteFridge } from '../utils/fridgeUtils';
import { deleteProduct, getProducts } from '../utils/productUtils';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { fridges, selectedFridgeId, setSelectedFridgeId, refreshFridges } = useFridge();

  useFocusEffect(
    useCallback(() => {
      refreshFridges();
      if (selectedFridgeId) {
        loadProducts(selectedFridgeId);
      }
    }, [selectedFridgeId])
  );

  const loadProducts = async (fridgeId: string) => {
    const loadedProducts = await getProducts(fridgeId);
    setProducts(loadedProducts);
  };

  const handleAddFridge = () => {
    Alert.prompt(
      "Nouveau frigo",
      "Entrez le nom du nouveau frigo",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Créer",
          onPress: async (name?: string) => {
            if (!name || name.trim() === '') {
              Alert.alert(
                "Erreur",
                "Le nom du frigo ne peut pas être vide"
              );
              return;
            }
            try {
              const newFridge = await addFridge(name.trim());
              await refreshFridges();
              await setSelectedFridgeId(newFridge.id);
            } catch (error) {
              console.error('Erreur lors de la création du frigo:', error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la création du frigo"
              );
            }
          }
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    if (selectedFridgeId) {
      await deleteProduct(productId, selectedFridgeId);
      await loadProducts(selectedFridgeId);
    }
  };

  const handleDeleteFridge = async () => {
    if (!selectedFridgeId) return;

    // Vérifier s'il ne reste qu'un seul frigo
    if (fridges.length <= 1) {
      Alert.alert(
        "Action impossible",
        "Vous ne pouvez pas supprimer le dernier frigo.",
        [{ text: "OK" }]
      );
      return;
    }

    // Afficher le popup de confirmation
    Alert.alert(
      "Supprimer le frigo",
      "Êtes-vous sûr de vouloir supprimer ce frigo et tout son contenu ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFridge(selectedFridgeId);
              // Sélectionner automatiquement un autre frigo
              const remainingFridges = fridges.filter(f => f.id !== selectedFridgeId);
              if (remainingFridges.length > 0) {
                await setSelectedFridgeId(remainingFridges[0].id);
              }
              await refreshFridges();
            } catch (error) {
              console.error('Erreur lors de la suppression du frigo:', error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la suppression du frigo."
              );
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <Link href={`/fridge/${item.id}`} asChild>
      <TouchableOpacity>
        <ListingItem>
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Block style={styles.productInfo}>
            <H1 style={styles.productName}>{item.name}</H1>
            <Body style={styles.productBrand}>{item.brand}</Body>
          </Block>
          <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
            <Ionicons name="trash-outline" size={24} color="rgb(255, 90, 79)" />
          </TouchableOpacity>
        </ListingItem>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <Block style={{ gap: 16 }}>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Block style={{ flex: 1 }}>
            <H1>Mon frigo</H1>
          </Block>
          <View style={{ gap: 8, alignItems: 'center', flexDirection: 'row' }}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedFridgeId(value)}
              value={selectedFridgeId}
              items={fridges.map((fridge) => ({
                label: fridge.name,
                value: fridge.id,
              }))}
            />
            <TouchableOpacity onPress={handleAddFridge}>
              <Ionicons name="add-outline" size={24} color="rgb(255, 90, 79)" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteFridge}>
              <Ionicons name="trash-outline" size={24} color="rgb(255, 90, 79)" />
            </TouchableOpacity>
          </View>
        </View>
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