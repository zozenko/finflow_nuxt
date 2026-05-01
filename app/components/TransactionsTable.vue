<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Settings2,
  Triangle,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { TRANSACTION_COLUMNS_CONFIG } from "~/constants/transaction-columns";

const { getCategoryById } = useCategories();
const { getGroupById } = useGroups();
const { getAccountById } = useAccounts();
const modalStore = useModalStore();

const perPageOptions = [10, 20, 50, 100];
const page = ref(1);
const perPage = ref(10);
const sortKey = ref<string>("transaction_date");
const sortOrder = ref<"asc" | "desc">("desc");

const { transactions, isLoading, totalPages, totalItems } = useTransactions({
  page,
  perPage,
  sortKey,
  sortOrder,
});

const handleSort = (colId: string) => {
  if (colId === "actions") return;

  if (sortKey.value === colId) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = colId;
    sortOrder.value = "desc";
  }
  page.value = 1;
};

const columns = ref([...TRANSACTION_COLUMNS_CONFIG]);
const visibleColumns = computed(() =>
  columns.value.filter((col) => col.visible),
);
const isVisible = (id: string) =>
  columns.value.find((c) => c.id === id)?.visible;
</script>

<template>
  <div class="flex flex-col gap-4 mt-5">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">
        {{ $t("transaction.recent_title") }}
      </h2>

      <div class="flex items-center gap-2">
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton
              variant="outline"
              size="sm"
              class="flex items-center gap-2"
            >
              <Settings2 class="w-4 h-4" />
              <span class="hidden sm:inline">{{ $t("common.columns") }}</span>
            </UiButton>
          </UiDropdownMenuTrigger>

          <UiDropdownMenuContent align="end" class="bg-section min-w-40">
            <UiDropdownMenuCheckboxItem
              v-for="col in columns"
              :key="col.id"
              :model-value="col.visible"
              @select.prevent="col.visible = !col.visible"
            >
              {{ $t(col.label) }}
            </UiDropdownMenuCheckboxItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </div>

    <div class="border rounded-xl overflow-hidden bg-section shadow-sm">
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead
              v-for="col in visibleColumns"
              :key="col.id"
              class="transition-colors"
              :class="{
                'cursor-pointer hover:bg-hover-light': col.id !== 'actions',
                'w-px whitespace-nowrap': col.id !== 'title',
              }"
              @click="handleSort(col.id)"
            >
              <div
                class="flex items-center gap-2"
                :class="{
                  'flex-row-reverse': col.id === 'amount',
                  'justify-center': ![
                    'amount',
                    'transaction_date',
                    'title',
                  ].includes(col.id),
                }"
              >
                <span>{{ $t(col.label) }}</span>
                <template v-if="col.id !== 'actions'">
                  <ArrowUp
                    v-if="sortKey === col.id && sortOrder === 'asc'"
                    class="w-3.5 h-3.5 text-primary"
                  />
                  <ArrowDown
                    v-else-if="sortKey === col.id && sortOrder === 'desc'"
                    class="w-3.5 h-3.5 text-primary"
                  />
                  <ArrowUpDown
                    v-else
                    class="w-3.5 h-3.5 text-muted-foreground/50"
                  />
                </template>
              </div>
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>

        <UiTableBody>
          <template v-if="!isLoading && transactions?.length">
            <UiTableRow
              v-for="transaction in transactions"
              :key="transaction.id"
              class="h-14"
            >
              <UiTableCell
                v-if="isVisible('transaction_date')"
                class="whitespace-nowrap"
              >
                {{
                  new Date(transaction.transaction_date).toLocaleDateString(
                    "uk-UA",
                  )
                }}
              </UiTableCell>

              <UiTableCell v-if="isVisible('title')">
                <span
                  class="font-medium whitespace-normal line-clamp-2"
                  :title="transaction.description || transaction.title"
                >
                  {{ transaction.title }}
                </span>
              </UiTableCell>

              <UiTableCell v-if="isVisible('account_id')">
                <div class="flex justify-center">
                  <UiBadge
                    class="font-normal inline-block max-w-25 truncate"
                    :style="{
                      backgroundColor: getAccountConfig(
                        getAccountById(transaction.account_id)?.type,
                      ).color,
                    }"
                  >
                    {{
                      getAccountById(transaction.account_id)?.name ||
                      $t("common.no_group")
                    }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('group_id')">
                <div class="flex justify-center">
                  <div
                    v-if="transaction.type === 'transfer'"
                    class="h-0.5 w-8 rounded-full bg-border"
                  />
                  <UiBadge
                    v-else
                    class="font-normal inline-block max-w-25 truncate"
                    :style="{
                      backgroundColor: getGroupById(transaction.group_id)
                        ?.color,
                    }"
                  >
                    {{
                      getGroupById(transaction.group_id)?.name ||
                      $t("common.no_group")
                    }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('category_id')">
                <div class="flex justify-center">
                  <div
                    v-if="transaction.type === 'transfer'"
                    class="h-0.5 w-8 rounded-full bg-border"
                  />
                  <UiBadge
                    v-else
                    class="font-normal inline-block max-w-25 truncate"
                    :style="{
                      backgroundColor: getCategoryById(transaction.category_id)
                        ?.color,
                    }"
                  >
                    {{
                      getCategoryById(transaction.category_id)?.name ||
                      $t("common.no_category")
                    }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('type')">
                <div class="flex justify-center">
                  <UiBadge :variant="transaction.type" class="font-normal">
                    {{ transaction.type }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell
                v-if="isVisible('amount')"
                class="text-right whitespace-nowrap"
              >
                <div class="flex items-center justify-end gap-1.5 font-bold">
                  <Triangle
                    :class="[
                      'w-3 h-3 fill-current transition-transform',
                      {
                        'text-primary':
                          transaction.type === 'income' ||
                          (transaction.type === 'transfer' &&
                            !!transaction.parent_id),
                        'text-destructive rotate-180':
                          transaction.type === 'expense' ||
                          (transaction.type === 'transfer' &&
                            !transaction.parent_id),
                      },
                    ]"
                  />
                  {{ transaction.amount.toFixed(2) }} ₴
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('actions')">
                <div class="flex justify-center">
                  <EntityActions
                    @edit="modalStore.openTransaction(transaction)"
                  />
                </div>
              </UiTableCell>
            </UiTableRow>
          </template>

          <UiTableRow v-else-if="isLoading">
            <UiTableCell
              :colspan="visibleColumns.length"
              class="h-24 text-center"
            >
              {{ $t("common.loading") }}...
            </UiTableCell>
          </UiTableRow>

          <UiTableRow v-else>
            <UiTableCell
              :colspan="visibleColumns.length"
              class="h-24 text-center text-muted-foreground"
            >
              {{ $t("transaction.recent_empty") }}
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>

      <div
        class="flex items-center justify-between px-4 py-3 border-t bg-muted/20"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground hidden sm:inline">
            {{ $t("common.rows_per_page") }}
          </span>
          <UiSelect v-model="perPage">
            <UiSelectTrigger class="h-8">
              <UiSelectValue :placeholder="String(perPage)" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem
                v-for="option in perPageOptions"
                :key="option"
                :value="String(option)"
              >
                {{ option }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
          <span class="text-sm text-muted-foreground hidden sm:inline">
            {{ $t("common.total_items") }}{{ totalItems }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-muted-foreground">
            {{ $t("common.page_of", { page, totalPages }) }}
          </span>
          <div class="flex items-center gap-1">
            <UiButton
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="page === 1"
              @click="page--"
            >
              <ChevronLeft class="w-4 h-4" />
            </UiButton>
            <UiButton
              variant="outline"
              size="icon"
              class="h-8 w-8"
              :disabled="page >= totalPages"
              @click="page++"
            >
              <ChevronRight class="w-4 h-4" />
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
