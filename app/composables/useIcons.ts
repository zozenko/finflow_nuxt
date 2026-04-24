import {
  ShoppingBasket,
  Utensils,
  CarFront,
  Flame,
  Home,
  Pill,
  Gamepad2,
  Plane,
  GraduationCap,
  Dog,
  Baby,
  Gift,
  Shirt,
  Dumbbell,
  Briefcase,
  PiggyBank,
  TrendingUp,
  Banknote,
  CreditCard,
  Wallet,
  CircleHelp,
  type LucideIcon,
} from "lucide-vue-next";

const iconMap: Record<string, LucideIcon> = {
  ShoppingBasket,
  Utensils,
  CarFront,
  Flame,
  Home,
  Pill,
  Gamepad2,
  Plane,
  GraduationCap,
  Dog,
  Baby,
  Gift,
  Shirt,
  Dumbbell,
  Briefcase,
  PiggyBank,
  TrendingUp,
  Banknote,
  CreditCard,
  Wallet,
};

export const appIconKeys = Object.keys(iconMap) as Array<keyof typeof iconMap>;

export const getIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return CircleHelp;
  return iconMap[name] || CircleHelp;
};

export function useIcons() {
  return {
    getIcon,
    iconKeys: appIconKeys,
  };
}
