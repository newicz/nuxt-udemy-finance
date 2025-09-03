<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormField class="mb-4" label="Full name" name="name">
      <UInput v-model="state.name" />
    </UFormField>
    <UFormField
      class="mb-4"
      label="Email"
      name="email"
      help="You will recieve email confirmation for both old and new email if you modify the email address"
    >
      <UInput v-model="state.email" />
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

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2, "name have to me at least 2 characters").optional(),
  email: z.email(),
});

const saveProfile = async () => {
  pending.value = true;

  try {
    const data = {
      data: {
        full_name: state.value.name,
      },
    };

    if (state.data.email !== user.value.email) {
      data.email = state.data.email;
    }

    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;

    toastSuccess("Profile updated", "Your peofile has been updated!");
  } catch (error) {
    toastError("Error updating profile!", error.message);
  } finally {
    pending.value = false;
  }
};
</script>
