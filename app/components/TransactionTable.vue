<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronDown, Settings2 } from "lucide-vue-next";

// 1. Конфігурація колонок із станом видимості (visible)
const columns = ref([
  { id: "date", label: "Дата", visible: true },
  { id: "category", label: "Категорія", visible: true },
  { id: "account", label: "Акаунт", visible: true },
  { id: "amount", label: "Сума", visible: true },
  { id: "actions", label: "Дії", visible: true },
]);

// 2. Обчислюємо лише ті колонки, які наразі увімкнені
const visibleColumns = computed(() =>
  columns.value.filter((col) => col.visible),
);

// Мокові дані для прикладу (замініть на ваші пропси або запит)
const transactions = ref([
  {
    id: 1,
    date: "2026-04-20",
    category: "Продукти",
    account: "Готівка",
    amount: -1500,
  },
  {
    id: 2,
    date: "2026-04-21",
    category: "Зарплата",
    account: "Картка",
    amount: 45000,
  },
  {
    id: 3,
    date: "2026-04-22",
    category: "Пальне",
    account: "Кредитка",
    amount: -2000,
  },
]);
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Історія транзакцій</h2>

      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton variant="outline" class="flex items-center gap-2">
            <Settings2 class="w-4 h-4" />
            Колонки
            <ChevronDown class="w-4 h-4 ml-1" />
          </UiButton>
        </UiDropdownMenuTrigger>

        <UiDropdownMenuContent align="end" class="bg-section min-w-40">
          <UiDropdownMenuCheckboxItem
            v-for="col in columns"
            :key="col.id"
            :model-value="col.visible"
            @select.prevent="col.visible = !col.visible"
          >
            {{ col.label }}
          </UiDropdownMenuCheckboxItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <div class="border rounded-xl overflow-hidden bg-section shadow-sm">
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead
              v-for="col in visibleColumns"
              :key="col.id"
              :class="{
                'text-right': col.id === 'amount' || col.id === 'actions',
              }"
            >
              {{ col.label }}
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>

        <UiTableBody>
          <UiTableRow v-for="tx in transactions" :key="tx.id">
            <UiTableCell v-if="columns.find((c) => c.id === 'date')?.visible">
              {{ tx.date }}
            </UiTableCell>

            <UiTableCell
              v-if="columns.find((c) => c.id === 'category')?.visible"
            >
              <span class="font-medium text-gray-700">{{ tx.category }}</span>
            </UiTableCell>

            <UiTableCell
              v-if="columns.find((c) => c.id === 'account')?.visible"
              class="text-gray-500"
            >
              {{ tx.account }}
            </UiTableCell>

            <UiTableCell
              v-if="columns.find((c) => c.id === 'amount')?.visible"
              class="text-right font-semibold"
              :class="tx.amount > 0 ? 'text-green-600' : 'text-gray-900'"
            >
              {{ tx.amount > 0 ? "+" : "" }}{{ tx.amount }} ₴
            </UiTableCell>

            <UiTableCell
              v-if="columns.find((c) => c.id === 'actions')?.visible"
              class="text-right"
            >
              <UiButton
                variant="ghost"
                size="sm"
                class="h-8 px-2 text-blue-600"
              >
                Деталі
              </UiButton>
            </UiTableCell>
          </UiTableRow>

          <UiTableRow v-if="transactions.length === 0">
            <UiTableCell
              :colspan="visibleColumns.length"
              class="h-24 text-center text-gray-500"
            >
              Транзакцій не знайдено.
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
