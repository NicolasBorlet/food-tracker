export interface Product {
  id: string;
  name: string;
  brand?: string;
  image_url: string;
  quantity: number;
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

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  addedAt: string;
}

export interface Fridge {
  id: string;
  name: string;
  products: Product[];
  shoppingList: ShoppingListItem[];
}