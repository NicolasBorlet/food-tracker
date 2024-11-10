import { useFridge } from "@/app/contexts/FridgeContext";
import { ShoppingListItem } from "@/app/types/types";
import { addShoppingListItem, deleteShoppingListItem, toggleShoppingListItem, updateShoppingListItem } from "@/app/utils/shoppingListUtils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Block from "./block";
import { StyledButton } from "./styled-button";
import { Body, ButtonText, H1 } from "./styled-title";

interface ShopListModalProps {
  isVisible: boolean;
  onClose: () => void;
}


export default function ShopListModal({ isVisible, onClose }: ShopListModalProps) {
  const { fridges, selectedFridgeId, refreshFridges } = useFridge();

  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (selectedFridgeId) {
      const fridge = fridges.find(fridge => fridge.id === selectedFridgeId);
      if (fridge) {
        const updatedShoppingList = fridge.shoppingList.map(item => ({
          ...item,
          quantity: item.quantity || 1
        }));
        setShoppingList(updatedShoppingList);
      }
    }
  }, [fridges, selectedFridgeId]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !selectedFridgeId) return;

    try {
      await addShoppingListItem(selectedFridgeId, newItemName.trim());
      setNewItemName("");
      refreshFridges();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedFridgeId) return;

    try {
      await deleteShoppingListItem(selectedFridgeId, itemId);
      refreshFridges();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'item:", error);
    }
  };

  const handleEditItem = (item: ShoppingListItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    inputRef.current?.focus();
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !selectedFridgeId || !newItemName.trim()) return;

    try {
      await updateShoppingListItem(selectedFridgeId, editingItem.id, {
        ...editingItem,
        name: newItemName.trim()
      });
      setEditingItem(null);
      setNewItemName("");
      refreshFridges();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'item:", error);
    }
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <View style={{
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    }}>
      <View style={styles.itemContainer}>
        <Pressable
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          onPress={async () => {
            if (selectedFridgeId) {
              try {
                await toggleShoppingListItem(selectedFridgeId, item.id);
                refreshFridges();
              } catch (error) {
                console.error("Erreur lors du changement de statut:", error);
              }
            }
          }}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </Pressable>
        <Body style={[
          styles.itemText,
          item.completed && styles.completedText
        ]}>
          {item.name}
        </Body>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable onPress={() => handleEditItem(item)}>
          <Feather name="edit" size={24} color="rgb(194, 115, 255)" />
        </Pressable>
        <Pressable onPress={() => handleDeleteItem(item.id)}>
          <Ionicons name="trash-outline" size={24} color="rgb(255, 90, 79)" />
        </Pressable>
      </View>
    </View>
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
          <H1>Liste des courses</H1>
        </View>

        <View style={[styles.inputContainer, { flexDirection: 'column', gap: 8, marginBottom: 16 }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder={editingItem ? "Modifier le produit..." : "Ajouter un produit..."}
            onSubmitEditing={editingItem ? handleUpdateItem : handleAddItem}
          />
          <StyledButton onPress={editingItem ? handleUpdateItem : handleAddItem}>
            <ButtonText>{editingItem ? "Modifier" : "Ajouter"}</ButtonText>
          </StyledButton>
          {editingItem && (
            <StyledButton
              onPress={() => {
                setEditingItem(null);
                setNewItemName("");
              }}
              style={{ backgroundColor: 'rgb(255, 90, 79)' }}
            >
              <ButtonText>Annuler</ButtonText>
            </StyledButton>
          )}
        </View>

        <FlashList
          data={shoppingList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          estimatedItemSize={5}
          ListEmptyComponent={() => (
            <Block>
              <Body>Aucun produit dans la liste</Body>
            </Block>
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
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
  inputContainer: {
    padding: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    minHeight: 48,
    textAlignVertical: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemText: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});