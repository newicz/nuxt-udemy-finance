<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormField
      class="mb-4"
      label="Transaction view"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        :items="transactionViewOptions"
        class="w-64"
      />
    </UFormField>

    <UButton
      type="submit"
      color="primary"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>
<script setup>
import { z } from "zod";
import { transactionViewOptions } from "~/utils/constants";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const state = ref({
  transactionView:
    user.value.user_metadata?.transaction_view ?? transactionViewOptions[1],
});

const schema = z.object({
  transactionView: z.enum(transactionViewOptions),
});

const saveSettings = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView,
      },
    });
    if (error) throw error;
    toastSuccess("Settings updated");
  } catch (error) {
    toastError("Error updating settings", error.message);
  } finally {
    pending.value = false;
  }
};
</script>
