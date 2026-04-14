import type { AxiosInstance } from "axios";
import { createAccountService } from "~/services/AccountService";
import { createAuthService } from "~/services/AuthService";
import { createBudgetService } from "~/services/BudgetService";
import { createCategoryService } from "~/services/CategoryService";
import { createGroupService } from "~/services/GroupService";
import { createPlannedTransactionService } from "~/services/PlannedTransactionService";
import { createTransactionService } from "~/services/TransactionService";
import { createUserService } from "~/services/UserService";

export default defineNuxtPlugin((nuxtApp) => {
  const api = nuxtApp.$api as AxiosInstance;

  const services = {
    auth: createAuthService(api),
    user: createUserService(api),
    accounts: createAccountService(api),
    groups: createGroupService(api),
    budgets: createBudgetService(api),
    categories: createCategoryService(api),
    transactions: createTransactionService(api),
    plannedTransactions: createPlannedTransactionService(api),
  };

  return {
    provide: {
      services,
    },
  };
});
