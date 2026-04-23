import { type Component } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

type LucideLibrary = Record<string, Component>

export const categoryIconKeys = [
  'ShoppingBasket',
  'Utensils',
  'CarFront',
  'Flame',
  'Home',
  'Pill',
  'Gamepad2',
  'Plane',
  'GraduationCap',
  'Dog',
  'Baby',
  'Gift',
  'Shirt',
  'Dumbbell',
  'Briefcase',
  'PiggyBank',
  'TrendingUp',
  'Banknote',
  'CreditCard',
  'Wallet',
] as const

export const getIcon = (name: string): Component => {
  const icons = LucideIcons as unknown as LucideLibrary
  const icon = icons[name]
  return icon || (LucideIcons.CircleHelp as Component)
}

export function useIcons() {
  return {
    getIcon,
    iconKeys: categoryIconKeys,
  }
}
