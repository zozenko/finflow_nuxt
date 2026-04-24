<script setup lang="ts">
import { ref, computed } from "vue";
import { Settings2, ArrowRight, Triangle } from "lucide-vue-next";
import { TRANSACTION_COLUMNS_CONFIG } from "~/constants/transaction-columns";

const { getCategoryById } = useCategories();
const { getGroupById } = useGroups();
const { recentTransactions, isRecentLoading } = useTransactions();

const columns = ref([...TRANSACTION_COLUMNS_CONFIG]);

const visibleColumns = computed(() =>
  columns.value.filter((col) => col.visible),
);

const isVisible = (id: string) =>
  columns.value.find((c) => c.id === id)?.visible;
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">
        {{ $t("transaction.recent_title") }}
      </h2>

      <div class="flex items-center gap-2">
        <UiButton
          variant="ghost"
          size="sm"
          as-child
          class="text-muted-foreground hover:text-primary"
        >
          <NuxtLinkLocale to="/transactions" class="flex items-center gap-1">
            {{ $t("common.all") }}
            <ArrowRight class="w-4 h-4" />
          </NuxtLinkLocale>
        </UiButton>

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
              class="text-center"
              :class="{
                'text-left':
                  col.id === 'title' || col.id === 'transaction_date',
                'text-right ': col.id === 'amount',
              }"
            >
              {{ $t(col.label) }}
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>

        <UiTableBody>
          <template v-if="!isRecentLoading">
            <UiTableRow
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="h-14"
            >
              <UiTableCell
                v-if="isVisible('transaction_date')"
                class="whitespace-nowrap"
              >
                {{ new Date(tx.transaction_date).toLocaleDateString("uk-UA") }}
              </UiTableCell>

              <UiTableCell v-if="isVisible('title')">
                <span
                  class="font-medium whitespace-normal line-clamp-2"
                  :title="tx.title"
                >
                  {{ tx.title }}
                </span>
              </UiTableCell>

              <UiTableCell v-if="isVisible('group_id')">
                <div class="flex justify-center">
                  <UiBadge
                    class="font-normal inline-block max-w-25 truncate"
                    :style="{
                      backgroundColor: getGroupById(tx.group_id)?.color,
                    }"
                  >
                    {{
                      getGroupById(tx.group_id)?.name || $t("common.no_group")
                    }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('category_id')">
                <div class="flex justify-center">
                  <UiBadge
                    class="font-normal inline-block max-w-25 truncate"
                    :style="{
                      backgroundColor: getCategoryById(tx.category_id)?.color,
                    }"
                  >
                    {{
                      getCategoryById(tx.category_id)?.name ||
                      $t("common.no_category")
                    }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('type')">
                <div class="flex justify-center">
                  <UiBadge :variant="tx.type" class="font-normal">
                    {{ tx.type }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('amount')" class="text-right">
                <div class="flex items-center justify-end gap-1.5 font-bold">
                  <Triangle
                    :class="[
                      'w-3 h-3 fill-current transition-transform',
                      {
                        'text-primary': tx.type === 'income',
                        'text-destructive': tx.type === 'expense',
                        'opacity-0 pointer-events-none': tx.type === 'transfer',
                        'rotate-180': tx.type === 'expense',
                      },
                    ]"
                  />
                  {{ tx.amount }} ₴
                </div>
              </UiTableCell>

              <UiTableCell v-if="isVisible('actions')">
                <div class="flex justify-center">
                  <EntityActions></EntityActions>
                </div>
              </UiTableCell>
            </UiTableRow>
          </template>

          <UiTableRow v-else>
            <UiTableCell
              :colspan="visibleColumns.length"
              class="h-24 text-center"
            >
              {{ $t("common.loading") }}...
            </UiTableCell>
          </UiTableRow>

          <UiTableRow v-if="!isRecentLoading && !recentTransactions?.length">
            <UiTableCell
              :colspan="visibleColumns.length"
              class="h-24 text-center text-muted-foreground"
            >
              {{ $t("transaction.recent_empty") }}
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
