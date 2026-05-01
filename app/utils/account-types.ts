export interface AccountConfig {
  icon: string;
  color: string;
}

export const ACCOUNT_TYPE_MAP: Record<string, AccountConfig> = {
  cash: { icon: "Banknote", color: "#fcb73f" },
  card: { icon: "CreditCard", color: "#32bafa" },
  savings: { icon: "PiggyBank", color: "#00ca8b" },
  credit: { icon: "Flame", color: "#dc5a61" },
};

export const getAccountConfig = (
  type: string | null | undefined,
): AccountConfig => {
  if (!type) return { icon: "Wallet", color: "#6B7280" };

  return ACCOUNT_TYPE_MAP[type] || { icon: "Wallet", color: "#6B7280" };
};
