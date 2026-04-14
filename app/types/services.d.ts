import { createAccountService } from "~/services/AccountService";
import { createAuthService } from "~/services/AuthService";
import { createBudgetService } from "~/services/BudgetService";
import { createCategoryService } from "~/services/CategoryService";
import { createGroupService } from "~/services/GroupService";
import { createPlannedTransactionService } from "~/services/PlannedTransactionService";
import { createTransactionService } from "~/services/TransactionService";
import { createUserService } from "~/services/UserService";

interface ApiServices {
  auth: ReturnType<typeof createAuthService>;
  user: ReturnType<typeof createUserService>;
  accounts: ReturnType<typeof createAccountService>;
  groups: ReturnType<typeof createGroupService>;
  budgets: ReturnType<typeof createBudgetService>;
  categories: ReturnType<typeof createCategoryService>;
  transactions: ReturnType<typeof createTransactionService>;
  plannedTransactions: ReturnType<typeof createPlannedTransactionService>;
}

declare module "#app" {
  interface NuxtApp {
    $services: ApiServices;
  }
}

export {};
