export type GameId = "pokemon" | "yugioh" | "onepiece" | "riftbound";

export type Category = "singles" | "sealed" | "graded";

export interface Card {
  id: string;
  game: GameId;
  category: Category;
  name: string;
  set_name: string;
  rarity: string;
  price: number;
  condition: string;
  image_url: string;
  badge: string | null;
  badge_color: string | null;
  foil: boolean;
  stock: number;
  description: string | null;
  created_at?: string;
}

export interface CartLine {
  card: Card;
  quantity: number;
}

export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  stripe_session_id: string | null;
  created_at: string;
}
