export type MenuCategory = 
  | 'all'
  | 'specialties'
  | 'current_offers'
  | 'signature_sandwiches'
  | 'pizzas_tacos'
  | 'sides_drinks';

export interface BreadOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface IngredientModifier {
  id: string;
  name: string;
  category: 'meat' | 'cheese' | 'veggie' | 'condiment';
  priceDelta: number;
  calories: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  calories: number;
  image: string;
  dietaryTags: string[];
  breadOptions?: BreadOption[];
  availableModifiers?: IngredientModifier[];
  prepTime: string;
  isSpecialty?: boolean;
  isOffer?: boolean;
}

export interface CartItem {
  cartId: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedBread?: string;
  toastLevel?: string;
  selectedModifiers?: string[];
  specialInstructions?: string;
  isCustom3D?: boolean;
  custom3DDetails?: {
    layersSummary: string[];
    toasted: boolean;
  };
}

export type OrderStage = 
  | 'order_received'
  | 'kitchen_prep'
  | 'grilling_packing'
  | 'ready_for_pickup';

export interface OrderRecord {
  orderId: string;
  customerName: string;
  customerPhone: string;
  fulfillmentType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  placedAt: string;
  estimatedMinutes: number;
  currentStage: OrderStage;
}
