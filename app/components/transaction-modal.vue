<template>
  <UModal v-model:open="isOpen" title="Add new transaction">
    <template #body>
      <UForm :state="state">
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
            icon="i-heroicon-calendar-days-20-solid"
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
        >
          <USelect
            :items="categories"
            placeholder="Category"
            class="w-full"
            v-model="state.category"
          />
        </UFormField>

        <UButton type="submit" label="Save" color="primary" variant="solid" />
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

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
