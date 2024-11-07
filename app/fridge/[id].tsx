import Block from '@/components/block';
import Progress from '@/components/progress';
import { Card } from '@/components/styled-card';
import { Body, H1, H2 } from '@/components/styled-title';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFridge } from '../contexts/FridgeContext';
import { Product } from '../types/types';
import { getProducts } from '../utils/productUtils';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);

  const { selectedFridgeId } = useFridge();

  useEffect(() => {
    loadProduct()
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product?.name || 'Produit',
    });
  }, [product]);

  const loadProduct = async () => {
    const products = await getProducts(selectedFridgeId || '');
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image source={{ uri: product.image_url }} style={styles.productImage} />

      <Block style={styles.content}>
        <H1>{product.name}</H1>
        {product.brand && <H2>Marque: {product.brand}</H2>}

        {/* Nutri-Score */}
        {product.nutriscore_grade && (
          <Block>
            <Card title='Nutri-Score'>
              <Body>
                {product.nutriscore_grade === 'not-applicable' ? 'N/A' : product.nutriscore_grade.toUpperCase()}
              </Body>
            </Card>
          </Block>
        )}

        {/* Informations nutritionnelles */}
        <Block>
          <Card title='Informations Nutritionnelles (pour 100g)'>
            <Block>
              <Body>Énergie</Body>
              <Text>{product.nutriments["energy-kcal_100g"]} kcal</Text>
            </Block>
            <Progress title='Glucides' value={product.nutriments.carbohydrates_100g || 0} maxValue={100} />
            <Progress title='Sucres' value={product.nutriments.sugars_100g || 0} maxValue={100} />
            <Progress title='Lipides' value={product.nutriments.fat_100g || 0} maxValue={100} />
            <Progress title='Acides Gras Saturés' value={product.nutriments["saturated-fat_100g"] || 0} maxValue={100} />
            <Progress title='Fibres' value={product.nutriments.fiber_100g || 0} maxValue={100} />
            <Progress title='Sel' value={product.nutriments.salt_100g || 0} maxValue={100} />
          </Card>
        </Block>

        {/* Empreinte Carbone */}
        {product.nutriscore_grade && (
          <Block>
            <Card title='Empreinte Carbone'>
              <Body>Empreinte carbone (pour 100g) : {product.nutriscore_grade["carbon-footprint-from-known-ingredients_100g"] || "N/A"}</Body>
            </Card>
          </Block>
        )}

        {/* Groupe NOVA */}
        {product.nutriscore_grade && (
          <Block>
            <Card title='Groupe NOVA'>
              <Body>Classification : {product.nutriscore_grade["nova-group_100g"] === 'not-applicable' ? 'N/A' : product.nutriscore_grade["nova-group_100g"]}</Body>
            </Card>
          </Block>
        )}

        {/* Ingrédients */}
        {product.ingredients_text && (
          <Block>
            <Card title='Ingrédients'>
              <Body>{product.ingredients_text}</Body>
            </Card>
          </Block>
        )}
      </Block>
    </ScrollView>
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
    gap: 16,
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
  section: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutriment: {
    fontSize: 16,
    marginVertical: 4,
  },
  nutriments: {
    marginVertical: 8,
  },
  nutriscoreContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  nutriscore: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  ingredients: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
});
