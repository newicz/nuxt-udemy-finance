<template>
  <UModal v-model:open="isOpen" title="Add new transaction">
    <template #body>
      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormField
          label="Transaction type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            :items="types"
            placeholder="Select transaction type"
            class="w-full"
            v-model="state.type"
          />
        </UFormField>
        <UFormField label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            class="w-full"
            v-model.number="state.amount"
          />
        </UFormField>
        <UFormField
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            class="w-full"
            v-model="state.created_at"
          />
        </UFormField>
        <UFormField
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            placeholder="Description"
            class="w-full"
            v-model="state.description"
          />
        </UFormField>
        <UFormField
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
          v-if="state.type == 'Expense'"
        >
          <USelect
            :items="categories"
            placeholder="Category"
            class="w-full"
            v-model="state.category"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Save"
          color="primary"
          variant="solid"
          :loading="isLoading"
        />
      </UForm>
    </template>

    <!-- <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="isOpen = false"
      />
      <UButton type="submit" label="Save" color="primary" />
    </template> -->
  </UModal>
</template>

<script setup>
import { categories, types } from "~/utils/constants";
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "saved"]);
const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};
const state = ref({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
};

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be grater than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});
const investmentSchema = z.object({
  type: z.literal("Investement"),
});
const savingsSchema = z.object({
  type: z.literal("Savings"),
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    savingsSchema,
    investmentSchema,
  ]),
  defaultSchema
);

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const save = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value });

    if (!error) {
      toastSuccess("Transaction saved!")
      isOpen.value = false;
      emit("saved");
      return;
    }

    throw error;
  } catch (e) {
    toastError("Transaction not saved!")
  } finally {
    isLoading.value = false;
  }
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
